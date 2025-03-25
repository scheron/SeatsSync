/**
 * Event Emitter Module
 *
 * A type-safe, priority-based event system with flexible execution strategies.
 * This module exports:
 * - EventEmitter: The main implementation class
 * - Types and interfaces for extending the system
 */

export * from "./EventEmitter"
export type {CleanUpFn, EmitOptions, EmitStrategy, EventCallback, EventMap, IEventEmitter} from "./types"
