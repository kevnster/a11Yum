# a11Yum 🍽️

**Accessible Food for Everyone**

A cross-platform mobile and web application built with React Native and Expo, designed to make food accessible to everyone with a focus on accessibility features.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd a11Yum
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

## 📱 Running the App

### Android (Emulator/Device)
```bash
cd frontend
npx expo start --android
```
- Automatically detects and installs on Android emulator
- Works with physical Android devices via USB debugging

### iOS (Simulator/Device)
```bash
cd frontend
npx expo start --ios
```
- Opens iOS Simulator (macOS only)
- Works with physical iOS devices via Expo Go

### Web Browser
```bash
cd frontend
npx expo start --web
```
- Opens `http://localhost:8081` in your browser
- Full web compatibility with React Native Web

### Universal Development
```bash
cd frontend
npx expo start
```
- Opens Expo development interface
- Shows QR codes for all platforms
- Run on any connected device/emulator

## 🏗️ Project Structure

```
a11Yum/
├── frontend/                    # Expo React Native app
│   ├── App.tsx                 # Main application component
│   ├── src/
│   │   └── components/
│   │       └── LandingPage.tsx # Landing page component
│   ├── android/                # Android native code
│   ├── ios/                    # iOS native code
│   ├── assets/                 # Images, fonts, etc.
│   ├── app.json               # Expo configuration
│   └── package.json           # Dependencies and scripts
└── README.md                   # This file
```

## 🎨 Features

- **Cross-Platform**: Runs on iOS, Android, and Web
- **Accessibility-First**: Built with accessibility in mind
- **Modern UI**: Beautiful, responsive design
- **TypeScript**: Full TypeScript support
- **Expo Framework**: Easy development and deployment

## 🛠️ Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npx expo start` | Start development server |
| `npx expo start --android` | Run on Android |
| `npx expo start --ios` | Run on iOS |
| `npx expo start --web` | Run on web |
| `npx expo run:android` | Build and run Android app |
| `npx expo run:ios` | Build and run iOS app |

### Development Workflow

1. **Make changes** to your code in `frontend/src/`
2. **Save files** - Expo automatically reloads
3. **Test on multiple platforms** using the commands above
4. **Use Expo Go** on physical devices for quick testing

## 📦 Building for Production

### Android APK
```bash
cd frontend
npx expo build:android
```

### iOS App
```bash
cd frontend
npx expo build:ios
```

### Web Build
```bash
cd frontend
npx expo export:web
```

## 🔧 Configuration

### Environment Setup

#### Android
- Install Android Studio
- Set up Android SDK
- Create Android Virtual Device (AVD)

#### iOS (macOS only)
- Install Xcode from App Store
- Install Xcode Command Line Tools
- Set up iOS Simulator

### Troubleshooting

#### Common Issues

**NDK Build Errors**
- If you encounter NDK issues, try: `npx expo start --android` instead of `npx expo run:android`
- Or reinstall NDK through Android Studio SDK Manager

**Port Conflicts**
- If port 8081 is busy, Expo will suggest alternative ports
- Use `npx expo start --port 8082` to specify a different port

**Metro Bundler Issues**
- Clear cache: `npx expo start --clear`
- Reset Metro: `npx expo r -c`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Powered by [React Native](https://reactnative.dev/)
- UI components from [React Native](https://reactnative.dev/docs/components-and-apis)

---

**Happy coding! 🎉**
