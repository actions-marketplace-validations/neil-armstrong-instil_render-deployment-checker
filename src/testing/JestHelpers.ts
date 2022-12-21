import type {MockedFunction} from "jest-mock";

// eslint-disable-next-line
export function mockFunction<T extends (...args: any[]) => any>(fn: T): MockedFunction<T> {
  return fn as MockedFunction<T>;
}