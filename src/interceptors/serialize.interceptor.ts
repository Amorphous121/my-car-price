import {
  ExecutionContext,
  NestInterceptor,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { plainToInstance } from 'class-transformer';

interface IClassConstructor {
  // eslint-disable-next-line @typescript-eslint/ban-types
  new (...args: any[]): {};
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: IClassConstructor) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Run something something before a request is handled
    // by the request handler

    console.log('Running before the handler ');

    return next.handle().pipe(
      map((data: IClassConstructor) => {
        // Run Something before the response is sent out
        console.log('Im runnig before data is sent out');
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}

export function Serialize(dto: IClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
