import {
  Controller,
  Post,
  RawBodyRequest,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { UserJSON, WebhookEvent } from '@clerk/clerk-sdk-node';
import { UserService } from '../user/user.service';
import { Webhook } from 'svix';
import { z } from 'zod';
import { meta } from 'eslint-plugin-prettier';

@Controller('/auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}
  @Post('/webhooks')
  async handleClerkWebhook(@Req() request: RawBodyRequest<Request>) {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const payload = request.rawBody.toString('utf8');
    const headers = request.headers;

    try {
      const msg = wh.verify(
        payload,
        headers as unknown as Record<string, string>,
      ) as WebhookEvent;
      switch (msg.type) {
        case 'user.created':
          await this.handleUserCreated(msg.data);
          break;
        case 'user.updated':
          break;
      }
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  async handleUserCreated(data: UserJSON) {
    const schema = z.object({
      invitedByUserId: z.string().optional().nullable().default(null),
    });

    const metadata = schema.parse(data.unsafe_metadata);

    await this.userService.createUser(
      data.id,
      data.username,
      metadata.invitedByUserId,
    );
  }
}
