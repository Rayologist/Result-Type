abstract class OkErr<T> {
  abstract isOk(): this is OkErr<T | void>;
  abstract isErr(): this is OkErr<T | void>;
  abstract get error(): T | void;
  abstract get value(): T | void;
}

type ErrorUnion<T extends readonly Result<unknown, unknown>[]> =
  T extends readonly Result<unknown, infer E>[] ? E : never;

type OkTuple<T extends readonly Result<unknown, unknown>[]> = {
  [K in keyof T]: T[K] extends Result<infer T, any> ? T : never;
};

export class Err<T> implements OkErr<T> {
  constructor(private result: T) {}

  isOk(): this is Err<void> {
    return false;
  }

  isErr(): this is Err<T> {
    return true;
  }

  get error(): T {
    return this.result;
  }

  get value(): void {
    throw new Error("`Error` result can not have a value");
  }
}

export class Ok<T> implements OkErr<T> {
  constructor(private result: T) {}

  isOk(): this is Ok<T> {
    return true;
  }

  isErr(): this is Ok<void> {
    return false;
  }

  get error(): void {
    throw new Error("`Ok` result can not have an error");
  }

  get value(): T {
    return this.result;
  }
}

export type Result<T, E = Error> = Ok<T> | Err<E>;
export const Result = {
  Ok: function <T, R = T extends Ok<any> ? T : Ok<T>>(result: T): R {
    if (result instanceof Ok) {
      return new Ok(result.value) as R;
    }

    return new Ok(result) as R;
  },

  Err: function <E, R = E extends Err<any> ? E : Err<E>>(result: E): R {
    if (result instanceof Err) {
      return new Err(result.error()) as R;
    }
    return new Err(result) as R;
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
      values.push(result.value);
    }

    return Result.Ok(values) as Ok<OkTuple<T>>;
  },
} as const;
