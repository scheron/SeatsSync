# Backend Architecture

The backend follows a layered architecture with strict dependency rules where each layer can only import from layers below it. This ensures a predictable data flow and maintainable codebase.

### Project Structure
```
src/
├── controllers/      # Entry points (WebSocket, HTTP)
├── methods/         # Business operations
├── subscriptions/   # Real-time update handlers
├── models/         # Data and business rules
├── core/           # Infrastructure services
└── shared/         # Common utilities
```

### Prerequisites

- Node.js 18+
- PostgreSQL
- Bun

### Environment Setup

1. Copy `.env.example` to `.env`
2. Configure database connection in `.env`
3. Configure the following variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `JWT_SECRET` - Secret for JWT tokens
   - `PORT` - Server port (default: 3000)
   - `WS_PORT` - WebSocket port (default: 3001)

### Available Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun lint` - Run linting
- `bun format` - Format code
- `bun test` - Run tests

### Database

The project uses Prisma as ORM. To work with database:

- `bun prisma generate` - Generate Prisma Client
- `bun prisma migrate dev` - Run migrations
- `bun prisma studio` - Open Prisma Studio
