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
