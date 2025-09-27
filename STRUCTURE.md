# a11Yum Project Structure

## 📁 Complete File Structure

```
a11Yum/
├── frontend/                          # Main Expo React Native app
│   ├── App.tsx                       # Root app component with navigation
│   ├── app.json                      # Expo configuration
│   ├── package.json                  # Dependencies and scripts
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── src/                          # Source code directory
│   │   ├── index.ts                  # Main exports file
│   │   ├── components/               # Reusable UI components
│   │   │   ├── LandingPage.tsx       # Landing page component
│   │   │   └── common/               # Common/shared components
│   │   │       ├── Button.tsx        # Custom button component
│   │   │       └── Card.tsx          # Custom card component
│   │   ├── screens/                  # Screen components
│   │   │   └── HomeScreen.tsx        # Home screen component
│   │   ├── navigation/               # Navigation configuration
│   │   │   └── AppNavigator.tsx      # Main navigation setup
│   │   ├── constants/                # App constants
│   │   │   ├── Colors.ts             # Color palette
│   │   │   └── Styles.ts             # Global styles
│   │   ├── types/                    # TypeScript type definitions
│   │   │   └── index.ts              # All type definitions
│   │   ├── hooks/                    # Custom React hooks
│   │   │   └── useAccessibility.ts   # Accessibility hook
│   │   ├── services/                 # API and external services
│   │   │   └── ApiService.ts         # API service class
│   │   ├── utils/                    # Utility functions
│   │   │   └── helpers.ts            # Helper functions
│   │   └── assets/                   # Static assets
│   │       ├── images/               # Image files
│   │       └── icons/                # Icon files
│   ├── android/                      # Android native code
│   ├── ios/                          # iOS native code
│   └── assets/                       # Expo assets
├── README.md                         # Project documentation
├── .gitignore                        # Git ignore rules
└── STRUCTURE.md                      # This file
```

## 🎯 Key Features of This Structure

### **📱 Components**
- **LandingPage**: Your existing landing page with navigation support
- **Button**: Reusable button component with variants and accessibility
- **Card**: Reusable card component with consistent styling

### **🖥️ Screens**
- **HomeScreen**: Main app screen (placeholder for now)
- **Navigation**: Stack-based navigation between screens

### **🎨 Constants**
- **Colors**: Centralized color palette for consistent theming
- **Styles**: Global styles and common style patterns

### **🔧 Utilities**
- **Types**: TypeScript definitions for all app data structures
- **Hooks**: Custom React hooks (accessibility detection)
- **Services**: API service for backend communication
- **Helpers**: Utility functions for common operations

### **♿ Accessibility Features**
- **useAccessibility**: Hook to detect device accessibility settings
- **Accessibility props**: Built into all components
- **Screen reader support**: Proper labels and hints

## 🚀 How to Use

### **Adding New Screens**
1. Create component in `src/screens/`
2. Add to `AppNavigator.tsx`
3. Update types in `src/types/index.ts`

### **Adding New Components**
1. Create in `src/components/` or `src/components/common/`
2. Export from `src/index.ts`
3. Use throughout your app

### **Styling**
- Use `Colors` from `src/constants/Colors.ts`
- Use `GlobalStyles` from `src/constants/Styles.ts`
- Follow the established patterns

### **API Integration**
- Use `apiService` from `src/services/ApiService.ts`
- Add new endpoints as needed
- Handle responses with proper TypeScript types

## 📋 Next Steps

1. **Install navigation dependencies**:
   ```bash
   npm install @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context
   ```

2. **Add more screens** as your app grows
3. **Implement API endpoints** in `ApiService.ts`
4. **Add more reusable components** in `src/components/common/`
5. **Expand accessibility features** using the `useAccessibility` hook

This structure provides a solid foundation for a scalable, maintainable React Native app with excellent accessibility support!
