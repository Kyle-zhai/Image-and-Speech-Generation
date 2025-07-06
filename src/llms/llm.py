from pathlib import Path
from typing import Any, Dict
import os
import ssl
import httpx

from langchain_openai import ChatOpenAI
from langchain_deepseek import ChatDeepSeek
from typing import get_args

try:
    from langchain_google_genai import ChatGoogleGenerativeAI
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    print("Warning: langchain_google_genai not available. Install with: pip install langchain-google-genai")

from src.config import load_yaml_config
from src.config.agents import LLMType

# Cache for LLM instances
_llm_cache: dict[LLMType, ChatOpenAI] = {}


def _get_config_file_path() -> str:
    """Get the path to the configuration file."""

    return str((Path(__file__).parent.parent.parent / "configuration.yaml").resolve())


def _get_llm_type_config_keys() -> dict[str, str]:
    """Get mapping of LLM types to their configuration keys."""
    return {
        "reasoning": "REASONING_MODEL",
        "basic": "BASIC_MODEL",
        "vision": "VISION_MODEL",
    }


def _get_env_llm_conf(llm_type: str) -> Dict[str, Any]:
    """
    Get LLM configuration from environment variables.
    Environment variables should follow the format: {LLM_TYPE}__{KEY}
    e.g., BASIC_MODEL__api_key, BASIC_MODEL__base_url
    """
    prefix = f"{llm_type.upper()}_MODEL__"
    conf = {}
    for key, value in os.environ.items():
        if key.startswith(prefix):
            conf_key = key[len(prefix) :].lower()
            conf[conf_key] = value
    return conf


def _create_llm_use_conf(
    llm_type: LLMType, conf: Dict[str, Any]
) -> ChatOpenAI | ChatDeepSeek | Any:
    """Create LLM instance using configuration."""
    llm_type_config_keys = _get_llm_type_config_keys()
    config_key = llm_type_config_keys.get(llm_type)

    if not config_key:
        raise ValueError(f"Unknown LLM type: {llm_type}")

    llm_conf = {}
    
    if config_key in conf:
        llm_conf = conf.get(config_key, {})
    elif "llms" in conf and config_key in conf["llms"]:
        llm_conf = conf["llms"].get(config_key, {})
    elif "llms" in conf and llm_type in conf["llms"]:
        llm_conf = conf["llms"].get(llm_type, {})
    
    if llm_conf is None:
        llm_conf = {}
    
    if not isinstance(llm_conf, dict):
        raise ValueError(f"Invalid LLM configuration for {llm_type}: {llm_conf}")

    # Get configuration from environment variables
    env_conf = _get_env_llm_conf(llm_type)

    # Merge configurations, with environment variables taking precedence
    merged_conf = {**llm_conf, **env_conf}

    print(f"Debug - LLM type: {llm_type}")
    print(f"Debug - Config key: {config_key}")
    print(f"Debug - Available config keys: {list(conf.keys())}")
    print(f"Debug - YAML config: {llm_conf}")
    print(f"Debug - Environment config: {env_conf}")
    print(f"Debug - Merged config: {merged_conf}")

    if not merged_conf:
        available_configs = list(conf.keys())
        llms_configs = conf.get("llms", {})
        available_llm_configs = list(llms_configs.keys()) if isinstance(llms_configs, dict) else []
        available_env_vars = [k for k in os.environ.keys() if k.startswith(f"{llm_type.upper()}_MODEL__")]
        
        error_msg = f"""
No configuration found for LLM type: {llm_type}
Expected config key: {config_key}
Available config keys in YAML: {available_configs}
Available LLM configs in yaml.llms: {available_llm_configs}
Available environment variables: {available_env_vars}

Please ensure your configuration.yaml contains either:
1. A top-level '{config_key}' section, or
2. A 'llms.{config_key}' section, or
3. A 'llms.{llm_type}' section

Or set environment variables like:
export {llm_type.upper()}_MODEL__model="your-model"
export {llm_type.upper()}_MODEL__api_key="your-api-key"
"""
        raise ValueError(error_msg)

    required_fields = ["model"]
    missing_fields = [field for field in required_fields if not merged_conf.get(field)]
    
    if missing_fields:
        raise ValueError(f"Missing required fields {missing_fields} for LLM type: {llm_type}")

    provider = merged_conf.get("provider", "openai").lower()
    
    if provider == "gemini":
        if not GEMINI_AVAILABLE:
            raise ValueError("Google Gemini support not available. Install with: pip install langchain-google-genai")
  
        gemini_conf = {
            "model": merged_conf["model"],
            "google_api_key": merged_conf["api_key"],
        }
        
      
        if "temperature" in merged_conf:
            gemini_conf["temperature"] = merged_conf["temperature"]
        if "max_tokens" in merged_conf:
            gemini_conf["max_output_tokens"] = merged_conf["max_tokens"]
        
        print(f"Debug - Gemini config: {gemini_conf}")
        return ChatGoogleGenerativeAI(**gemini_conf)
        
    elif provider == "openai":
        
        merged_conf.pop("provider", None)
    elif provider == "deepseek":
      
        merged_conf.pop("provider", None)
        if "base_url" not in merged_conf:
            merged_conf["base_url"] = "https://api.deepseek.com"


    if llm_type == "reasoning":
        merged_conf["api_base"] = merged_conf.pop("base_url", None)

    # Handle SSL verification settings
    verify_ssl = merged_conf.pop("verify_ssl", True)

    # Create custom HTTP client if SSL verification is disabled
    if not verify_ssl:
        http_client = httpx.Client(verify=False)
        http_async_client = httpx.AsyncClient(verify=False)
        merged_conf["http_client"] = http_client
        merged_conf["http_async_client"] = http_async_client

    if llm_type == "reasoning" or provider == "deepseek":
        return ChatDeepSeek(**merged_conf)
    else:
        return ChatOpenAI(**merged_conf)


def get_llm_by_type(
    llm_type: LLMType,
) -> ChatOpenAI | Any:
    """
    Get LLM instance by type. Returns cached instance if available.
    """
    if llm_type in _llm_cache:
        return _llm_cache[llm_type]

    config_path = _get_config_file_path()
    print(f"Debug - Loading config from: {config_path}")
    print(f"Debug - Config file exists: {os.path.exists(config_path)}")
    
    if not os.path.exists(config_path):
        print(f"Warning: Config file not found at {config_path}")
        conf = {}
    else:
        try:
            conf = load_yaml_config(config_path)
            print(f"Debug - Loaded config keys: {list(conf.keys())}")
        except Exception as e:
            print(f"Error loading config: {e}")
            conf = {}

    llm = _create_llm_use_conf(llm_type, conf)
    _llm_cache[llm_type] = llm
    return llm


def get_configured_llm_models() -> dict[str, list[str]]:
    """
    Get all configured LLM models grouped by type.

    Returns:
        Dictionary mapping LLM type to list of configured model names.
    """
    try:
        config_path = _get_config_file_path()
        if not os.path.exists(config_path):
            return {}
            
        conf = load_yaml_config(config_path)
        llm_type_config_keys = _get_llm_type_config_keys()

        configured_models: dict[str, list[str]] = {}

        for llm_type in get_args(LLMType):
            # Get configuration from YAML file
            config_key = llm_type_config_keys.get(llm_type, "")

            yaml_conf = {}
            if config_key in conf:
                yaml_conf = conf.get(config_key, {})
            elif "llms" in conf and config_key in conf["llms"]:
                yaml_conf = conf["llms"].get(config_key, {})
            elif "llms" in conf and llm_type in conf["llms"]:
                yaml_conf = conf["llms"].get(llm_type, {})

            # Get configuration from environment variables
            env_conf = _get_env_llm_conf(llm_type)

            # Merge configurations, with environment variables taking precedence
            merged_conf = {**yaml_conf, **env_conf}

            # Check if model is configured
            model_name = merged_conf.get("model")
            if model_name:
                configured_models.setdefault(llm_type, []).append(model_name)

        return configured_models

    except Exception as e:
        # Log error and return empty dict to avoid breaking the application
        print(f"Warning: Failed to load LLM configuration: {e}")
        return {}


# In the future, we will use reasoning_llm and vl_llm for different purposes
# reasoning_llm = get_llm_by_type("reasoning")
# vl_llm = get_llm_by_type("vision")

