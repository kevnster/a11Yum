# a11Yum Recipe Assistant - Simplified FastAPI Backend
# This version works without Google ADK for testing

import os
import json
from pathlib import Path
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any

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

#
# Simple Session Management (in-memory for testing)
#

class SimpleSessionManager:
    def __init__(self):
        self.sessions: Dict[str, Dict] = {}
    
    def get_session_key(self, user_id: str, session_id: str) -> str:
        return f"{user_id}_{session_id}"
    
    def create_or_get_session(self, user_id: str, session_id: str):
        session_key = self.get_session_key(user_id, session_id)
        
        if session_key not in self.sessions:
            self.sessions[session_key] = {
                "user_id": user_id,
                "session_id": session_id,
                "messages": [],
                "created_at": "now"
            }
            print(f"✅ Created new session: {session_key}")
        
        return self.sessions[session_key]
    
    def add_message(self, user_id: str, session_id: str, message: str, response: str):
        session = self.create_or_get_session(user_id, session_id)
        session["messages"].append({
            "user_input": message,
            "agent_response": response,
            "timestamp": "now"
        })
    
    def get_session_info(self, user_id: str, session_id: str):
        session_key = self.get_session_key(user_id, session_id)
        exists = session_key in self.sessions
        
        return {
            "session_id": session_id,
            "user_id": user_id,
            "status": "active" if exists else "not_found",
            "message_count": len(self.sessions[session_key]["messages"]) if exists else 0
        }
    
    def list_sessions(self):
        return list(self.sessions.keys())

# Initialize session manager
session_manager = SimpleSessionManager()

#
# Mock Agent Response Generator
#

def generate_mock_response(user_input: str) -> str:
    """Generate contextual mock responses based on user input"""
    
    input_lower = user_input.lower()
    
    # Accessibility-focused responses
    if any(word in input_lower for word in ["accessible", "accessibility", "disability", "arthritis", "mobility"]):
        return f"""
🍳 **Accessible Cooking Assistant**

For your query: "{user_input}"

Here are some helpful accessibility adaptations:

🔧 **Adaptive Tools & Techniques:**
• Ergonomic kitchen utensils with larger grips
• One-handed cutting boards with raised edges
• Voice-activated timers and smart assistants
• Jar openers and easy-grip tools
• Lightweight, non-slip cookware

🥘 **Recipe Modifications:**
• Pre-cut vegetables to reduce prep time
• One-pot meals for easier cleanup
• Slow cooker recipes for hands-off cooking
• No-chop alternatives using frozen/canned ingredients
• Simple assembly recipes

🔍 **I would normally search Google for:**
• Specific adaptive cooking equipment reviews
• Video demonstrations of accessible techniques
• Community forums for cooking with disabilities
• Professional occupational therapy cooking tips

💡 **Next Steps:** Feel free to ask about specific accessibility needs or cooking challenges!
        """
    
    # Recipe search responses
    elif any(word in input_lower for word in ["recipe", "cook", "meal", "food", "dish"]):
        return f"""
🔍 **Recipe Search Results** (Simulated)

For: "{user_input}"

Here's what I would find using Google Search:

🍽️ **Suggested Recipes:**
• Easy one-pot pasta dishes
• No-chop stir-fry with pre-cut vegetables  
• Simple slow cooker meals
• Microwave-friendly options
• Assembly-style salads and bowls

♿ **Accessibility Notes:**
• All recipes can be adapted for various mobility levels
• Step-by-step guidance available
• Alternative preparation methods suggested
• Ingredient substitutions for dietary needs

🛠️ **Cooking Tips:**
• Prepare ingredients in advance when energy is high
• Use adaptive tools to reduce strain
• Consider batch cooking for multiple meals
• Ask for help with prep work when needed

Would you like me to search for something more specific?
        """
    
    # Tool and equipment queries
    elif any(word in input_lower for word in ["tool", "equipment", "utensil", "gadget"]):
        return f"""
🛠️ **Adaptive Kitchen Tools** (Search Results)

Based on: "{user_input}"

🔍 **Recommended Tools:**
• **Good Grips® Kitchen Tools** - Ergonomic handles
• **Rocker Knives** - One-handed cutting
• **Weighted Utensils** - For tremor management
• **Jar Openers** - Various grip styles
• **Non-slip Cutting Boards** - Stability features
• **Voice Assistants** - Hands-free timers & conversions

💰 **Where to Find:**
• Amazon Accessibility Store
• National MS Society Equipment Guide  
• Local occupational therapy suppliers
• Specialty adaptive equipment retailers

⭐ **User Reviews:** Most users report these tools significantly improve cooking independence and reduce fatigue.

Need recommendations for specific challenges?
        """
    
    # General cooking assistance
    else:
        return f"""
🍳 **a11Yum Cooking Assistant**

I received your message: "{user_input}"

I'm designed to help make cooking accessible and enjoyable for everyone! Here's how I can assist:

🔍 **Recipe Search:** Find recipes adapted for various accessibility needs
♿ **Accessibility Support:** Suggest modifications for mobility, vision, or dexterity challenges  
🛠️ **Tool Recommendations:** Adaptive kitchen equipment suggestions
👥 **Step-by-Step Guidance:** Patient, detailed cooking instructions
🥘 **Meal Planning:** Ideas for easy, nutritious meals

**Try asking me:**
• "Find easy recipes for limited mobility"
• "What kitchen tools help with arthritis?"
• "Show me no-chop cooking methods"
• "How do I adapt recipes for one-handed cooking?"

*Note: This is a test response. The full version uses Google Search for real-time recipe and accessibility information.*

How can I help make cooking more accessible for you?
        """

#
# FastAPI Application
#

app = FastAPI(
    title="a11Yum Recipe Assistant API",
    description="Accessible recipe assistance (Test Version)",
    version="1.0.0-test"
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
        "version": "test-mode",
        "app_name": APP_NAME,
        "description": "Accessible recipe assistance (currently running in test mode)",
        "note": "This version uses mock responses. Install Google ADK for full functionality."
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    active_sessions = session_manager.list_sessions()
    return {
        "status": "healthy",
        "mode": "test",
        "active_sessions": len(active_sessions),
        "app_name": APP_NAME,
        "features": ["mock_responses", "session_management", "accessibility_focus"]
    }

@app.post("/chat", response_model=RecipeResponse)
async def chat_with_agent(query: RecipeQuery):
    """
    Chat with the recipe assistant (test mode with mock responses).
    The agent focuses on accessible cooking tips, recipes, and guidance.
    """
    print(f"📥 Received query from {query.user_id}/{query.session_id}: {query.user_input}")
    
    try:
        # Generate mock response
        response_text = generate_mock_response(query.user_input)
        
        # Store in session
        session_manager.add_message(
            query.user_id, 
            query.session_id, 
            query.user_input, 
            response_text
        )
        
        print(f"✅ Generated response: {len(response_text)} characters")
        
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
        "count": len(sessions),
        "note": "Sessions are stored in memory and will reset when server restarts"
    }

# Keep the test endpoint for compatibility
@app.post("/test-query", response_model=RecipeResponse)
async def test_query_endpoint(query: RecipeQuery):
    """
    Test endpoint - identical to /chat in this test version
    """
    return await chat_with_agent(query)

#
# Startup and Main
#

# Note: Using lifespan context manager is the modern way, but for simplicity 
# we'll handle startup in the main function

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting a11Yum Recipe Assistant API (Test Mode)...")
    print(f"📊 Mode: Mock responses (no Google ADK required)")
    print(f"📋 App: {APP_NAME}")
    print("💡 Install Google ADK and update main.py for full functionality")
    print("🍳 Starting server on http://localhost:8000")
    print("📚 API Documentation available at http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)