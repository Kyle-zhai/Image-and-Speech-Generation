from src.tools.google_image_tool import generate_image

def image_agent_node(state: dict) -> dict:

    prompt = state.get("input", "")
    if not prompt:
        return {"error": "No prompt provided."}
    
    image_url = generate_image(prompt)
    return {
        "output": image_url,
        "type": "image"
    }