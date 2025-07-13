# Armada Chat SDK (Local Development Version)

This is a local copy of the Armada Chat SDK for development purposes. It allows you to make changes to the SDK without having to rebuild the app each time.

## How it works

1. The SDK is copied from the original location (`/Users/nassimmiled/Documents/dev/armada-chat-sdk`) to this local directory.
2. The app is configured to use this local copy instead of the original one.
3. A watcher script (`watch-sdk.js` in the project root) monitors changes in the original SDK and updates this local copy automatically.

## Usage

1. Make changes to the original SDK in `/Users/nassimmiled/Documents/dev/armada-chat-sdk`.
2. Run the watcher script to automatically sync those changes to this local copy:

```bash
npm run watch-sdk
```

3. The app will automatically use the updated local copy without requiring a rebuild.

## Structure

- `src/` - The source code for the SDK
  - `components/` - React components
    - `Chat.tsx` - The main Chat component
  - `index.ts` - The main entry point for the SDK

## Dependencies

The SDK depends on the following packages:

- `react-native-emoji-selector`
- `react-native-gifted-chat`
- `react-native-image-picker`
- `react-native-keyboard-controller`

These dependencies are already included in the main app's package.json.
