# Seats Sync Backend

## Architecture Overview

The BE use a modular architecture with two main abstractions: Methods and Subscriptions.

### Core Concepts

#### 0. Authorization

> FE - Frontend | BE - Backend

0. FE open the socket connection.
1. While opening the connections, BE checks the http-only token in the cookie.
2. If token is active, user is logged in.
3. If token is expired or not exists, user is not logged in.

---

## Login

0. FE start to auth.
1. FE send request with username to BE.
2. BE checks username, and returns status:user and waiting for the 6-digit code.
3. FE enters 6 digits code from authenticator app and sends it to BE.
4. BE checks code and if it is correct, user is authorized.
5. BE returns a token to FE.
6. FE should recreate the socket connection.

---

## Register

0. FE start to auth.
1. FE send request with username to BE.
2. BE checks username, and returns status:candidate with qr_code and waiting for the 6-digit code.
3. FE scans the qr_code and enters 6 digits code from authenticator app, then sends the code to BE.
4. BE checks code and if it is correct, user is authorized.
5. BE returns a token to FE.
6. FE should recreate the socket connection.

#### 1. Methods

One-time request/response operations that follow a simple pattern:

```typescript
async function method(request: Request): Promise<Response> {
  // 1. Validate input
  // 2. Perform operation
  // 3. Return response
}
```

Example:

```typescript
const cinema = await cinema.methods.getOne({id: 1})
const user = await auth.methods.login({
  username: "john",
  secret: "password",
})
```

#### 2. Subscriptions

Real-time data streams that allow clients to subscribe to changes:

```typescript
cinema.subscriptions.subscribe({cinemaId: 1}, ws)
auth.subscriptions.subscribe(userId, ws)
```

### Module Structure

Each module follows a consistent structure:

```
src/modules/[module]/
  methods/           # One-time operations
    methodA.ts
    methodB.ts
  subscriptions/     # Real-time data streams
    onEventA.ts
    onEventB.ts
  types.ts          # Type definitions
  index.ts          # Public API
```

### WebSocket Communication

The protocol is message-based:

```typescript
// Client -> Server (Request)
{
  type: "namespace.method", // Method to call
  data: { ... },            // Method parameters
  eid: "uuid",              // External user id
  ts: 1234567890            // Timestamp
}

// Server -> Client (Response)
{
  type: "namespace.method",    // Original method
  data: { ... },               // Response data
  eid: "uuid",                 // Same ID
  ts: 1234567890,              // Timestamp
  error?:  "ERROR_CODE",       // Error code
}
```

## Docker and Deployment

### Using Makefile

The project includes a Makefile to simplify Docker operations. Here are the available commands:

#### Basic Commands

- `make build V=1.0.0` - Build Docker image with specified version
- `make push V=1.0.0` - Push image to Docker Hub
- `make run` - Run project in production mode
- `make dev` - Run project in development mode with logs
- `make stop` - Stop all containers

#### Maintenance Commands

- `make clean` - Clean Docker (containers, volumes)
- `make rebuild` - Rebuild and restart project
- `make deploy V=1.0.0` - Full deployment (build + push + run)
- `make version V=1.0.0` - Set new version in docker-compose.yml

#### Development Workflow

1. Make changes to the code
2. Build new version:
   ```bash
   make build V=1.0.0
   ```

3. Push to Docker Hub:
   ```bash
   make push V=1.0.0
   ```

4. Deploy changes:
   ```bash
   make deploy V=1.0.0
   ```

#### Quick Start for Development

```bash
# Start project in development mode
make dev

# Stop project
make stop

# Rebuild and restart
make rebuild
```

#### Production Deployment

```bash
# Full deployment with version
make deploy V=1.0.0

# Or step by step:
make build V=1.0.0
make push V=1.0.0
make run
```

### Docker Image Structure

The project uses a multi-stage build process:
1. Builder stage - compiles TypeScript and generates Prisma client
2. Production stage - contains only necessary files for running the application

### Environment Variables

Make sure to set up your `.env` file with the following variables:
```env
PORT=3001
JWT_SECRET=your_secret
COOKIE_SECRET=your_cookie_secret
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=your_db_name
POSTGRES_PORT=5432
DATABASE_URL=postgresql://user:password@postgres:5432/dbname?schema=public
```

### Container Health Checks

The application includes health checks for both the backend and database services:
- PostgreSQL health is checked every 5 seconds
- Backend health is verified through Prisma database connectivity

For more information about the project architecture and features, see the sections above.
