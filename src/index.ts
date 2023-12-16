abstract class OkErr<T> {
  abstract isOk(): this is OkErr<T | void>;
  abstract isErr(): this is OkErr<T | void>;
  abstract getError(): T | void;
  abstract getValue(): T | void;
}

type ErrorUnion<T extends readonly Result<unknown, unknown>[]> =
  T extends readonly Result<unknown, infer E>[] ? E : never;

type OkTuple<T extends readonly Result<unknown, unknown>[]> = {
  [K in keyof T]: T[K] extends Result<infer T, any> ? T : never;
};

export class Err<T> implements OkErr<T> {
  constructor(private value: T) {}

  isOk(): this is Err<void> {
    return false;
  }

  isErr(): this is Err<T> {
    return true;
  }

  getError(): T {
    return this.value;
  }

  getValue(): void {
    throw new Error("Error does not have a value");
  }
}

export class Ok<T> implements OkErr<T> {
  constructor(private value: T) {}

  isOk(): this is Ok<T> {
    return true;
  }

  isErr(): this is Ok<void> {
    return false;
  }

  getError(): void {
    throw new Error("Ok does not have an error");
  }

  getValue(): T {
    return this.value;
  }
}

export type Result<T, E = Error> = Ok<T> | Err<E>;

export const Result = {
  Ok: function <T, R = T extends Ok<any> ? T : Ok<T>>(value: T): R {
    if (value instanceof Ok) {
      return new Ok(value.getValue()) as R;
    }

    return new Ok(value) as R;
  },

  Err: function <E, R = E extends Err<any> ? E : Err<E>>(error: E): R {
    if (error instanceof Err) {
      return new Err(error.getError()) as R;
    }
    return new Err(error) as R;
  },

  all<T extends Result<unknown, unknown>[] | []>(
    results: T
  ): Result<OkTuple<T>, ErrorUnion<T>> {
    const values: unknown[] = [];

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.isErr()) {
        return result as Err<ErrorUnion<T>>;
      }
      values.push(result.getValue());
    }

    return Result.Ok(values) as Ok<OkTuple<T>>;
  },
} as const;
