# 🏪 Store Manager App

A modern **React Native** mobile application built to help manage store operations efficiently — from product listings to navigation and management features.  
Developed using the [`@react-native-community/cli`](https://github.com/react-native-community/cli).

---

## 🚀 Features

- 📦 Product and category management screens  
- 🧭 Stack and Bottom Tab navigation  
- 🎨 Modern UI with vector icons  
- ⚡ Fast Refresh support  
- 📱 Works seamlessly on both Android and iOS  
- 🧰 Clean and scalable folder structure  

---

## 🛠️ Tech Stack

| Category | Technologies Used |
|-----------|-------------------|
| Framework | [React Native](https://reactnative.dev) |
| Navigation | [React Navigation (Stack + Bottom Tabs)](https://reactnavigation.org) |
| Icons | [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons) |
| State | React Hooks / Context API |
| Package Manager | npm / yarn |

---

# Getting Started

> **Note**: Make sure you have completed the [React Native Environment Setup Guide](https://reactnative.dev/docs/set-up-your-environment) before proceeding.

---

## Step 1: Start Metro

Metro is the JavaScript bundler for React Native.

Run this command to start the Metro server:

```bash
# Using npm
npm start

# OR using Yarn
yarn start

Step 2: Build and Run the App
With Metro running, open a new terminal from the root directory and run:
▶️ Android
# Using npm
npm run android

# OR using Yarn
yarn android

🍏 iOS
For iOS, first ensure CocoaPods are installed (macOS only):
bundle install
bundle exec pod install

Then run:
# Using npm
npm run ios

# OR using Yarn
yarn ios

If everything is configured correctly, the app will launch in your Android Emulator, iOS Simulator, or a connected device.

Step 3: Modify Your App
Open the file below to start customizing your app:
src/screens/HomeScreen.tsx

Once you save changes, Fast Refresh will automatically reload the app with updates.
To perform a full reload:


Android: Press <kbd>R</kbd> twice or open Dev Menu using <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).


iOS: Press <kbd>R</kbd> in the iOS Simulator.



🧩 Vector Icons Setup
If you haven't already, install vector icons:
npm install react-native-vector-icons

Import them in your screen:
import Ionicons from 'react-native-vector-icons/Ionicons';

<Ionicons name="home" size={24} color="#000" />


📂 Folder Structure
src/
├── components/        # Reusable UI components
├── context/           # Global context (store management)
├── navigation/        # App navigation setup
├── screens/           # All main screens
│   ├── HomeScreen.tsx
│   ├── ProductsScreen.tsx
│   ├── ProductListScreen.tsx
│   └── CategoryScreen.tsx
├── assets/            # Images and static files
└── utils/             # Helper functions


🧱 Common Commands
CommandDescriptionnpm installInstall dependenciesnpm startStart Metro bundlernpm run androidRun on Androidnpm run iosRun on iOSnpx pod-install iosInstall iOS podsnpm run cleanClear cache (if needed)

🧠 Troubleshooting
If you face issues running the app, refer to:


React Native Troubleshooting Guide


Clear cache with:
npx react-native start --reset-cache




🌟 Future Enhancements


🔐 Authentication (Admin / Staff)


🗂️ Product CRUD with API integration


☁️ Cloud sync using Firebase


📊 Sales analytics dashboard


🌓 Dark mode support



👨‍💻 Author
Mulkesh Sharma
🌐 [https://www.linkedin.com/in/mulkesh-sharma/]  

⭐ If you find this project helpful, please consider giving it a star on GitHub!
