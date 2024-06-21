export class WalletCreatedEvent {
  userId: string;
  walletAddress: string;
  constructor(userId: string, walletAddress: string) {
    this.userId = userId;
    this.walletAddress = walletAddress;
  }
}
