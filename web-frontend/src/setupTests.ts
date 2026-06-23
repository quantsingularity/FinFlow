// jest-dom adds custom matchers for asserting on DOM nodes, e.g.
// expect(element).toHaveTextContent(/react/i)
import "@testing-library/jest-dom";

// jsdom does not implement ResizeObserver, which recharts' ResponsiveContainer
// and several UI primitives rely on. Provide a no-op polyfill for tests.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver =
  globalThis.ResizeObserver ||
  (ResizeObserverStub as unknown as typeof ResizeObserver);

// jsdom does not implement matchMedia, used by theme and responsive helpers.
if (!globalThis.matchMedia) {
  globalThis.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof globalThis.matchMedia;
}
