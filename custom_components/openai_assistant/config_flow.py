"""Config flow for OpenAI Assistant integration."""
from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
import openai

from homeassistant import config_entries
from homeassistant.const import CONF_API_KEY, CONF_NAME
from homeassistant.data_entry_flow import FlowResult
import homeassistant.helpers.config_validation as cv

from .const import DOMAIN, CONF_MODEL, CONF_MAX_TOKENS, CONF_TEMPERATURE

_LOGGER = logging.getLogger(__name__)

STEP_USER_DATA_SCHEMA = vol.Schema({
    vol.Required(CONF_NAME, default="OpenAI Assistant"): str,
    vol.Required(CONF_API_KEY): str,
    vol.Optional(CONF_MODEL, default="gpt-4"): vol.In([
        "gpt-4", "gpt-4-turbo-preview", "gpt-3.5-turbo", "gpt-3.5-turbo-16k"
    ]),
    vol.Optional(CONF_MAX_TOKENS, default=2000): vol.All(int, vol.Range(min=100, max=4000)),
    vol.Optional(CONF_TEMPERATURE, default=0.7): vol.All(vol.Coerce(float), vol.Range(min=0.0, max=2.0)),
})

class ConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for OpenAI Assistant."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle the initial step."""
        if user_input is None:
            return self.async_show_form(
                step_id="user", 
                data_schema=STEP_USER_DATA_SCHEMA,
                description_placeholders={
                    "docs_url": "https://platform.openai.com/api-keys"
                }
            )

        errors = {}

        try:
            # Test the API key
            openai.api_key = user_input[CONF_API_KEY]
            
            # Test with a simple request
            await self.hass.async_add_executor_job(
                openai.ChatCompletion.create,
                {
                    "model": user_input[CONF_MODEL],
                    "messages": [{"role": "user", "content": "Test"}],
                    "max_tokens": 10
                }
            )
        except openai.AuthenticationError:
            errors["base"] = "invalid_auth"
        except openai.RateLimitError:
            errors["base"] = "rate_limit"
        except Exception as e:
            _LOGGER.exception("Unexpected error testing OpenAI API")
            errors["base"] = "cannot_connect"

        if not errors:
            # Check if already configured
            await self.async_set_unique_id(user_input[CONF_API_KEY][:8])
            self._abort_if_unique_id_configured()

            return self.async_create_entry(
                title=user_input[CONF_NAME],
                data=user_input
            )

        return self.async_show_form(
            step_id="user", 
            data_schema=STEP_USER_DATA_SCHEMA, 
            errors=errors,
            description_placeholders={
                "docs_url": "https://platform.openai.com/api-keys"
            }
        )