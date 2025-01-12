# Seats Sync Backend

## Architecture Overview

The BE use a modular architecture with two main abstractions: Methods and Subscriptions.

### Core Concepts

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
