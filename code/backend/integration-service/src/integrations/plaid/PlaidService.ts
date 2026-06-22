export class PlaidService {
  async initialize(): Promise<void> {}

  // Lifecycle hook invoked on shutdown. No-op: this service holds no
  // resources that require explicit teardown.
  async cleanup(): Promise<void> {}

  // NOTE: Declared in the integration API (index.ts) but never implemented.
  // Missing feature, not a bug. Throws explicitly until implemented.
  // See FIXES.md.
  async exchangePublicToken(..._args: any[]): Promise<any> {
    throw new Error("PlaidService.exchangePublicToken is not implemented");
  }
}
