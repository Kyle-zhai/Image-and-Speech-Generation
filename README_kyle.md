# Image generation and speech generation 
## Description of Tools and Agent
This project integrates two specialized tools and their corresponding agents into the LangGraph workflow system. These tools provide image generation and speech synthesis capabilities using Google’s generative AI services. Below is a description of each tool and how it connects to the agent system.

- Image Generation Tool (google_image_tool)
Purpose: Generates images based on natural language prompts using Google’s Imagen-3 model.

File: src/tools/google_image_tool.py

Function: generate_image(prompt: str) -> str

Input: A descriptive text prompt (e.g., “a white cat sitting on the moon”)

Output: A URL linking to the generated image.

Agent: image_agent_node defined in src/agents/image_agent.py

Usage: Called by the LangGraph node when the planner detects an image generation intent in the user's input.

- Speech Synthesis Tool (google_speech_tool)
Purpose: Converts a given text into speech using Google’s Gemini TTS service.

File: src/tools/google_speech_tool.py

Function: generate_speech(text: str, voice: str = "en-US-Standard-A") -> str

Input: Text to be read aloud and an optional voice ID.

Output: A URL to the generated speech audio file.

Agent: speech_agent_node defined in src/agents/speech_agent.py

Usage: Triggered by the LangGraph when a prompt suggests reading content out loud.

Agent-Orchestration Logic
These tools are registered in the agent configuration and integrated into the LangGraph flow as decision nodes.

The planner analyzes the user’s query and generates steps with types such as image_generation or speech_synthesis.

Based on the step type, the graph conditionally routes to the corresponding agent node:

image_generation → image_agent_node

speech_synthesis → speech_agent_node

Each agent node handles API invocation and updates the agent state with results such as a URL to an image or audio file.

## Setup Instructions
- Set up Conda Environment(The version of python should be 3.12!!!)
```bash

conda create -n deerflow python=3.12
conda activate deerflow

```

- Install Dependencies
use pip install to install the package we need

- Run the Application
```bash

cd deer-flow
python main.py

```
## Integration Notes
- Tool Registration
All tools are implemented under the `src/tools/` directory. Key tools include:

`google_image_tool.py` – handles image generation

`google_speech_tool.py` – handles text-to-speech synthesis

These tools are imported and registered in `src/tools/__init__.py`, making them available for use within the agent workflow:
```bash

from .google_image_tool import generate_image
from .google_speech_tool import generate_speech

```

- Agent Integration
Each tool is wrapped in an agent node to allow integration with the LangGraph execution framework:

`src/agents/image_agent.py` defines image_agent_node

`src/agents/speech_agent.py` defines speech_agent_node

These nodes are registered within the graph builder:
```bash

builder.add_node("image_generator", image_agent_node)
builder.add_node("speech_generator", speech_agent_node)

```

- Planner Integration
Planning logic is defined in `src/prompts/planner_model.py` using the `StepType` enum, which categorizes each step.

During execution, if a planned step's `step_type` matches a tool-specific type (e.g., image generation), the flow transitions to the corresponding agent node.

The planner itself is implemented as `planner_node` in `src/graph/nodes.py`.

- Graph Construction
The overall workflow graph is assembled in `src/graph/builder.py`:

`_build_base_graph()` defines all nodes and conditional edges.

`build_graph_with_memory()` enables persistent memory (using `MemorySaver`).

The compiled graph is then executed asynchronously:

```bash
graph = build_graph()
```


