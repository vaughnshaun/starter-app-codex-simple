import "@testing-library/jest-native/extend-expect";

jest.mock("expo-router", () => {
  const React = require("react");
  const { Text } = require("react-native");

  const push = jest.fn();
  const replace = jest.fn();
  let pathname = "/";
  let searchParams = {};

  return {
    __esModule: true,
    Link: ({ children }: { children: unknown }) => React.createElement(Text, null, children),
    Redirect: ({ href }: { href: string | { pathname?: string } }) =>
      React.createElement(
        Text,
        { testID: "redirect" },
        `Redirect:${typeof href === "string" ? href : href.pathname || ""}`
      ),
    Slot: () => React.createElement(Text, { testID: "slot" }, "slot"),
    useLocalSearchParams: () => searchParams,
    usePathname: () => pathname,
    useRouter: () => ({
      push,
      replace
    }),
    __router: {
      push,
      replace,
      reset() {
        push.mockClear();
        replace.mockClear();
        pathname = "/";
        searchParams = {};
      },
      setPathname(nextPathname: string) {
        pathname = nextPathname;
      },
      setSearchParams(nextSearchParams: Record<string, string>) {
        searchParams = nextSearchParams;
      }
    }
  };
});

afterEach(() => {
  const router = jest.requireMock("expo-router").__router;
  router.reset();
});
