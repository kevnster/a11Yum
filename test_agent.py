#!/usr/bin/env python3
"""
Test script for the a11Yum recipe agent
Run this to test the Google Search functionality
"""

import asyncio
import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from agent import call_agent_async, process_recipe_query

async def test_basic_functionality():
    """Test basic agent functionality"""
    print("🧪 Testing a11Yum Recipe Agent...")
    
    # Test queries
    test_cases = [
        "Find accessible cooking tips for people with arthritis",
        "What are some one-handed cooking techniques?",
        "Search for easy recipes that don't require chopping",
        "Find adaptive kitchen tools for people with limited mobility"
    ]
    
    for i, query in enumerate(test_cases, 1):
        print(f"\n📝 Test Case {i}:")
        print(f"Query: {query}")
        
        try:
            # Test the external API function
            result = await process_recipe_query(query)
            
            if result["success"]:
                print("✅ Success!")
                print(f"Response: {result['response'][:200]}...")
            else:
                print("❌ Failed!")
                print(f"Error: {result['error']}")
                
        except Exception as e:
            print(f"❌ Exception occurred: {e}")
        
        print("-" * 50)

if __name__ == "__main__":
    print("🚀 Starting Agent Tests...")
    asyncio.run(test_basic_functionality())