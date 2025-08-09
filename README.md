# Onramp Workshop

A full-stack application with React Native Expo frontend and Node.js TypeScript backend.

## Project Structure

```
├── backend/          # Node.js TypeScript backend
│   ├── src/
│   │   └── index.ts  # Main server file
│   └── package.json
├── mobile/           # React Native Expo app
│   ├── App.tsx       # Main app component
│   └── package.json
└── package.json      # Root package.json with convenience scripts
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm
- Expo CLI (for mobile development)

### Installation
```bash
# Install all dependencies
npm run install:all
```

### Running the Applications

#### Backend Server
```bash
# Development mode (with hot reload)
npm run backend

# Or manually:
cd backend && npm run dev
```

The backend will start on `http://localhost:3000`

Available endpoints:
- `GET /health` - Health check
- `GET /api/hello` - Test endpoint

#### Mobile App
```bash
# Start Expo development server
npm run mobile

# Or manually:
cd mobile && npm start
```

This will open the Expo development tools in your browser. You can then:
- Scan the QR code with Expo Go app on your phone
- Press `i` to open iOS simulator
- Press `a` to open Android emulator
- Press `w` to open in web browser

### Testing Connectivity

The mobile app includes a button to test connectivity with the backend. Make sure both applications are running:

1. Start the backend: `npm run backend`
2. Start the mobile app: `npm run mobile`
3. In the mobile app, tap "Test Backend Connection"

If successful, you should see "Hello from Node.js backend!" displayed in the app.



### Flow
<p align="center">
  <img src="assets/Flow.png" alt="Onramp Workshop" width="800" height="500">
</p>