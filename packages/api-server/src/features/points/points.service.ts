import { Injectable } from '@nestjs/common';
import { RouteJobCompletedEvent } from '@/features/routes/routes.events';
import { OnEvent } from '@nestjs/event-emitter';
import { WalletCreatedEvent } from '@/features/wallet/wallet.events';
import { UserService } from '@/features/user/user.service';

@Injectable()
export class PointsService {
  points = {
    routeJobCompleted: 10,
    userCreatedWallet: 500,
    userReferralCreatedWallet: 500,
  };

  constructor(private readonly user: UserService) {}

  @OnEvent(RouteJobCompletedEvent.name)
  async handleRouteJobCompletedEvent(payload: RouteJobCompletedEvent) {
    const user = await this.user.findUserByWalletAddress(payload.walletAddress);
    await this.user.addPoints(user.id, this.points.routeJobCompleted);
  }

  @OnEvent(WalletCreatedEvent.name)
  async handleWalletCreatedEvent(payload: WalletCreatedEvent) {
    const user = await this.user.findUserById(payload.userId);
    // Give points to the User
    await this.user.addPoints(user.id, this.points.userCreatedWallet);
    if (user.invitedByUserId === null) return;
    // Give points to the Referer
    const invitedByUser = await this.user.findUserById(user.invitedByUserId);
    await this.user.addPoints(
      invitedByUser.id,
      this.points.userReferralCreatedWallet,
    );
  }
}
