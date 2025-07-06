import google.generativeai as genai

genai.configure(api_key="AIzaSyB5zyS4cF28TR-AA40fWS_3aF7E3OJ1np0")

def generate_speech(text: str, voice: str = "en-US-Standard-A") -> str:

    try:
        model = genai.GenerativeModel('tts')
        response = model.generate_audio(text=text, voice=voice)
        return response.audio_url
    except Exception as e:
        return f"[Speech generation failed] {str(e)}"