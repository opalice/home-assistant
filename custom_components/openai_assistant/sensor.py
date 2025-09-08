"""Sensor platform for OpenAI Assistant."""
from __future__ import annotations

from datetime import timedelta
import logging
from typing import Any

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import (
    CoordinatorEntity,
    DataUpdateCoordinator,
)

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

SCAN_INTERVAL = timedelta(minutes=5)

async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the OpenAI Assistant sensor."""
    coordinator = OpenAIAssistantCoordinator(hass, entry)
    
    await coordinator.async_config_entry_first_refresh()
    
    async_add_entities([
        OpenAIAssistantSensor(coordinator, entry),
        OpenAIConversationCountSensor(coordinator, entry),
        OpenAISuggestionCountSensor(coordinator, entry),
    ])

class OpenAIAssistantCoordinator(DataUpdateCoordinator):
    """Data update coordinator for OpenAI Assistant."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        """Initialize the coordinator."""
        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            update_interval=SCAN_INTERVAL,
        )
        self.entry = entry

    async def _async_update_data(self) -> dict[str, Any]:
        """Update data via library."""
        config = self.hass.data[DOMAIN][self.entry.entry_id]
        
        return {
            "conversations_count": len(config["conversations"]),
            "suggestions_count": len(config["suggestions"]),
            "last_conversation": config["conversations"][-1] if config["conversations"] else None,
            "status": "ready",
        }

class OpenAIAssistantSensor(CoordinatorEntity, SensorEntity):
    """OpenAI Assistant status sensor."""

    def __init__(self, coordinator: OpenAIAssistantCoordinator, entry: ConfigEntry) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator)
        self.entry = entry
        self._attr_unique_id = f"{entry.entry_id}_status"
        self._attr_name = "OpenAI Assistant Status"

    @property
    def native_value(self) -> str:
        """Return the state of the sensor."""
        return self.coordinator.data.get("status", "unknown")

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return the state attributes."""
        config = self.hass.data[DOMAIN][self.entry.entry_id]
        last_conv = self.coordinator.data.get("last_conversation")
        
        return {
            "model": config["model"],
            "conversations_today": len([
                c for c in config["conversations"] 
                if c["timestamp"].startswith(self.hass.helpers.dt_util.now().strftime("%Y-%m-%d"))
            ]),
            "total_conversations": len(config["conversations"]),
            "total_suggestions": len(config["suggestions"]),
            "last_interaction": last_conv["timestamp"] if last_conv else None,
        }

class OpenAIConversationCountSensor(CoordinatorEntity, SensorEntity):
    """OpenAI conversation count sensor."""

    def __init__(self, coordinator: OpenAIAssistantCoordinator, entry: ConfigEntry) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator)
        self.entry = entry
        self._attr_unique_id = f"{entry.entry_id}_conversations"
        self._attr_name = "OpenAI Conversations"
        self._attr_icon = "mdi:chat"

    @property
    def native_value(self) -> int:
        """Return the number of conversations."""
        return self.coordinator.data.get("conversations_count", 0)

class OpenAISuggestionCountSensor(CoordinatorEntity, SensorEntity):
    """OpenAI suggestion count sensor."""

    def __init__(self, coordinator: OpenAIAssistantCoordinator, entry: ConfigEntry) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator)
        self.entry = entry
        self._attr_unique_id = f"{entry.entry_id}_suggestions"
        self._attr_name = "OpenAI Suggestions"
        self._attr_icon = "mdi:lightbulb-on"

    @property
    def native_value(self) -> int:
        """Return the number of suggestions."""
        return self.coordinator.data.get("suggestions_count", 0)