from src.tools.google_speech_tool import generate_speech
from src.types.agent_response import AgentResponse

def speech_agent_node(state: dict) -> dict:
    text = state.get("input", "")
    if not text:
        return {"error": "No text provided."}

    audio_url = generate_speech(text)
    response = AgentResponse.from_audio(url=audio_url, name="Generated Speech")

    return {
        "output": response,
        "type": response.type.value
    }