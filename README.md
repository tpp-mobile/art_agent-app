# 🎨 Art Agent

**Art Agent** is a premium, state-of-the-art marketplace platform designed to bridge the gap between digital artists and professional agents/buyers. Built with a focus on **Trust, Transparency, and Creativity**, the platform features a rigorous "Trust Tools" lifecycle and a sophisticated "Creative Identity" design system.

---

## ✨ Key Features

### 🛡️ Trust Tools Lifecycle
- **Proof-of-Process**: Artists upload sketches, time-lapses, and layer structures.
- **AI/Human Scoring**: Automated and manual audits provide a "Human Creation Score."
- **Certificates**: On-chain (mock) certificates of authenticity for verified pieces.
- **Request Proof**: Direct interaction for buyers to request deeper verification info.

### 💬 Interactive Chat Experience
- **Smart Banners**: Discuss specific artworks with contextual "View Details" and "Place Bid" actions.
- **Quick Action Chips**: One-tap replies and inquiry suggestions.
- **Media Sharing Hub**: Share high-res images, proof documents, and meeting locations.
- **Live Feedback**: Real-time typing indicators and advanced message status (Sent/Delivered/Read).

### 🚀 Advanced Functionalities
- **Auction Engine**: Real-time bidding with countdown timers and bid history.
- **Multi-Role Dashboards**: Tailored experiences for Artists (stats, uploads, management) and Agents (discovery, bidding, portfolio).
- **Creative Palette**: A custom, lush UI system built with NativeWind and Glassmorphism.

---

## 🛠️ Technical Stack

- **Core**: [React Native](https://reactnative.dev/) (Expo)
- **Routing**: [Expo Router v3](https://docs.expo.dev/router/introduction/) (Link-based navigation)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Icons**: [Ionicons](https://ionic.io/icons) & [Lucide](https://lucide.dev/)
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/client) app on your mobile device (for local testing)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/art-agent.git
   cd art-agent
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the project:
   ```bash
   npx expo start --tunnel
   ```

---

## 🌍 Sharing & Deployment

The app is ready for immediate preview using Expo's tunnel mode. For full deployment options (Web, Android APK, iOS TestFlight), please refer to our **[Deployment Guide](.gemini/antigravity/brain/86637c19-dc77-4bdf-b2a7-e72a1e8b8691/deployment_guide.md)**.

---

## 📁 Project Structure

```text
├── app/               # Expo Router file-based navigation
│   ├── (artist)/      # Artist-role protected routes
│   ├── (agent)/       # Agent-role protected routes
│   └── chat/          # Shared chat screens
├── src/
│   ├── components/    # Reusable UI primitives (Card, Button, Avatar, etc.)
│   ├── stores/        # Zustand state stores (Auth, Chat, Bid, etc.)
│   ├── constants/     # Themes, mock data, and global config
│   └── types/         # TypeScript interfaces
├── global.css         # Tailwind global styles
└── tailwind.config.js # Custom "Creative Palette" configuration
```

---

## 📜 License
Private/Proprietary for Art Agent Demo.
