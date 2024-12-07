import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { JumpstartDatabaseError } from 'src/modules/jumpstart_db/jumpstart-db.types';

@Catch()
export class JumpstartDbExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const next = ctx.getNext();

    if (exception instanceof JumpstartDatabaseError) {
      next(exception);
    } else {
      if (Array.isArray(exception?.response?.message)) {
        const totalErrors = exception.response.message.length;
        const firstErrorMessage = exception.response.message[0];
        const strippedErrorMessage =
          totalErrors > 1 ? `Error: ${firstErrorMessage} (1/${totalErrors})` : `Error: ${firstErrorMessage}`;
        exception.response.message = strippedErrorMessage;
      }

      next(exception);
    }
  }
}
