import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.agents.image_agent import image_agent_node
from src.agents.speech_agent import speech_agent_node

def test_agents():
    image_result = image_agent_node({"input": "a futuristic city with flying cars"})
    print("Image Agent Output:", image_result)

    speech_result = speech_agent_node({"input": "Welcome to the future of AI!"})
    print("Speech Agent Output:", speech_result)

if __name__ == "__main__":
    test_agents()