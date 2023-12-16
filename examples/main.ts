import { Result } from "../src";
import { LoginUseCase } from "./use-case/user-login";
import { CheckPointUseCase } from "./use-case/get-user-checkpoint";

function example1() {
  const useCase = new LoginUseCase();

  const account = "admin";
  const password = "admin";

  const resultOrError = useCase.execute({ email: account, password });

  if (resultOrError.isErr()) {
    console.log(resultOrError.getError());
    return;
  }

  const user = resultOrError.getValue();
  // ^?
  console.log(user.email);
}

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

  if (checkpoint.disabled) {
    return Result.Err(new Error("User is disabled"));
  }

  return Result.Ok({ user, shouldVerifyEmail: !checkpoint.emailVerified });
}

function main() {
  const account = "admin";
  const password = "admin";
  const result = LoginController({ account, password });

  if (result.isErr()) {
    console.log(result.getError().message);
    return;
  }
  const payload = result.getValue();

  console.log(payload);
}

main();
