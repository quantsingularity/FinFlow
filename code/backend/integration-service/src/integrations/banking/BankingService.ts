export class BankingService {
  async initialize(): Promise<void> {}

  // Lifecycle hook invoked on shutdown. No-op: this service holds no
  // resources that require explicit teardown.
  async cleanup(): Promise<void> {}
}
