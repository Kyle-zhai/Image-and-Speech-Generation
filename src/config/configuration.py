# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: MIT

import os
import yaml
from dataclasses import dataclass, field, fields
from typing import Any, Optional

from langchain_core.runnables import RunnableConfig
from src.rag.retriever import Resource
from src.config.report_style import ReportStyle

CONFIG_PATH = os.path.join(os.path.dirname(__file__), "configuration.yaml")

print(f"=== Configuration Debug Info ===")
print(f"Current file: {__file__}")
print(f"Directory of current file: {os.path.dirname(__file__)}")
print(f"CONFIG_PATH: {CONFIG_PATH}")
print(f"Config file exists: {os.path.exists(CONFIG_PATH)}")

if os.path.exists(CONFIG_PATH):
    try:
        with open(CONFIG_PATH, "r") as f:
            YAML_CONFIG = yaml.safe_load(f)
        print(f"YAML_CONFIG loaded successfully: {YAML_CONFIG}")
        print(f"Available LLM types: {list(YAML_CONFIG.get('llms', {}).keys())}")
    except Exception as e:
        print(f"Error loading YAML config: {e}")
        YAML_CONFIG = {}
else:
    print("Configuration file not found!")
    YAML_CONFIG = {}

print(f"=== End Configuration Debug Info ===\n")

@dataclass(kw_only=True)
class Configuration:
    """The configurable fields."""

    resources: list[Resource] = field(default_factory=list)
    max_plan_iterations: int = 1
    max_step_num: int = 3
    max_search_results: int = 3
    mcp_settings: dict = None
    report_style: str = ReportStyle.ACADEMIC.value
    enable_deep_thinking: bool = False

    @classmethod
    def from_runnable_config(
        cls, config: Optional[RunnableConfig] = None
    ) -> "Configuration":
        """Create a Configuration instance from a RunnableConfig."""
        configurable = config["configurable"] if config and "configurable" in config else {}
        values: dict[str, Any] = {
            f.name: (
                os.environ.get(f.name.upper(), configurable.get(f.name, YAML_CONFIG.get(f.name)))
            )
            for f in fields(cls) if f.init
        }
        return cls(**{k: v for k, v in values.items() if v})