export class WebhookService {
  // Configuration injected by index.ts.
  constructor(_config?: any) {}

  async initialize(): Promise<void> {}

  // Lifecycle hook invoked on shutdown. No-op: this service holds no
  // resources that require explicit teardown.
  async cleanup(): Promise<void> {}
}
