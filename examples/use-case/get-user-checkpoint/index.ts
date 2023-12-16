import { UseCaseException } from "../../exception";
import { Result } from "../../../src";
import { UseCase } from "../use-case.interface";

namespace CheckPointUseCaseException {
  export class InternalServerError extends UseCaseException {
    constructor() {
      super("Internal server error");
    }
  }
}

type CheckPointUseCaseRequest = { email: string };
type CheckPointUseCaseResponse = Result<
  {
    emailVerified: boolean;
    disabled: boolean;
  },
  Error
>;

export class CheckPointUseCase
  implements UseCase<CheckPointUseCaseRequest, CheckPointUseCaseResponse>
{
  execute(request: CheckPointUseCaseRequest): CheckPointUseCaseResponse {
    const { email } = request;
    if (email === "admin") {
      return Result.Ok({
        emailVerified: true,
        disabled: false,
      });
    }

    return new CheckPointUseCaseException.InternalServerError();
  }
}
