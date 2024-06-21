export class RouteJobCompletedEvent {
  jobId: string;
  walletAddress: string;
  constructor(jobId: string, walletAddress: string) {
    this.jobId = jobId;
    this.walletAddress = walletAddress;
  }
}
