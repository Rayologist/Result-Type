import { Result } from "../../../src";
import { UseCaseException } from "../../exception";
import { UseCase } from "../use-case.interface";

namespace LoginUseCaseException {
  export class InvalidCredentials extends UseCaseException {
    constructor() {
      super("Invalid credentials");
    }
  }
}

type LoginUseCaseRequest = { email: string; password: string };
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

    return new LoginUseCaseException.InvalidCredentials();
  }
}
