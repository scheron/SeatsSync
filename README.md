# SeatsSync

<div align="center">
  <h3>🎭 Modern Seat Reservation System</h3>
  
  ![Vue.js](https://img.shields.io/badge/Vue.js-42b883?style=for-the-badge&logo=vue.js&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
  ![RxJS](https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)
  ![WebSockets](https://img.shields.io/badge/WebSockets-010101?style=for-the-badge&logo=socket.io&logoColor=white)
</div>

## About

SeatsSync is a sophisticated full-stack application for managing seat reservations, built as a monorepo with a shared component architecture. The system features real-time updates through WebSockets, elegant state management, and a beautifully crafted UI/UX.

## 🌟 Key Features

- **Real-time Communication**: WebSocket-based architecture with ping-pong heartbeat mechanism and auto-reconnect
- **Modern Auth System**: Two-factor authentication (2FA) with QR code integration
- **State Management**: Combination of RxJS for complex workflows and XState for state machines
- **Custom UI System**: Modular component architecture with dynamic theming
- **Monorepo Structure**: Shared types, utilities, and configurations across applications

## 🏗️ Project Structure

This project uses a monorepo architecture to share code between frontend and backend:

```
SeatsSync/
├── apps/                 # Application code
│   ├── frontend/         # Vue.js frontend application
│   └── backend/          # Node.js backend application
│
└── packages/             # Shared packages
    ├── config/           # Shared configurations (ESLint, Prettier, TypeScript)
    ├── constants/        # Common constants and enumerations
    ├── logger/           # Shared logging utilities
    ├── types/            # TypeScript type definitions
    └── utils/            # Shared utility functions
```

## 🔧 Technical Stack

### Frontend 
[![README](https://img.shields.io/badge/View%20Frontend%20README-42b883?style=flat-square)](./apps/frontend/README.md)

- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite with custom plugins
- **State Management**: 
  - RxJS for reactive state handling
  - Pinia for application state
  - XState for complex state machines
- **UI**: TailwindCSS with custom utility-first approach
- **Custom Utilities**:
  - ModalLite for modals management
  - ToastsLite for notifications
  - Dynamic theme generation from a single color

### Backend
[![README](https://img.shields.io/badge/View%20Backend%20README-339933?style=flat-square)](./apps/backend/README.md)

- **Server**: Node.js with Express
- **WebSockets**: Custom WebSocket implementation with heartbeat
- **Architecture**: Layered architecture with clear separation of concerns
- **Data Storage**: In-memory with persistence capability
- **Security**: JWT-based authentication with 2FA

## 🚀 Getting Started

1. Install dependencies:
```bash
bun install
```

2. Start development:
```bash
bun dev
```

## ⚙️ Available Scripts

- `bun dev` - Start development environment
- `bun build` - Build all projects
- `bun lint` - Run linting
- `bun format` - Format code

