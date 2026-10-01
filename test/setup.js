import "@testing-library/jest-dom/vitest";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: () => ({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
  }),
});

Object.defineProperty(window, "scrollTo", { writable: true, value: () => {} });
Object.defineProperty(window, "scrollBy", { writable: true, value: () => {} });

class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, "IntersectionObserver", { writable: true, value: IntersectionObserver });
Object.defineProperty(globalThis, "IntersectionObserver", { writable: true, value: IntersectionObserver });
