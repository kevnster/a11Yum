# Auth0 Setup Guide for User Metadata

## 🎯 Goal
Store user preferences from the onboarding process in Auth0 `user_metadata` so they persist across sessions and devices.

## 🔧 Required Auth0 Configuration

### Step 1: Machine-to-Machine Application Setup

1. **Go to Auth0 Dashboard** → Applications → Machine to Machine Applications
2. **Find your M2M app** (ID: `qtnrl9hS8FVSFqCxngFlRuG5210Qg7Kr`)
3. **Click on the app** → APIs tab
4. **Find "Auth0 Management API"** and authorize it
5. **Add these REQUIRED scopes:**
   - ✅ `read:users` - Read user profiles
   - ✅ `update:users` - Update user profiles  
   - ✅ `read:user_metadata` - Read user metadata
   - ✅ `update:user_metadata` - Update user metadata
   - ✅ `create:current_user_metadata` - Create user metadata

### Step 2: Verify Scopes are Granted

In the Auth0 Dashboard:
1. Applications → Your M2M App → APIs
2. Expand "Auth0 Management API" 
3. Ensure all 5 scopes above are checked ✅

## 📋 What We Store in user_metadata

Based on Auth0 documentation, `user_metadata` is perfect for user preferences:

```json
{
  "user_metadata": {
    "firstName": "John",
    "lastName": "Doe", 
    "dietaryRestrictions": ["Vegan", "Gluten-Free"],
    "accessibilityNeeds": ["Large Text", "Energy Level: Low"],
    "favoriteCuisines": ["Italian", "Mexican"],
    "profileSetupCompleted": true,
    "onboarding_completed_at": "2025-09-27T15:30:00.000Z",
    "app_version": "1.0.0"
  }
}
```

## 🧪 Testing Your Setup

We've added comprehensive testing. When you complete onboarding, check console logs for:

1. **Token Test**: `✅ SUCCESS: Got management token`
2. **Read Test**: `✅ SUCCESS: Can read user data` 
3. **Update Test**: `✅ SUCCESS: Can update user metadata`
4. **Final Message**: `🎉 ALL TESTS PASSED!`

## 🚨 Common Issues & Solutions

### Issue: "Unauthorized" Error (401)
**Cause**: Missing scopes
**Solution**: Add all 5 required scopes to your M2M app

### Issue: "Forbidden" Error (403)  
**Cause**: Incorrect client credentials
**Solution**: Verify client_id and client_secret in code

### Issue: Empty metadata in Auth0 Dashboard
**Cause**: API calls failing silently
**Solution**: Check console logs for detailed error messages

## 🎉 Success Indicators

You'll know it's working when:
1. ✅ Console shows `🎉 ALL TESTS PASSED!`
2. ✅ Auth0 Dashboard shows populated `user_metadata` 
3. ✅ User's firstName appears in "Welcome back, [NAME]!"

## 🔍 Debug Commands

To test your setup, complete the onboarding flow and watch the console for detailed logging of each step.