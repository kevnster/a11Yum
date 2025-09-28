#!/bin/bash

# a11Yum Recipe Agent Startup Script
# This script helps you get started with the Google ADK agent

echo "🍳 a11Yum Recipe Agent Setup"
echo "================================"

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source .venv/bin/activate

# Install/upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo "📋 Installing requirements..."
pip install -r requirements.txt

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 You can now run the agent in different ways:"
echo ""
echo "1. Start the FastAPI server (main API):"
echo "   python main.py"
echo "   (Then visit http://localhost:8000/docs for API documentation)"
echo ""
echo "2. Test the API endpoints:"
echo "   python test_api.py"
echo ""
echo "3. Test the agent directly:"
echo "   python test_agent.py"
echo ""
echo "4. Use the alternative FastAPI backend:"
echo "   python fastapi_backend.py"
echo ""
echo "💡 Make sure you have Google Cloud credentials configured for the ADK to work properly."
echo "💡 You may need to install additional Google Cloud dependencies based on your setup."