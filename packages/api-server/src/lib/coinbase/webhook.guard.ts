import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import { compare } from '@/utils';

interface CoinbaseRequest {
  headers: Record<string, string>;
  rawBody: string;
}

@Injectable()
export class CoinbaseWebhookGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<CoinbaseRequest>();
    const rawBody = request.rawBody;

    const hmacHeader = request.headers['x-cc-webhook-signature'];

    await this.verifySigHeader(
      rawBody,
      hmacHeader,
      process.env.COINBASE_COMMERCE_SECRET,
    );

    return true;
  }

  async verifySigHeader(payload: any, sigHeader: any, secret: any) {
    const computedSignature = createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex');

    return compare(computedSignature, sigHeader);
  }
}
