# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: MIT

from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class StepType(str, Enum):
    RESEARCH = "research"
    PROCESSING = "processing"


class Step(BaseModel):
    need_search: bool = Field(..., description="Must be explicitly set for each step")
    title: str
    description: str = Field(..., description="Specify exactly what data to collect")
    step_type: StepType = Field(..., description="Indicates the nature of the step")
    execution_res: Optional[str] = Field(
        default=None, description="The Step execution result"
    )


class Plan(BaseModel):
    locale: str = Field(
        ..., description="e.g. 'en-US' or 'zh-CN', based on the user's language"
    )
    has_enough_context: bool
    thought: str
    title: str
    steps: List[Step] = Field(
        default_factory=list,
        description="Research & Processing steps to get more context",
    )

    class Config:
        json_schema_extra = {
            "examples": [
                {
                    "has_enough_context": False,
                    "thought": (
                        "To understand the current market trends in AI, we need to gather comprehensive information."
                    ),
                    "title": "AI Market Research Plan",
                    "steps": [
                        {
                            "need_search": True,
                            "title": "Current AI Market Analysis",
                            "description": (
                                "Collect data on market size, growth rates, major players, and investment trends in AI sector."
                            ),
                            "step_type": "research",
                        }
                    ],
                },
                {
                    "has_enough_context": True,
                    "thought": "The user wants an image of a robot dog.",
                    "title": "Generate Robot Dog Image",
                    "steps": [
                        {
                            "need_search": False,
                            "title": "Render robot dog",
                            "description": "Use Imagen-3 to generate an image of a futuristic robot dog with glowing eyes.",
                            "step_type": "image_generation"
                        }
                    ]
                },
                {
                    "has_enough_context": True,
                    "thought": "The user wants to hear a welcome message aloud.",
                    "title": "Synthesize Welcome Speech",
                    "steps": [
                        {
                            "need_search": False,
                            "title": "Generate speech audio",
                            "description": "Use Gemini TTS to speak 'Welcome to DeerFlow!' in a natural voice.",
                            "step_type": "speech_synthesis"
                        }
                    ]
                }
            ]
        }
