import { Err } from "../src";

export interface UseCaseException extends Error {}
export class UseCaseException extends Err<Error> {
  constructor(message: Error | string) {
    let error: Error;
    if (typeof message === "string") {
      error = new Error(message);
    } else {
      error = message;
    }

    super(error);
  }
}
