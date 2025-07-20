from typing import Optional
from pydantic import BaseModel, Field

from .agent_response_type import AgentResponseType 

class AgentResponse(BaseModel):
    type: AgentResponseType = Field(..., description="Response type: text, image, audio, video")
    content: Optional[str] = Field(None, description="Text content, if response is text")
    url: Optional[str] = Field(None, description="Media file URL (image/audio/video)")
    name: Optional[str] = Field(None, description="Display name for the media file")

    @staticmethod
    def from_text(content: str) -> "AgentResponse":
        return AgentResponse(type=AgentResponseType.TEXT, content=content)

    @staticmethod
    def from_image(url: str, name: Optional[str] = None) -> "AgentResponse":
        return AgentResponse(type=AgentResponseType.IMAGE, url=url, name=name)

    @staticmethod
    def from_audio(url: str, name: Optional[str] = None) -> "AgentResponse":
        return AgentResponse(type=AgentResponseType.AUDIO, url=url, name=name)

    @staticmethod
    def from_video(url: str, name: Optional[str] = None) -> "AgentResponse":
        return AgentResponse(type=AgentResponseType.VIDEO, url=url, name=name)
