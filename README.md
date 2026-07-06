# CrisisPilot AI

![CrisisPilot AI Dashboard](screenshots/dashboard.png)

A production-ready, multi-agent emergency coordination platform designed for NGOs, humanitarian organizations, and municipalities. CrisisPilot AI dynamically orchestrates disaster response workflows using specialized AI agents.

Built for the **Kaggle AI Agents: Intensive Vibe Coding Capstone Project (Agents for Good Track)**.

## Features

- **Multi-Agent Architecture**: 7 fully simulated agents working in tandem.
- **SaaS Dashboard**: Premium, Material Design inspired UI with dark/light mode and micro-animations.
- **Interactive Scenarios**: Run 5 built-in emergency simulations (Flood, Earthquake, Wildfire, Hurricane, Extreme Heat).
- **Live Workflow Visualization**: Track agent reasoning, inputs, outputs, and execution timeline in real-time.
- **Comprehensive Views**: 9 dedicated pages including Incident Center, Resources, Volunteers, Communications, and Analytics.
- **Containerized**: Ready for deployment with Docker.

## The Agents

1. **Coordinator Agent**: Orchestrates workflows between all other agents based on incident inputs.
2. **Incident Analysis**: Classifies disaster type, estimates severity, and extracts structured data.
3. **Resource Allocation**: Prioritizes limited resources (hospitals, shelters, transport).
4. **Volunteer Coordination**: Matches volunteers using skills, location, and availability.
5. **Communication**: Generates multilingual SMS, Email, and Social Media alerts.
6. **Decision Support**: Ranks priorities and predicts bottlenecks.
7. **Situation Report**: Generates executive summaries and timelines.

## Getting Started

### Prerequisites
- Python 3.11+
- Docker (optional, for containerized deployment)

### Local Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MorvaridHosseinKhani/CrisisPilot-AI.git
   cd CrisisPilot-AI
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the development server:
   ```bash
   python main.py
   ```

4. Open your browser and navigate to `http://localhost:8000`.

### Docker Deployment

To build and run the application using Docker:

```bash
docker build -t crisispilot-ai .
docker run -p 8000:8000 crisispilot-ai
```

## Deployment
This application is packaged with a FastAPI backend serving a static SPA frontend. It is optimized for easy deployment to platforms like:
- Render
- Railway
- Heroku
- Google Cloud Run

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
