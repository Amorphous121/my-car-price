import {
  NestInterceptor,
  CallHandler,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private readonly userService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};
    if (userId) {
      const user = await this.userService.getUserById(userId);
      request.currentUser = user;
    }
    return next.handle();
  }
}
