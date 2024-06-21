import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequireAuthProp } from '@clerk/clerk-sdk-node';

export type UserJWT = {
  email: string;
  userId: string;
};
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: RequireAuthProp<Request> = ctx.switchToHttp().getRequest();
    return request.auth;
  },
);
