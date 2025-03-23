# SeatsSync - Frontend Application

## Project Overview

SeatsSync is a modern, feature-rich application for seat reservation management with a beautifully crafted UI. This frontend is built with Vue 3, TypeScript, and Vite, following best practices for code organization, performance, and user experience.


### Project Structure

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
