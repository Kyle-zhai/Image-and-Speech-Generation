from src.tools.google_speech_tool import generate_speech

def speech_agent_node(state: dict) -> dict:

    text = state.get("input", "")
    if not text:
        return {"error": "No text provided."}
    
    audio_url = generate_speech(text)
    return {
        "output": audio_url,
        "type": "audio"
    }