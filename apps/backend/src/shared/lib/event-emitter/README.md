# EmitX

> A modular, type-safe, priority-based event emitter for modern TypeScript applications.

EmitX is a lightweight but powerful event emitter library designed for frontend and backend environments. It supports:

- ✅ TypeScript with strict event maps
- 🔁 `on`, `once`, `off`, `emit`, `toPromise`
- 🧠 Priority-based listeners
- 🔀 Parallel & sequential emit strategies
- 🧹 Auto-cleanup with `destroy()`
- 🧩 Fully extendable and testable architecture

---

## 🚀 Installation

```bash
npm install emitx
# or
yarn add emitx
```

---

## 🧪 Basic Example

```ts
import {EventEmitter} from "emitx"

type AppEvents = {
  "user:login": {name: string}
  "user:logout": void
}

const emitter = new EventEmitter<AppEvents>()

emitter.on("user:login", (data) => {
  console.log(`Welcome, ${data.name}!`)
})

emitter.emit("user:login", {name: "Alice"})
```

---

## 🧠 API Overview

### `new EventEmitter(options?)`

Create a new instance.

| Option         | Type       | Default       | Description                                 |
| -------------- | ---------- | ------------- | ------------------------------------------- |
| `debug`        | `boolean`  | `false`       | Enable debug logging                        |
| `logger`       | `DebugLog` | `DebugHelper` | Optional logging function                   |
| `maxListeners` | `number`   | `10`          | Max listeners per event (warns if exceeded) |

---

### `on(event, callback, priority?)`

Registers a persistent listener.

```ts
emitter.on('data:update', (payload) => { ... }, 100)
```

| Param      | Type              | Description                           |
| ---------- | ----------------- | ------------------------------------- |
| `event`    | keyof Events      | The event name                        |
| `callback` | EventCallback<T>  | Listener function                     |
| `priority` | number (optional) | Higher = called earlier (default `0`) |

Returns a **cleanup function** to unsubscribe.

---

### `once(event, callback, priority?)`

Registers a one-time listener.

```ts
emitter.once('user:logout', () => { ... })
```

---

### `off(event, callback?)`

Unsubscribes one or all listeners from an event.

```ts
emitter.off("user:login", specificCallback)
emitter.off("user:login") // all listeners
```

---

### `emit(event, data, options?)`

Emits an event with a payload.

```ts
await emitter.emit("user:login", {name: "Alex"})
```

With strategy:

```ts
await emitter.emit("order:process", order, {strategy: "sequential"})
```

| Option     | Values                        | Default      | Description                          |
| ---------- | ----------------------------- | ------------ | ------------------------------------ |
| `strategy` | `"parallel"` / `"sequential"` | `"parallel"` | Controls order of listener execution |

---

### `toPromise(event)`

Returns a Promise that resolves when the event is emitted.

```ts
await emitter.toPromise("user:logout")
```

---

### `has(event)`

Checks if there are listeners for a given event.

```ts
if (emitter.has('message')) { ... }
```

---

### `eventNames`

Returns all active event names.

---

### `isEmpty()`

Returns `true` if there are no active listeners.

---

### `destroy()`

Removes all listeners for all events.

---

## ⚙️ Priority Execution

Listeners are executed in order of **descending priority**:

```ts
emitter.on("data", () => console.log("default"))
emitter.on("data", () => console.log("high"), 100)
```

Output:

```
high
default
```

---

## ⛓️ Emit Strategy

```ts
await emitter.emit("task", payload, {strategy: "sequential"})
```

- **parallel**: All listeners run simultaneously (`Promise.all`)
- **sequential**: Listeners run one-by-one in order

---

## 🐞 Debugging

Pass a custom logger (or use default `console.log` with full trace):

```ts
const emitter = new EventEmitter({debug: (type, data) => console.log(type, data)})
```

Example output:

```
[EventEmitter] SUBSCRIBE login
[EventEmitter] EMIT login
[EventEmitter] UNSUBSCRIBE login
```

---

## 🧩 Example with Cleanup

```ts
const unsubscribe = emitter.on("ping", () => {
  console.log("pong!")
})

// later
unsubscribe()
```

---

## 📚 Type Safety Example

```ts
type Events = {
  "file:upload": {name: string; size: number}
}

const emitter = new EventEmitter<Events>()

emitter.emit("file:upload", {name: "test.txt", size: 1024}) // ✅ type-checked
```

---

## 🧼 Best Practices

- Prefer `once` or cleanup functions to avoid memory leaks.
- Use `sequential` strategy for dependent listeners.
- Use priorities to control listener execution order.
