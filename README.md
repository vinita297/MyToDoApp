# React Native Todo App

A clean and minimal React Native Todo application with user authentication and local storage using AsyncStorage.

## Features

### 🔐 Authentication
- User signup with email validation
- User login with stored credentials
- Secure password handling
- Persistent login sessions

### 📝 Todo Management
- Add new todos with multi-line text support
- Edit existing todos inline
- Delete todos with confirmation
- Mark todos as complete/incomplete
- Real-time todo statistics (pending, completed, total)

### 💾 Local Storage
- All user data stored locally using AsyncStorage
- Separate todo lists for each user
- No internet connection required
- Data persists between app sessions

### 🎨 Clean UI
- Minimal and modern design
- Responsive layout
- Smooth animations
- Intuitive user experience
- Dark/light mode support

## Tech Stack

- **React Native** 0.80.1
- **React Navigation** 6.x for navigation
- **AsyncStorage** for local data persistence
- **TypeScript** for type safety
- **React Hooks** for state management

## Prerequisites

- Node.js (>=18)
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. For iOS (if running on macOS):
   ```bash
   cd ios && pod install && cd ..
   ```

## Running the App

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

### Start Metro Bundler
```bash
npm start
```

## App Structure

```
src/
├── components/
│   └── TodoItem.tsx          # Individual todo item component
├── screens/
│   ├── LoginScreen.tsx       # User login screen
│   ├── SignupScreen.tsx      # User registration screen
│   └── DashboardScreen.tsx   # Main todo dashboard
├── services/
│   └── storage.ts           # AsyncStorage service
├── types/
│   └── index.ts             # TypeScript type definitions
└── utils/
    └── AuthContext.tsx      # Authentication context provider
```

## Usage Guide

### Getting Started

1. **First Time Setup**
   - Launch the app
   - Tap "Sign Up" to create a new account
   - Enter your name, email, and password
   - Tap "Create Account"

2. **Logging In**
   - Enter your email and password
   - Tap "Sign In"
   - You'll be redirected to the dashboard

### Managing Todos

1. **Add a Todo**
   - Type your todo in the input field
   - Tap "Add" button
   - Your todo will appear in the list

2. **Complete a Todo**
   - Tap the circle checkbox next to any todo
   - Completed todos will be crossed out

3. **Edit a Todo**
   - Tap the edit icon (✏️) next to any todo
   - Modify the text and tap "Save"
   - Or tap "Cancel" to discard changes

4. **Delete a Todo**
   - Tap the delete icon (🗑️) next to any todo
   - Confirm deletion in the popup

### Dashboard Features

- **Statistics Cards**: View pending, completed, and total todo counts
- **User Greeting**: Personalized welcome message
- **Logout**: Tap the logout button to sign out

## Data Storage

The app uses AsyncStorage to store:
- User accounts and credentials
- Individual todo lists per user
- Current session information

Data is automatically saved and restored when the app is reopened.

## Security Notes

- Passwords are stored as plain text (for demo purposes)
- In production, implement proper password hashing
- Consider adding input validation and sanitization
- Add rate limiting for authentication attempts

## Development

### Key Components

1. **AuthContext**: Manages authentication state and user sessions
2. **StorageService**: Handles all AsyncStorage operations
3. **TodoItem**: Reusable component for todo items
4. **Navigation**: Handles screen transitions and authentication flow

### Adding Features

To add new features:
1. Define types in `src/types/index.ts`
2. Add storage methods in `src/services/storage.ts`
3. Create/update components in `src/components/`
4. Add screens in `src/screens/`

## Testing

Run tests with:
```bash
npm test
```

## Build for Production

### Android
```bash
cd android
./gradlew assembleRelease
```

### iOS
```bash
cd ios
xcodebuild -workspace MyToDoApp.xcworkspace -scheme MyToDoApp -configuration Release
```

## Troubleshooting

### Common Issues

1. **Metro bundler issues**
   - Clear cache: `npx react-native start --reset-cache`

2. **Android build issues**
   - Clean build: `cd android && ./gradlew clean && cd ..`

3. **iOS build issues**
   - Clean build folder in Xcode
   - Re-run `pod install`

## License

This project is for educational purposes. Feel free to use and modify as needed.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For issues and questions, please create an issue in the repository.
