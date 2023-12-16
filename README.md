# Result-Type

This library provides a fully type-safe and robust solution for error handling in TypeScript applications. It's inspired by the concept of [Result type](https://en.wikipedia.org/wiki/Result_type) in functional programming and designed to offer a type-safe way of handling operations that can either succeed (`Ok`) or fail (`Err`).

## Installation

Simply copy the file in `src/index.ts` into your project and import it.

## Usage

Here is the `LoginUseCase` class from `examples/use-case/user-login.ts`

```typescript
type LoginUseCaseResponse = Result<{ name: string; email: string }, Error>;
export class LoginUseCase
  implements UseCase<LoginUseCaseRequest, LoginUseCaseResponse>
{
  execute(request: LoginUseCaseRequest): LoginUseCaseResponse {
    const { password, email } = request;
    if (email === "admin" && password === "admin") {
      return Result.Ok({
        name: "admin",
        email: "a@g.com",
      });
    }

    return Result.Err(new Error("Invalid credentials")) 
  }
}
```

As you can see, the `execute` method returns a `Result` type. It can either be `Result.Ok` or `Result.Err`. In the case of `Ok`, it returns a value of type `LoginUseCaseResponse` which is an object containing the user's name and email. In the case of `Err`, it returns an error of type `Error` with the message "Invalid credentials".

---

Here is the example in `examples/main.ts` of using the `LoginUseCase` class from `examples/use-case/user-login.ts`

```typescript
function example1() {
  const useCase = new LoginUseCase();

  const account = "admin";
  const password = "admin";

  const resultOrError = useCase.execute({ email: account, password });

  const valueBeforeErrCheck = resultOrError.getValue();
      // ^? const valueBeforeErrCheck: void | { name: string; email: string;}

  const errorBeforeErrCheck = resultOrError.getError();
      // ^? const errorBeforeErrCheck: void | Error

  if (resultOrError.isErr()) {
    const errorAfterErrorCheck = resultOrError.getError();
        // ^? const errorAfterErrorCheck: Error
    console.log(error);
    return;
  }

  const valueAfterErrorCheck = resultOrError.getValue();
      // ^? const valueAfterErrorCheck: { name: string; email: string;}
  console.log(user.email);
}
```

As you can see, the `resultOrError` variable is of type `Result<LoginUseCaseResponse, Error>`. You must check if it is `Ok` or `Err` before extracting the value or error. If you don't check, the type of the value or error will be `void`.

When you try to extract the value or error without using `isErr()` or `isOk()`, TypeScript will not be able to infer the correct type of the value or error.

---

If you want to handle multiple operations that can each return a `Result` object, you can use the `Result.all()` method as follows.

```typescript
function LoginController(args: { account: string; password: string }) {
  const { account, password } = args;
  const useCase = new LoginUseCase();
  const checkPointUseCase = new CheckPointUseCase();

  const loginOrError = useCase.execute({ email: account, password });
  const checkpointOrError = checkPointUseCase.execute({ email: account });

  const results = Result.all([loginOrError, checkpointOrError]);

  if (results.isErr()) {
    return results;
  }

  const [user, checkpoint] = results.getValue();
  //    ^? [{ name: string; email: string; }, { emailVerified: boolean; disabled: boolean;}]

  if (checkpoint.disabled) {
    return Result.Err(new Error("User is disabled"));
  }

  return Result.Ok({ user, shouldVerifyEmail: !checkpoint.emailVerified });
}
```

As shown in `LoginController`, the `Result.all()` method takes a tuple of `Result` objects and returns a new `Result` object. The result is a tuple of values from all the `Ok` instances in the input tuple. If any of the input `Result` objects is `Err`, the `Result.all()` method returns that `Err` instance immediately.

---

## API Reference

### The Result<T, E> Type

```typescript
type Result<T, E = Error> = Ok<T> | Err<E>;
```

`Result<T, E>` is a union type that can be either `Ok<T>` or `Err<E>`, representing success and failure cases respectively. You may change the default error type to any type you want, now it is set to `Error` by default.

- `Ok<T>`: Represents a successful outcome containing a value of type `T`.
- `Err<E>:` Represents an error outcome containing an error value of type `E`.

### Ok and Err Classes

Both `Ok` and `Err` are classes that implement the `OkErr` abstract class as follows. More details about the implementation of `Ok` and `Err` can be found in `src/index.ts`.

```typescript
abstract class OkErr<T> {
  abstract isOk(): this is OkErr<T | void>;
  abstract isErr(): this is OkErr<T | void>;
  abstract getError(): T | void;
  abstract getValue(): T | void;
}
```

- `isOk()`: Determines if the instance is `Ok`.
- `isErr()`: Determines if the instance is `Err`.
- `getValue()`: Retrieves the value from `Ok`.
- `getError()`: Retrieves the error from `Err`.

### The Result Object

The `Result` object is a utility object that provides two factory methods, `.Ok()` and `.Err()`, for creating instances of Ok and Err classes respectively. It also provides a method `.all()` to handle an array of Result objects.

#### Ok Method

The `Ok` method is a factory method for creating `Ok` instances. It takes a value of type `T` and returns an instance of `Ok<T>`.

If the provided value is already an instance of `Ok`, it extracts the value from it and creates a new `Ok` instance with that value.

#### Err Method

The `Err` method is a factory method for creating `Err` instances. It takes an error of type `E` and returns an instance of `Err<E>`.

If the provided error is already an instance of `Err`, it extracts the error from it and creates a new `Err` instance with that error.

#### all Method

The all method takes an array of `Result` objects and returns a new `Result` object.

It iterates over the array and if it finds an `Err` instance, it returns that instance immediately. If it doesn't find any `Err` instances, it returns an `Ok` instance with an array of values from all the Ok instances in the input array.

This method is useful for handling multiple operations that can each return a `Result` object, and you want to stop processing as soon as an error is encountered.

---

### Contact

If you have any questions or suggestions, please feel free to contact me at `bwchen.dev@gmail.com`.
