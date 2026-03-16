import "@testing-library/jest-native/extend-expect";

jest.mock("@react-native-async-storage/async-storage", () => {
  const storage = new Map<string, string>();

  return {
    __esModule: true,
    default: {
      clear: jest.fn(async () => {
        storage.clear();
      }),
      getItem: jest.fn(async (key: string) => storage.get(key) ?? null),
      removeItem: jest.fn(async (key: string) => {
        storage.delete(key);
      }),
      setItem: jest.fn(async (key: string, value: string) => {
        storage.set(key, value);
      })
    }
  };
});
