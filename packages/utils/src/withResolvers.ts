/**
 * Creates a promise with a resolve and reject function.
 * @returns An object with a promise, resolve, and reject function.
 * @example
 * const { promise, resolve, reject } = withResolvers<string>();
 *
 * // later
 * resolve("Hello, world!");
 *
 * // or
 * reject(new Error("Something went wrong"));
 */
export function withResolvers<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: any) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}
