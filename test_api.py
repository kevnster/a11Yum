#!/usr/bin/env python3
"""
Test client for the a11Yum Recipe Assistant API
"""

import asyncio
import httpx
import json
from typing import Dict, Any

# API Configuration
API_BASE_URL = "http://localhost:8000"

class RecipeAssistantClient:
    """Simple client for testing the Recipe Assistant API"""
    
    def __init__(self, base_url: str = API_BASE_URL):
        self.base_url = base_url
        self.session_id = "test_session"
        self.user_id = "test_user"
    
    async def chat(self, message: str) -> Dict[Any, Any]:
        """Send a chat message to the agent"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/chat",
                json={
                    "user_input": message,
                    "session_id": self.session_id,
                    "user_id": self.user_id
                }
            )
            return response.json()
    
    async def test_chat(self, message: str) -> Dict[Any, Any]:
        """Send a test message (works without Google ADK)"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/test-query",
                json={
                    "user_input": message,
                    "session_id": self.session_id,
                    "user_id": self.user_id
                }
            )
            return response.json()
    
    async def health_check(self) -> Dict[Any, Any]:
        """Check API health"""
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.base_url}/health")
            return response.json()
    
    async def list_sessions(self) -> Dict[Any, Any]:
        """List active sessions"""
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.base_url}/sessions")
            return response.json()

async def main():
    """Test the Recipe Assistant API"""
    
    print("🧪 Testing a11Yum Recipe Assistant API")
    print("=" * 50)
    
    client = RecipeAssistantClient()
    
    # Test health check
    print("\n1️⃣ Health Check:")
    try:
        health = await client.health_check()
        print(f"✅ API Status: {health.get('status')}")
        print(f"📊 Active Sessions: {health.get('active_sessions')}")
        print(f"🤖 Agent: {health.get('agent_name')}")
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return
    
    # Test queries (using test endpoint that doesn't require Google ADK)
    test_queries = [
        "Find accessible cooking tips for people with arthritis",
        "What are some one-handed cooking techniques?", 
        "Show me easy recipes that don't require chopping",
        "Find adaptive kitchen tools for limited mobility"
    ]
    
    print(f"\n2️⃣ Testing {len(test_queries)} queries:")
    
    for i, query in enumerate(test_queries, 1):
        print(f"\n🔍 Query {i}: {query}")
        
        try:
            # Use test endpoint (works without Google ADK)
            result = await client.test_chat(query)
            
            if result.get("success"):
                response = result.get("response", "")
                # Show first 200 characters of response
                preview = response[:200] + "..." if len(response) > 200 else response
                print(f"✅ Response: {preview}")
            else:
                print(f"❌ Error: {result.get('error')}")
                
        except Exception as e:
            print(f"💥 Exception: {e}")
    
    # List sessions
    print(f"\n3️⃣ Active Sessions:")
    try:
        sessions = await client.list_sessions()
        print(f"📋 Sessions: {sessions}")
    except Exception as e:
        print(f"❌ Failed to list sessions: {e}")
    
    print(f"\n✅ Testing complete!")
    print(f"💡 To test with real Google ADK agent, use the /chat endpoint instead of /test-query")

if __name__ == "__main__":
    print("🚀 Starting API tests...")
    print("💡 Make sure the FastAPI server is running: python main.py")
    print("")
    
    asyncio.run(main())