from google.adk.agents import Agent
from google.adk.tools import google_search


# Agent instruction for accessibility-focused cooking assistance
AGENT_INSTRUCTION = """
You are a helpful, patient, and encouraging cooking companion. Your primary goal is to guide people with specific accessibility needs through cooking recipes in a way that works for them, ensuring the process feels achievable, enjoyable, and safe.

**Your Core Cooking Philosophy:**
1. **Adapt, Don't Overwhelm:** Never overwhelm with too many steps at once. Break recipes down into clear, manageable actions. Adapt instructions to account for the person's accessibility needs (mobility, vision, dexterity, sensory, etc.).

2. **Offer Accessible Alternatives:** If a step, tool, or ingredient may pose challenges, suggest alternatives.
   * *Example:* "If chopping is tricky, would you like me to suggest pre-chopped vegetables or a food processor option?"
   * *Example:* "If stirring for long periods is tiring, we can rest between steps or use a stand mixer if you have one."

3. **Guide Step-by-Step:** Present one step at a time and check in before moving on.
   * *Example:* "First, let's gather the ingredients. Do you have them nearby, or should we go over substitutes?"
   * *Example:* "Once you're ready, I'll walk you through the next step."

4. **Encourage Agency and Choice:** Always let the person decide how they want to proceed. Provide options rather than commands.
   * *Example:* "Would you prefer to bake this in the oven or use the stovetop version, which is a bit faster?"

5. **Be Patient and Supportive:** Encourage effort and progress, no matter how small. Offer reassurance and celebrate milestones.
   * *Example:* "That's great! Getting all the ingredients ready is the hardest part. Nice work."
   * *Example:* "Even if it takes a little longer, you're doing it exactly right."
 
6. **Ensure Clarity and Safety:** Use clear, direct language and emphasize safety.
   * *Example:* "The pan will get very hot here, so if it helps, use oven mitts or a long spoon."
   * *Example:* "Would you like me to remind you when it's time to turn off the heat?"

7. **Handle Direct Requests for Simplicity:** If the person asks for a simpler path, accommodate it.
   * *Example:* "We can skip the sauce from scratch and use a premade one if that's easier. Would you like to try that?"

8. **Verify Understanding and Comfort:** After a few steps, check that the person feels comfortable and ready to continue.
   * *Example:* "How did that step go? Do you want to repeat it, or are you ready for the next part?"

Your role is to be a supportive kitchen partner who makes cooking approachable and enjoyable for everyone, regardless of their accessibility needs.
"""

# Create the root agent for Google ADK framework
root_agent = Agent(
    name="gideon",
    model="gemini-2.0-flash-exp",
    description="You are a helpful and friendly AI assistant that talks with people with certain accessibility issues, and your task is to guide them through recipes that will work around their accessibilities.",
    instruction=AGENT_INSTRUCTION,
    tools=[google_search]
)

# Import additional required modules
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
import asyncio

# Configuration
APP_NAME = "a11yum_recipe_agent"
USER_ID = "user"
SESSION_ID = "recipe_session"

# Session and Runner setup
async def setup_session_and_runner():
    """Initialize session service and runner for the agent."""
    session_service = InMemorySessionService()
    session = await session_service.create_session(
        app_name=APP_NAME, 
        user_id=USER_ID, 
        session_id=SESSION_ID
    )
    runner = Runner(
        agent=root_agent, 
        app_name=APP_NAME, 
        session_service=session_service
    )
    return session, runner

# Agent interaction function
async def call_agent_async(query):
    """Send a query to the agent and get the response."""
    print(f"🍽️ User Query: {query}")
    
    content = types.Content(
        role='user', 
        parts=[types.Part(text=query)]
    )
    
    session, runner = await setup_session_and_runner()
    events = runner.run_async(
        user_id=USER_ID, 
        session_id=SESSION_ID, 
        new_message=content
    )

    print("🤖 Agent is thinking...")
    
    async for event in events:
        if event.is_final_response():
            final_response = event.content.parts[0].text
            print(f"🍳 Agent Response: {final_response}")
            return final_response
    
    return "No response received from agent."

# Main function for testing
async def main():
    """Main function to demonstrate the agent functionality."""
    print("🚀 Starting a11Yum Recipe Agent with Google Search...")
    
    # Test queries related to accessible cooking
    test_queries = [
        "Find me easy one-pot recipes for someone with limited mobility",
        "What are some no-chop recipes for people with arthritis?",
        "Search for accessible kitchen tools for people with visual impairments"
    ]
    
    for query in test_queries:
        print(f"\n{'='*60}")
        response = await call_agent_async(query)
        print(f"{'='*60}")
        
        # Add a small delay between queries
        await asyncio.sleep(2)

# Simplified function for external API calls
async def process_recipe_query(user_input):
    """
    Process a recipe-related query from external services.
    Returns a structured response that can be used by FastAPI.
    """
    try:
        response = await call_agent_async(user_input)
        
        return {
            "success": True,
            "response": response,
            "agent_name": "gideon",
            "query": user_input
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "agent_name": "gideon",
            "query": user_input
        }

async def scrape_recipe_from_url(recipe_url: str):
    """
    Scrape recipe data from a given URL using Google search tool and format it 
    according to the example-recipe-structure.json format.
    
    Args:
        recipe_url: The URL of the recipe to scrape
        
    Returns:
        dict: Structured recipe data matching the example format
    """
    try:
        # Create a comprehensive prompt for recipe extraction
        extraction_prompt = f"""
        IMPORTANT: You must use the google_search tool to search for and retrieve the recipe content from this URL: {recipe_url}

        Step 1: Search for the recipe content at the URL using google_search
        Step 2: Extract the recipe information from the search results
        Step 3: Format as JSON exactly as shown below

        I need you to extract the recipe information and return ONLY a valid JSON object in this exact format:
        {{
          "id": "recipe-{hash(recipe_url) % 10000}",
          "title": "Recipe Title From Website",
          "description": "Recipe description from the website",
          "estimatedTime": total_minutes,
          "difficulty": "Easy/Medium/Hard",
          "dietaryTags": ["tags", "from", "recipe"],
          "accessibilityTags": ["No-Chop Options", "Alternative Cooking Methods"],
          "servings": number_of_servings,
          "sourceUrl": "{recipe_url}",
          "nutritionInfo": {{
            "calories": calories_per_serving,
            "protein": "Xg",
            "carbs": "Xg", 
            "fat": "Xg"
          }},
          "ingredients": [
            {{
              "id": "ing-1",
              "name": "ingredient name",
              "amount": "amount",
              "unit": "unit",
              "notes": "any notes",
              "alternatives": [
                {{
                  "id": "alt-1",
                  "name": "pre-chopped alternative",
                  "amount": "amount",
                  "unit": "unit",
                  "reason": "No chopping required",
                  "accessibilityBenefit": "Eliminates knife work for those with limited mobility"
                }}
              ]
            }}
          ],
          "tools": [
            {{
              "id": "tool-1",
              "name": "tool name",
              "required": true,
              "safetyNotes": ["safety notes"],
              "alternatives": [
                {{
                  "id": "tool-alt-1",
                  "name": "alternative tool",
                  "reason": "why this alternative",
                  "accessibilityBenefit": "accessibility benefit"
                }}
              ]
            }}
          ],
          "steps": [
            {{
              "id": "step-1",
              "stepNumber": 1,
              "instruction": "step instruction",
              "estimatedTime": minutes,
              "difficulty": "Easy/Medium/Hard",
              "safetyWarnings": ["warnings if any"],
              "requiredTools": ["tool-1"],
              "alternatives": [
                {{
                  "id": "step-alt-1",
                  "instruction": "alternative way to do this step",
                  "reason": "why this alternative",
                  "accessibilityBenefit": "how this helps accessibility",
                  "toolChanges": {{
                    "add": ["new-tools"],
                    "remove": ["old-tools"]
                  }},
                  "timeAdjustment": 0
                }}
              ],
              "tips": ["helpful tips"]
            }}
          ],
          "createdAt": "2025-09-28T00:00:00Z",
          "isFavorite": false
        }}

        You MUST:
        1. Use google_search to get the actual recipe content from {recipe_url}
        2. Return ONLY the JSON object, no other text
        3. Include accessibility alternatives for ingredients, tools, and steps
        4. Make sure all JSON is valid and complete
        """

        # Use the call_agent_async function which handles session management properly
        response_text = await call_agent_async(extraction_prompt)

        print("🔍 Scraping recipe data...")
        print("📄 Raw response received, processing...")
        
        # Try to extract JSON from the response
        import json
        import re
        
        recipe_data = None
        
        # Look for JSON in the response
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            try:
                recipe_data = json.loads(json_match.group())
                print("✅ Successfully parsed JSON recipe data")
            except json.JSONDecodeError as e:
                print(f"❌ JSON parsing error: {e}")
                # Fallback: return structured error response
                recipe_data = {
                    "error": "Failed to parse recipe JSON",
                    "raw_response": response_text,
                    "url": recipe_url
                }
        else:
            # No JSON found, create a structured response from text
            print("⚠️ No JSON found, creating structured response from text")
            recipe_data = {
                "id": f"recipe-{hash(recipe_url) % 10000}",
                "name": "Extracted Recipe",
                "description": "Recipe extracted from URL",
                "url": recipe_url,
                "raw_content": response_text,
                "extraction_method": "text_analysis",
                "createdAt": "2024-01-01T00:00:00Z",
                "isFavorite": False
            }
        
        if recipe_data is None:
            recipe_data = {
                "error": "No response received from agent",
                "url": recipe_url,
                "createdAt": "2024-01-01T00:00:00Z"
            }
        
        return recipe_data
        
    except Exception as e:
        print(f"❌ Error scraping recipe: {e}")
        return {
            "error": str(e),
            "url": recipe_url,
            "createdAt": "2024-01-01T00:00:00Z"
        }

# Entry point for running the agent
if __name__ == "__main__":
    # Run the main function
    asyncio.run(main())
