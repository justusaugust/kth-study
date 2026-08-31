import "@testing-library/jest-dom/vitest";

// Node 26 exposes a disabled global localStorage unless it is started with a
// backing file. Install the small in-memory Storage contract that browser code
// expects so jsdom tests stay independent of the Node process flags.
const storedValues = new Map<string, string>();
const memoryStorage: Storage = {
  get length() {
    return storedValues.size;
  },
  clear() {
    storedValues.clear();
  },
  getItem(key) {
    return storedValues.get(key) ?? null;
  },
  key(index) {
    return [...storedValues.keys()][index] ?? null;
  },
  removeItem(key) {
    storedValues.delete(key);
  },
  setItem(key, value) {
    storedValues.set(key, String(value));
  },
};

Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: memoryStorage,
});
