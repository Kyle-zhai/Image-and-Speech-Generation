import google.generativeai as genai

genai.configure(api_key="AIzaSyB5zyS4cF28TR-AA40fWS_3aF7E3OJ1np0")

def generate_image(prompt: str) -> str:

    try:
        model = genai.GenerativeModel('imagen-3')
        response = model.generate_image(prompt=prompt)
        return response.image_url 
    except Exception as e:
        return f"[Image generation failed] {str(e)}"