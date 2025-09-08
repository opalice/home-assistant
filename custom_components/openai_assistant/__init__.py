"""OpenAI Assistant integration for Home Assistant."""
import logging
from datetime import timedelta
from typing import Dict, Any

import voluptuous as vol
import homeassistant.helpers.config_validation as cv
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers.entity_registry import async_get as async_get_entity_registry
from homeassistant.helpers.device_registry import async_get as async_get_device_registry
from homeassistant.helpers.area_registry import async_get as async_get_area_registry
from homeassistant.exceptions import ConfigEntryNotReady
from homeassistant.const import CONF_API_KEY, CONF_NAME

import openai
import json
import asyncio

_LOGGER = logging.getLogger(__name__)

DOMAIN = "openai_assistant"
VERSION = "1.0.0"

CONF_MODEL = "model"
CONF_MAX_TOKENS = "max_tokens"
CONF_TEMPERATURE = "temperature"

DEFAULT_MODEL = "gpt-4"
DEFAULT_MAX_TOKENS = 2000
DEFAULT_TEMPERATURE = 0.7

PLATFORMS = ["sensor"]

SCAN_INTERVAL = timedelta(minutes=5)

SERVICE_ASK_CHATGPT = "ask_chatgpt"
SERVICE_ANALYZE_SYSTEM = "analyze_system"
SERVICE_EXECUTE_SUGGESTION = "execute_suggestion"

ASK_CHATGPT_SCHEMA = vol.Schema({
    vol.Required("message"): cv.string,
    vol.Optional("include_context", default=True): cv.boolean,
})

ANALYZE_SYSTEM_SCHEMA = vol.Schema({
    vol.Optional("focus_area"): cv.string,
})

EXECUTE_SUGGESTION_SCHEMA = vol.Schema({
    vol.Required("suggestion_id"): cv.string,
    vol.Required("confirmed", default=False): cv.boolean,
})

async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up the OpenAI Assistant component."""
    hass.data[DOMAIN] = {}
    return True

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up OpenAI Assistant from a config entry."""
    api_key = entry.data[CONF_API_KEY]
    model = entry.data.get(CONF_MODEL, DEFAULT_MODEL)
    max_tokens = entry.data.get(CONF_MAX_TOKENS, DEFAULT_MAX_TOKENS)
    temperature = entry.data.get(CONF_TEMPERATURE, DEFAULT_TEMPERATURE)

    # Initialize OpenAI client
    openai.api_key = api_key

    # Store configuration
    hass.data[DOMAIN][entry.entry_id] = {
        "api_key": api_key,
        "model": model,
        "max_tokens": max_tokens,
        "temperature": temperature,
        "conversations": [],
        "suggestions": {},
    }

    # Set up platforms
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    # Register services
    await async_setup_services(hass, entry)

    return True

async def async_setup_services(hass: HomeAssistant, entry: ConfigEntry):
    """Set up services for the OpenAI Assistant."""
    
    async def ask_chatgpt(call: ServiceCall):
        """Service to ask ChatGPT a question."""
        message = call.data["message"]
        include_context = call.data["include_context"]
        
        config = hass.data[DOMAIN][entry.entry_id]
        
        try:
            # Get system context if requested
            context = ""
            if include_context:
                context = await get_system_context(hass)
            
            # Prepare messages
            messages = [
                {
                    "role": "system",
                    "content": f"""Tu es un assistant Home Assistant expert. Tu peux analyser et optimiser les configurations Home Assistant.
                    
Context du système Home Assistant:
{context}

Règles importantes:
- Propose toujours des solutions concrètes et sécurisées
- Explique clairement tes recommendations
- Utilise le format JSON pour les suggestions d'actions
- Ne propose jamais d'actions destructrices sans validation
- Reste dans le contexte Home Assistant"""
                },
                {"role": "user", "content": message}
            ]
            
            # Add conversation history
            for conv in config["conversations"][-5:]:  # Last 5 conversations for context
                messages.extend([
                    {"role": "user", "content": conv["user"]},
                    {"role": "assistant", "content": conv["assistant"]}
                ])
            
            messages.append({"role": "user", "content": message})
            
            # Call OpenAI API
            response = await asyncio.to_thread(
                openai.ChatCompletion.create,
                model=config["model"],
                messages=messages,
                max_tokens=config["max_tokens"],
                temperature=config["temperature"],
            )
            
            assistant_response = response.choices[0].message.content
            
            # Store conversation
            config["conversations"].append({
                "user": message,
                "assistant": assistant_response,
                "timestamp": hass.helpers.dt_util.utcnow().isoformat()
            })
            
            # Fire event for frontend
            hass.bus.async_fire("openai_assistant_response", {
                "message": message,
                "response": assistant_response,
                "timestamp": hass.helpers.dt_util.utcnow().isoformat()
            })
            
        except Exception as e:
            _LOGGER.error(f"Error calling OpenAI API: {e}")
            hass.bus.async_fire("openai_assistant_error", {
                "error": str(e),
                "timestamp": hass.helpers.dt_util.utcnow().isoformat()
            })

    async def analyze_system(call: ServiceCall):
        """Service to analyze the Home Assistant system."""
        focus_area = call.data.get("focus_area", "général")
        
        config = hass.data[DOMAIN][entry.entry_id]
        
        try:
            # Get comprehensive system analysis
            analysis_prompt = f"""Analyse complète du système Home Assistant avec focus sur: {focus_area}

Analyse les points suivants:
1. Configuration des entités et leur utilisation
2. Performances et optimisations possibles
3. Sécurité et bonnes pratiques
4. Automatisations et leur efficacité
5. Intégrations et compatibilité
6. Suggestions d'améliorations concrètes

Fournis un rapport détaillé avec des suggestions d'actions spécifiques."""
            
            # Use the ask_chatgpt logic
            await ask_chatgpt(ServiceCall(DOMAIN, SERVICE_ASK_CHATGPT, {
                "message": analysis_prompt,
                "include_context": True
            }))
            
        except Exception as e:
            _LOGGER.error(f"Error analyzing system: {e}")

    async def execute_suggestion(call: ServiceCall):
        """Service to execute a ChatGPT suggestion."""
        suggestion_id = call.data["suggestion_id"]
        confirmed = call.data["confirmed"]
        
        if not confirmed:
            _LOGGER.warning("Suggestion execution attempted without confirmation")
            return
            
        config = hass.data[DOMAIN][entry.entry_id]
        
        if suggestion_id not in config["suggestions"]:
            _LOGGER.error(f"Suggestion {suggestion_id} not found")
            return
            
        suggestion = config["suggestions"][suggestion_id]
        
        try:
            # Execute the suggestion based on its type
            if suggestion["type"] == "automation":
                await execute_automation_suggestion(hass, suggestion)
            elif suggestion["type"] == "script":
                await execute_script_suggestion(hass, suggestion)
            elif suggestion["type"] == "configuration":
                await execute_config_suggestion(hass, suggestion)
            
            # Mark as executed
            suggestion["executed"] = True
            suggestion["executed_at"] = hass.helpers.dt_util.utcnow().isoformat()
            
            hass.bus.async_fire("openai_assistant_suggestion_executed", {
                "suggestion_id": suggestion_id,
                "suggestion": suggestion
            })
            
        except Exception as e:
            _LOGGER.error(f"Error executing suggestion: {e}")

    # Register services
    hass.services.async_register(
        DOMAIN, SERVICE_ASK_CHATGPT, ask_chatgpt, schema=ASK_CHATGPT_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_ANALYZE_SYSTEM, analyze_system, schema=ANALYZE_SYSTEM_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_EXECUTE_SUGGESTION, execute_suggestion, schema=EXECUTE_SUGGESTION_SCHEMA
    )

async def get_system_context(hass: HomeAssistant) -> str:
    """Get comprehensive system context for ChatGPT."""
    context_parts = []
    
    # Get entity registry
    entity_registry = async_get_entity_registry(hass)
    device_registry = async_get_device_registry(hass)
    area_registry = async_get_area_registry(hass)
    
    # Count entities by domain
    entity_counts = {}
    for entity in entity_registry.entities.values():
        domain = entity.entity_id.split(".")[0]
        entity_counts[domain] = entity_counts.get(domain, 0) + 1
    
    context_parts.append("=== ENTITÉS PAR DOMAINE ===")
    for domain, count in sorted(entity_counts.items()):
        context_parts.append(f"{domain}: {count} entités")
    
    # Get areas
    context_parts.append("\n=== ZONES CONFIGURÉES ===")
    for area in area_registry.areas.values():
        context_parts.append(f"- {area.name}")
    
    # Get devices
    context_parts.append(f"\n=== APPAREILS ===")
    context_parts.append(f"Total: {len(device_registry.devices)} appareils")
    
    # Get automations
    automations = hass.states.async_all("automation")
    context_parts.append(f"\n=== AUTOMATISATIONS ===")
    context_parts.append(f"Total: {len(automations)} automatisations")
    for auto in automations[:5]:  # Limit to first 5
        state = "activée" if auto.state == "on" else "désactivée"
        context_parts.append(f"- {auto.attributes.get('friendly_name', auto.entity_id)}: {state}")
    
    # Get scripts
    scripts = hass.states.async_all("script")
    context_parts.append(f"\n=== SCRIPTS ===")
    context_parts.append(f"Total: {len(scripts)} scripts")
    
    return "\n".join(context_parts)

async def execute_automation_suggestion(hass: HomeAssistant, suggestion: dict):
    """Execute an automation suggestion."""
    # Implementation for automation suggestions
    pass

async def execute_script_suggestion(hass: HomeAssistant, suggestion: dict):
    """Execute a script suggestion."""
    # Implementation for script suggestions
    pass

async def execute_config_suggestion(hass: HomeAssistant, suggestion: dict):
    """Execute a configuration suggestion."""
    # Implementation for configuration suggestions
    pass

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id)
    
    return unload_ok