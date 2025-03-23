# SeatsSync - Frontend Application

## Project Overview

SeatsSync is a modern, feature-rich application for seat reservation management with a beautifully crafted UI. This frontend is built with Vue 3, TypeScript, and Vite, following best practices for code organization, performance, and user experience.

## Key Features

### WebSocket Communication
- Real-time communication with the backend using WebSocket protocol
- Robust ping-pong heartbeat mechanism to maintain connection health
- Automatic reconnection strategy with exponential backoff
- Queuing of messages during disconnection periods

### State Management
- Reactive state management using RxJS for complex async workflows
- Pinia stores for application state

### Authentication System
- Two-factor authentication (2FA) using authenticator applications
- XState-powered authentication flow for managing complex state transitions
- QR code generation for authenticator app setup
- Secure login and registration flows

### UI Components
- Modular UI architecture with reusable components
- Responsive design that works across devices
- Custom form controls with comprehensive validation

### Custom Utilities

#### ModalLite
- Lightweight modal management system
- Focus trapping for accessibility
- Stacking support for nested modals
- Teleporting strategy for proper DOM placement

#### ToastsLite
- Simple yet powerful toast notification system
- Support for different types (success, error, info, etc.)
- Promise-based notifications for async operations
- Customizable positioning and durations

#### Color Theme System
- Innovative approach to generating a complete color palette from a single base color
- Automatic light/dark mode detection with user preference override
- Smooth transitions between theme changes
- Cross-tab theme synchronization using BroadcastChannel API

### Routing System
- Vue Router with middleware support
- Role-based access control for routes
- Navigation guards for authentication checks
- Middleware aggregator for clean composition of route guards

### Developer Experience
- Custom Vite plugin for SVG sprite generation with automatic type generation
- Hot module replacement for rapid development
- TypeScript for improved code quality and developer experience
- ESLint and Prettier for code quality and consistency

## Project Structure

```
src/
├── api/          # API communication layer with WebSocket client
├── assets/       # Static assets including icons and styles
├── composables/  # Vue composables for reusable logic
├── constants/    # Application constants
├── directives/   # Vue custom directives
├── lib/          # Custom libraries (ToastsLite, ModalLite)
├── plugins/      # Vite plugins (SVG sprite compiler)
├── router/       # Routing configuration with middlewares
├── stores/       # Pinia stores for state management
├── types/        # TypeScript type definitions
├── ui/           # UI components organized by functionality
│   ├── base/     # Base UI components
│   ├── common/   # Common components
│   ├── pages/    # Page components
│   ├── popovers/ # Popover components
│   └── sections/ # Page section components
└── utils/        # Utility functions
```

## WebSocket Implementation

The application uses a robust WebSocket client that handles:
- Automatic reconnection with exponential backoff
- Message queuing during disconnection
- Ping/pong heartbeat mechanism for connection health
- Typed messaging for type-safe communication

## Authentication Flow

The authentication system uses XState to manage complex state transitions:
- Initial state: User enters username
- For existing users: Redirect to login with 2FA code input
- For new users: Display QR code for authenticator app setup and code verification
- Success/failure states with appropriate UI feedback

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Technology Stack

- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite
- **Language**: TypeScript
- **State Management**: Pinia, RxJS, XState
- **Styling**: TailwindCSS
- **Routing**: Vue Router
- **Code Quality**: ESLint, Prettier
- **Component Libraries**: Custom UI components
