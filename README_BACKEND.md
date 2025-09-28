# a11Yum Recipe Assistant Backend

This is the FastAPI backend for the a11Yum recipe assistant that uses Google's Agent Development Kit (ADK) with search capabilities.

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   # Run the setup script
   ./start_agent.sh
   
   # Or manually:
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Configure Environment**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and add your Google API key
   # Get it from: https://aistudio.google.com/app/apikey
   ```

3. **Start the Server**
   ```bash
   python main.py
   ```

4. **Test the API**
   ```bash
   # In another terminal
   python test_api.py
   ```

## 📚 API Endpoints

### Main Endpoints

- **`GET /`** - Health check and service info
- **`GET /health`** - Detailed health check with session count
- **`POST /chat`** - Chat with the agent (requires Google ADK)
- **`POST /test-query`** - Test endpoint with mock responses (no ADK required)

### Session Management

- **`GET /session/{user_id}/{session_id}`** - Get session information
- **`GET /sessions`** - List all active sessions

### API Documentation

- **`GET /docs`** - Interactive API documentation (Swagger UI)
- **`GET /redoc`** - Alternative API documentation

## 🤖 Agent Capabilities

The agent (`gideon`) can help with:

- **🔍 Recipe Search**: Find recipes using Google Search
- **♿ Accessibility Adaptations**: Suggest cooking modifications for various needs
- **🛠️ Adaptive Tools**: Recommend kitchen tools for accessibility
- **👥 Step-by-Step Guidance**: Provide detailed, patient cooking instructions

## 💬 Example Queries

Try asking the agent:

```json
{
  "user_input": "Find easy one-pot recipes for someone with limited mobility",
  "session_id": "my_session",
  "user_id": "user123"
}
```

```json
{
  "user_input": "What are some no-chop recipes for people with arthritis?",
  "session_id": "my_session", 
  "user_id": "user123"
}
```

## 🧪 Testing

### Test with Mock Responses (No Google ADK needed)
```bash
curl -X POST "http://localhost:8000/test-query" \
  -H "Content-Type: application/json" \
  -d '{
    "user_input": "Find accessible cooking tips",
    "session_id": "test",
    "user_id": "test_user"
  }'
```

### Test with Real Agent (Requires Google ADK)
```bash
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "user_input": "Find accessible cooking tips",
    "session_id": "test",
    "user_id": "test_user" 
  }'
```

## 📁 File Structure

```
.
├── main.py              # FastAPI server with session management
├── agent.py             # Google ADK agent definition
├── fastapi_backend.py   # Alternative FastAPI implementation
├── test_api.py          # API test client
├── test_agent.py        # Direct agent testing
├── start_agent.sh       # Setup and startup script
├── requirements.txt     # Python dependencies
├── .env.example         # Environment configuration template
└── README_BACKEND.md    # This file
```

## 🔧 Development

### Adding New Features

1. **Modify the Agent** (`agent.py`):
   - Add new tools to the `tools` list
   - Update the `AGENT_INSTRUCTION` for new capabilities

2. **Add API Endpoints** (`main.py`):
   - Add new Pydantic models for request/response
   - Create new endpoint functions
   - Update the session manager if needed

3. **Test Changes**:
   - Update `test_api.py` with new test cases
   - Run tests: `python test_api.py`

### Environment Variables

The API uses these environment variables:

- `GOOGLE_API_KEY` - Required for Google ADK/Gemini
- `FASTAPI_HOST` - Server host (default: 0.0.0.0)
- `FASTAPI_PORT` - Server port (default: 8000)
- `LOG_LEVEL` - Logging level (default: INFO)

## 🤝 Integration with Frontend

The React Native frontend can call these endpoints:

```javascript
// Example frontend integration
const response = await fetch('http://localhost:8000/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_input: userMessage,
    session_id: sessionId,
    user_id: userId
  })
});

const result = await response.json();
if (result.success) {
  console.log('Agent response:', result.response);
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Import errors for Google packages**: Install Google ADK properly
2. **API key errors**: Check your `.env` file and Google API key
3. **Session not found**: Sessions are in-memory and reset when server restarts
4. **CORS errors**: Frontend origins are allowed by default in development

### Logs

Check the console output for detailed logs:
- 📥 Request logging shows incoming queries
- ✅ Success responses with truncated agent replies  
- ❌ Error logging with full exception details

## 📄 License

This project uses Google's Agent Development Kit examples and follows their Apache 2.0 license.