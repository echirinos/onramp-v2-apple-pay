# 🚀 Onramp v2 Apple Pay - Modern Crypto Purchase App

A beautiful, modern React Native application for purchasing cryptocurrency using Apple Pay, powered by Coinbase's Onramp v2 API. Features a sleek gradient UI, smooth animations, and seamless Apple Pay integration.

![App Screenshot](assets/Flow.png)

## ✨ Features

- 🎨 **Modern UI/UX** - Beautiful gradient background with glassmorphism cards
- 🍎 **Apple Pay Integration** - Native Apple Pay experience using Coinbase Onramp v2 API
- 📱 **React Native** - Cross-platform mobile app (iOS focused for Apple Pay)
- ⚡ **Real-time Updates** - Live ETH conversion estimates
- 🔒 **Sandbox Mode** - Safe testing environment with no real charges
- 🎯 **Optimized Performance** - Fast API calls and smooth animations
- 🎛️ **Smart Input** - Debounced input with keyboard management
- 📊 **Status Tracking** - Real-time payment status with visual feedback

## 🏗️ Architecture

This is a monorepo containing:

- **`/backend`** - Node.js/Express API server with Coinbase CDP SDK
- **`/mobile`** - React Native app with Expo
- **`/assets`** - Documentation and flow diagrams

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS device/simulator (for Apple Pay testing)
- Coinbase Developer Platform account

### 1. Clone the Repository

```bash
git clone https://github.com/echirinos/onramp-v2-apple-pay.git
cd onramp-v2-apple-pay
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install mobile dependencies
cd ../mobile
npm install
```

### 3. Environment Setup

Create a `.env` file in the `/backend` directory:

```bash
cd ../backend
cp .env.example .env
```

Add your Coinbase Developer Platform credentials:

```env
CDP_API_KEY_ID=your_api_key_id_here
CDP_API_KEY_SECRET=your_api_key_secret_here
PORT=3000
```

### 4. Start the Backend Server

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:3000`

### 5. Update Mobile Configuration

In `/mobile/src/utils/apiClient.ts`, update the base URL to your machine's IP:

```typescript
const BASE_URL = "http://YOUR_LOCAL_IP:3000"; // Replace with your IP
```

### 6. Start the Mobile App

```bash
cd mobile
npm start
```

Scan the QR code with Expo Go or run on iOS simulator.

## 🎯 Usage

1. **Enter Amount** - Type the USD amount you want to spend
2. **View Conversion** - See estimated ETH amount in real-time
3. **Tap Apple Pay** - Press the "Buy with 🍎 Pay" button
4. **Complete Payment** - Authorize with Face ID/Touch ID
5. **Success!** - Receive confirmation and transaction details

## 🧪 Testing

The app runs in **sandbox mode** by default:
- ✅ All Apple Pay flows work normally
- ✅ No real money is charged
- ✅ Perfect for testing and demos
- ✅ Uses test transaction data

To enable production mode, update `partnerUserRef` in the mobile app to remove the "sandbox-" prefix.

## 📱 API Endpoints

### Backend Server

- `GET /` - API information and available endpoints
- `GET /health` - Health check
- `POST /api/create-order` - Create Coinbase onramp order

### Mobile App Features

- Real-time amount conversion
- Apple Pay WebView integration
- Payment status tracking
- Error handling and user feedback

## 🛠️ Development

### Backend Development

```bash
cd backend
npm run dev  # Start with hot reload
npm run build  # Build for production
npm start  # Start production build
```

### Mobile Development

```bash
cd mobile
npm start  # Start Expo development server
npm run ios  # Run on iOS simulator
npm run android  # Run on Android (limited Apple Pay support)
```

## 🎨 UI/UX Features

- **Gradient Background** - Beautiful purple-to-pink gradient
- **Glassmorphism Cards** - Semi-transparent cards with backdrop blur
- **Smooth Animations** - Loading states and transitions
- **Responsive Design** - Works on different screen sizes
- **Keyboard Management** - Smart keyboard dismissal
- **Visual Feedback** - Status indicators and progress animations

## 🔧 Technologies Used

### Backend
- Node.js + Express
- Coinbase CDP SDK
- TypeScript
- CORS enabled

### Mobile
- React Native + Expo
- React Native WebView
- Expo Linear Gradient
- TypeScript
- Safe Area Context

## 📝 Configuration

### Coinbase Developer Platform Setup

1. Create account at [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
2. Generate API credentials
3. Add credentials to backend `.env` file
4. Enable Onramp v2 API access

### Apple Pay Requirements

- iOS device or simulator
- Valid Apple ID
- Payment method added to Wallet app
- Touch ID or Face ID enabled

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Coinbase Developer Platform](https://docs.cdp.coinbase.com/) for the Onramp v2 API
- [Expo](https://expo.dev/) for the development platform
- [React Native](https://reactnative.dev/) for the mobile framework

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check Coinbase Developer documentation
- Review the example flows in `/assets`

---

**Built with ❤️ using Coinbase Onramp v2 API**