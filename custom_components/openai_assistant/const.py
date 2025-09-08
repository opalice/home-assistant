"""Constants for the OpenAI Assistant integration."""

DOMAIN = "openai_assistant"

CONF_MODEL = "model"
CONF_MAX_TOKENS = "max_tokens"
CONF_TEMPERATURE = "temperature"

DEFAULT_MODEL = "gpt-4"
DEFAULT_MAX_TOKENS = 2000
DEFAULT_TEMPERATURE = 0.7

SERVICE_ASK_CHATGPT = "ask_chatgpt"
SERVICE_ANALYZE_SYSTEM = "analyze_system"
SERVICE_EXECUTE_SUGGESTION = "execute_suggestion"