import { Result } from "../../src";

export interface UseCase<Request, Response extends Result<unknown, unknown>> {
  execute(request?: Request): Promise<Response> | Response;
}
