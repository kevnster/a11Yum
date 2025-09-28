# Copyright 2025 - a11Yum Recipe Assistant
# FastAPI backend for accessible recipe assistance using Google ADK

import os
import json
import asyncio
from pathlib import Path
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any

from google.adk.runners import InMemoryRunner
from google.adk.agents.run_config import RunConfig
from google.genai import types
from google.genai.types import Content, Part

# Import our agent
from agent import root_agent, scrape_recipe_from_url

# Load environment variables
load_dotenv()

# Configuration
APP_NAME = "a11Yum Recipe Assistant"

#
# Pydantic Models for API
#

class RecipeQuery(BaseModel):
    user_input: str
    session_id: Optional[str] = "default"
    user_id: Optional[str] = "user"

class RecipeResponse(BaseModel):
    success: bool
    response: Optional[str] = None
    error: Optional[str] = None
    session_id: Optional[str] = None
    user_id: Optional[str] = None

class SessionInfo(BaseModel):
    session_id: str
    user_id: str
    status: str

class RecipeURLRequest(BaseModel):
    url: str
    user_id: Optional[str] = "user"
    session_id: Optional[str] = "recipe_scrape"

class RecipeScrapingResponse(BaseModel):
    success: bool
    recipe_data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    url: str
    processing_time: Optional[float] = None

#
# Agent Session Management
#

class AgentSessionManager:
    def __init__(self):
        self.sessions: Dict[str, Any] = {}
        self.runners: Dict[str, Any] = {}
    
    async def get_or_create_session(self, user_id: str, session_id: str):
        """Get existing session or create a new one"""
        session_key = f"{user_id}_{session_id}"
        
        if session_key not in self.sessions:
            # Create a new runner
            runner = InMemoryRunner(
                app_name=APP_NAME,
                agent=root_agent,
            )
            
            # Create a session
            session = await runner.session_service.create_session(
                app_name=APP_NAME,
                user_id=user_id,
            )
            
            # Store both runner and session
            self.runners[session_key] = runner
            self.sessions[session_key] = session
            
            print(f"✅ Created new session: {session_key}")
        
        return self.runners[session_key], self.sessions[session_key]
    
    async def send_message(self, user_id: str, session_id: str, message: str):
        """Send a message to the agent and get response"""
        try:
            runner, session = await self.get_or_create_session(user_id, session_id)
            
            # Create content from message
            content = Content(role="user", parts=[Part.from_text(text=message)])
            
            # Run config for text response
            run_config = RunConfig(
                response_modalities=["TEXT"],
                session_resumption=types.SessionResumptionConfig()
            )
            
            # Run the agent
            events = runner.run_async(
                session=session,
                new_message=content,
                run_config=run_config
            )
            
            # Collect the response
            response_text = ""
            async for event in events:
                if event.is_final_response():
                    # Extract text from the response
                    if event.content and event.content.parts:
                        for part in event.content.parts:
                            if part.text:
                                response_text += part.text
            
            return response_text if response_text else "No response received from agent."
            
        except Exception as e:
            print(f"❌ Error in send_message: {e}")
            raise e
    
    def get_session_info(self, user_id: str, session_id: str):
        """Get information about a session"""
        session_key = f"{user_id}_{session_id}"
        exists = session_key in self.sessions
        
        return {
            "session_id": session_id,
            "user_id": user_id,
            "status": "active" if exists else "not_found",
            "session_key": session_key
        }
    
    def list_sessions(self):
        """List all active sessions"""
        return list(self.sessions.keys())

# Initialize session manager
session_manager = AgentSessionManager()

#
# FastAPI Application
#

# Using lifespan events (modern FastAPI approach)
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting a11Yum Recipe Assistant API with Google ADK...")
    print(f"📊 Agent: {getattr(root_agent, 'name', 'gideon')}")
    print(f"📋 App: {APP_NAME}")
    yield
    # Shutdown
    print("🔄 Shutting down a11Yum Recipe Assistant API...")

app = FastAPI(
    title="a11Yum Recipe Assistant API",
    description="Accessible recipe assistance using Google ADK with search capabilities",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#
# API Endpoints
#

@app.get("/")
async def root():
    """Health check and service info"""
    return {
        "service": "a11Yum Recipe Assistant API",
        "status": "healthy",
        "app_name": APP_NAME,
        "description": "Accessible recipe assistance with Google Search"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    active_sessions = session_manager.list_sessions()
    return {
        "status": "healthy",
        "active_sessions": len(active_sessions),
        "app_name": APP_NAME,
        "agent_name": root_agent.name if hasattr(root_agent, 'name') else "gideon"
    }

@app.post("/chat", response_model=RecipeResponse)
async def chat_with_agent(query: RecipeQuery):
    """
    Send a message to the recipe assistant agent.
    The agent can help with accessible cooking tips, recipes, and answer questions using Google Search.
    """
    print(f"📥 Received query from {query.user_id}/{query.session_id}: {query.user_input}")
    
    try:
        # Send message to agent
        response_text = await session_manager.send_message(
            user_id=query.user_id,
            session_id=query.session_id,
            message=query.user_input
        )
        
        print(f"✅ Agent response: {response_text[:100]}...")
        
        return RecipeResponse(
            success=True,
            response=response_text,
            session_id=query.session_id,
            user_id=query.user_id
        )
        
    except Exception as e:
        error_msg = f"Error processing query: {str(e)}"
        print(f"❌ {error_msg}")
        
        return RecipeResponse(
            success=False,
            error=error_msg,
            session_id=query.session_id,
            user_id=query.user_id
        )

@app.get("/session/{user_id}/{session_id}", response_model=SessionInfo)
async def get_session_info(user_id: str, session_id: str):
    """Get information about a specific session"""
    info = session_manager.get_session_info(user_id, session_id)
    return SessionInfo(**info)

@app.get("/sessions")
async def list_active_sessions():
    """List all active sessions"""
    sessions = session_manager.list_sessions()
    return {
        "active_sessions": sessions,
        "count": len(sessions)
    }

@app.post("/scrape-recipe", response_model=RecipeScrapingResponse)
async def scrape_recipe_endpoint(request: RecipeURLRequest):
    """
    Scrape recipe data from a given URL using Google Search tool.
    Returns structured recipe data matching the example-recipe-structure.json format.
    
    This endpoint uses the Google ADK agent to:
    1. Search and extract recipe information from the provided URL
    2. Structure the data with accessibility features and alternatives
    3. Format ingredients, tools, and steps with adaptive options
    4. Include nutritional information and cooking guidance
    """
    import time
    start_time = time.time()
    
    print(f"🔍 Scraping recipe from URL: {request.url}")
    
    try:
        # Call the recipe scraping function
        recipe_data = await scrape_recipe_from_url(request.url)
        
        processing_time = time.time() - start_time
        
        # Check if there was an error in the scraping
        if "error" in recipe_data:
            print(f"❌ Recipe scraping error: {recipe_data['error']}")
            return RecipeScrapingResponse(
                success=False,
                error=recipe_data["error"],
                url=request.url,
                processing_time=processing_time
            )
        
        print(f"✅ Successfully scraped recipe: {recipe_data.get('name', 'Unknown Recipe')}")
        
        return RecipeScrapingResponse(
            success=True,
            recipe_data=recipe_data,
            url=request.url,
            processing_time=processing_time
        )
        
    except Exception as e:
        processing_time = time.time() - start_time
        error_msg = f"Failed to scrape recipe: {str(e)}"
        print(f"❌ {error_msg}")
        
        return RecipeScrapingResponse(
            success=False,
            error=error_msg,
            url=request.url,
            processing_time=processing_time
        )

@app.post("/test-query", response_model=RecipeResponse)
async def test_query_endpoint(query: RecipeQuery):
    """
    Test endpoint that provides mock responses for development.
    Use this when the Google ADK is not available.
    """
    
    # Generate mock response based on query
    if any(keyword in query.user_input.lower() for keyword in ["accessible", "disability", "mobility", "vision", "arthritis"]):
        mock_response = f"""
🍳 **Accessible Cooking Assistant** - Test Response

For your query: "{query.user_input}"

Here are some helpful accessibility tips:

🔧 **Adaptive Tools:**
- Ergonomic kitchen utensils
- One-handed cutting boards
- Voice-activated timers
- Jar openers for limited grip strength

🥘 **Recipe Adaptations:**
- Pre-cut vegetables to reduce prep time
- One-pot meals for easier cleanup
- Slow cooker recipes for hands-off cooking
- No-chop recipe alternatives

🔍 **I would normally search Google for:**
- Specific adaptive cooking tools
- Recipes tailored to your accessibility needs
- Step-by-step cooking videos
- Community tips from other accessible cooking enthusiasts

💡 **Next Steps:** Try asking about specific needs like "one-handed cooking techniques" or "recipes for limited standing time"
        """
    else:
        mock_response = f"""
🍳 **a11Yum Recipe Assistant** - Test Response

I received your query: "{query.user_input}"

I'm designed to help with accessible cooking! I can:

🔍 **Search for recipes and tips** using Google Search
🍽️ **Suggest accessible cooking methods**
🛠️ **Recommend adaptive kitchen tools**
👥 **Provide step-by-step guidance**

Try asking me about:
- "Find easy one-pot recipes for limited mobility"
- "What are good kitchen tools for arthritis?"
- "Show me no-chop cooking methods"
- "Find voice-activated cooking timers"

*Note: This is a test response. The real agent would use Google Search to find current, relevant information.*
        """
    
    return RecipeResponse(
        success=True,
        response=mock_response,
        session_id=query.session_id,
        user_id=query.user_id
    )

#
# Startup and Main
#

#
# Startup and Main
#

if __name__ == "__main__":
    import uvicorn
    print("🍳 Starting a11Yum Recipe Assistant API on http://localhost:8000")
    print("📚 API Documentation available at http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)