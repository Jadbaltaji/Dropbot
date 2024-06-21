import {
  Controller,
  Logger,
  Post,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CoinbaseCommerceWebhookSchema } from '@/lib/coinbase/webhook.schema';

import { CoinbaseWebhookGuard } from '@/lib/coinbase/webhook.guard';
import { CheckoutService } from '@/features/checkout/checkout.service';

@Controller('/charge')
@UseGuards(new CoinbaseWebhookGuard())
export class ChargeController {
  private readonly logger = new Logger(ChargeController.name);

  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  async handleCoinbaseCommerceWebhook(@Req() request: RawBodyRequest<Request>) {
    const payload = CoinbaseCommerceWebhookSchema.parse(request.body);

    if (payload && payload.event && payload.event.type) {
      await this.checkoutService.handleWebhook(
        payload.event.data.code,
        payload.event.data.metadata.userId,
        payload.event.data.metadata.packageId,
        payload.event.type,
      );
    }
  }
}
