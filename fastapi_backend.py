"""
FastAPI backend for a11Yum Recipe Agent
Integrates with Google ADK agent for accessible recipe assistance
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import asyncio
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import our agent functionality
try:
    from agent import process_recipe_query
    AGENT_AVAILABLE = True
except ImportError as e:
    logger.warning(f"Agent import failed: {e}")
    AGENT_AVAILABLE = False

app = FastAPI(
    title="a11Yum Recipe Agent API",
    description="Accessible recipe assistance using Google ADK with search capabilities",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class RecipeQuery(BaseModel):
    user_input: str
    session_id: Optional[str] = "default"

class RecipeResponse(BaseModel):
    success: bool
    response: Optional[str] = None
    error: Optional[str] = None
    agent_name: Optional[str] = None
    query: Optional[str] = None

# Health check endpoint
@app.get("/")
async def root():
    return {
        "service": "a11Yum Recipe Agent API",
        "status": "healthy",
        "agent_available": AGENT_AVAILABLE
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "agent_available": AGENT_AVAILABLE,
        "message": "Agent ready for recipe assistance" if AGENT_AVAILABLE else "Agent not available - check ADK installation"
    }

# Main recipe processing endpoint
@app.post("/recipe-assistance", response_model=RecipeResponse)
async def get_recipe_assistance(query: RecipeQuery):
    """
    Process a recipe query using the accessible cooking agent.
    The agent can search for recipes, cooking tips, and accessibility adaptations.
    """
    
    if not AGENT_AVAILABLE:
        raise HTTPException(
            status_code=503, 
            detail="Recipe agent is not available. Please check Google ADK installation."
        )
    
    logger.info(f"Processing recipe query: {query.user_input}")
    
    try:
        # Call our agent
        result = await process_recipe_query(query.user_input)
        
        return RecipeResponse(
            success=result["success"],
            response=result.get("response"),
            error=result.get("error"),
            agent_name=result.get("agent_name"),
            query=result.get("query")
        )
        
    except Exception as e:
        logger.error(f"Error processing recipe query: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# Test endpoint that works without the agent
@app.post("/test-recipe", response_model=RecipeResponse)
async def test_recipe_endpoint(query: RecipeQuery):
    """Test endpoint that returns mock responses for development."""
    
    # Mock response based on query content
    if "accessible" in query.user_input.lower() or "disability" in query.user_input.lower():
        mock_response = f"""
        Here are some accessible cooking tips for your query: "{query.user_input}"
        
        🍳 **Accessibility Adaptations:**
        - Use pre-cut vegetables to reduce prep time
        - Consider one-pot meals to minimize cleanup
        - Adaptive utensils can make cooking easier
        - Voice-activated timers are helpful
        
        🔍 **Would you like me to search for specific adaptive tools or recipes?**
        """
    else:
        mock_response = f"""
        I can help you find accessible recipes and cooking tips! 
        
        For your query: "{query.user_input}"
        
        🔍 I would normally search for:
        - Accessible cooking techniques
        - Adaptive recipes
        - Kitchen tools for accessibility needs
        - Step-by-step guidance
        
        💡 Try asking about specific accessibility needs like "one-handed cooking" or "recipes for limited mobility"
        """
    
    return RecipeResponse(
        success=True,
        response=mock_response,
        agent_name="gideon (test mode)",
        query=query.user_input
    )

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting a11Yum Recipe Agent API...")
    uvicorn.run(app, host="0.0.0.0", port=8000)