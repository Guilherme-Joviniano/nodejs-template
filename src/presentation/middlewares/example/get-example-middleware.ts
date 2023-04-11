import { Logger } from '@/data/protocols/utils';
import { ErrorHandler, GetExample } from '@/domain/usecases';
import { Middleware } from '@/presentation/protocols/middleware';
import { serverError } from '@/presentation/utils';

import { Middleware as MiddlewareClass } from '../middleware';

export class GetExampleMiddleware
  extends MiddlewareClass
  implements Middleware
{
  constructor(
    private readonly getExample: GetExample,
    private readonly logger: Logger,
    private readonly errorHandler: ErrorHandler,
    valuesToExtract: (string | Record<string, string>)[]
  ) {
    super(valuesToExtract);
  }

  async handle(
    httpRequest: Middleware.HttpRequest,
    [state, setState]: Middleware.State,
    next: Middleware.Next
  ): Middleware.Result {
    try {
      const values = this.extractValuesFromSources({
        request: httpRequest,
        state,
      });

      const example = await this.getExample.get();

      this.logger.log({
        level: 'debug',
        message: 'GET EXAMPLE',
        payload: { example, values },
      });

      setState({ getExample: example });

      return next();
    } catch (error) {
      await this.errorHandler.handle(error);
      switch (error.message) {
        default:
          return serverError(error);
      }
    }
  }
}
