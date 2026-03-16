import type { Config } from "jest";

const config: Config = {
  preset: "react-native",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  testPathIgnorePatterns: ["/node_modules/"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|expo-router|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg))"
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1"
  },
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "supabase/functions/**/*.ts",
    "!**/*.d.ts"
  ]
};

export default config;
