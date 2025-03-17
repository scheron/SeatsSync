import type { ErrorCode } from "@seats-sync/constants/errors";
import type { Method } from "@seats-sync/constants/methods";
import type { Subscription } from "@seats-sync/constants/subscriptions";

export type ResponseStatus = "success" | "error" | "snapshot" | "update";

export type BaseMessage = {
  /** External user id - unique identifier for the message */
  eid: string;
  /** Message timestamp in milliseconds */
  ts?: number;
};

export type MessageRequest<Data = any> = BaseMessage & {
  /** Message type */
  type: Method | Subscription | "*";
  /** Message payload */
  data: Data;
};

export type MessageSuccess<Data = unknown> = BaseMessage & {
  /** Message response status */
  status: Exclude<ResponseStatus, "error">;
  /** Message payload */
  data: Data;
  /** No error */
  error: null;
  /** Message type */
  type: Method & Subscription;
};

export type MessageError = BaseMessage & {
  /** Message response status */
  status: Extract<ResponseStatus, "error">;
  /** Message type */
  type: Method & Subscription;
  /** No data */
  data: null;
  /** Error code for client handling */
  error: ErrorCode;
};

export type Message<Data = unknown> =
  | MessageRequest<Data>
  | MessageSuccess<Data>
  | MessageError;
