import { Config } from "@jest/types";

const config: Config.InitialOptions = {
  testMatch: ["**/__tests__/**/*.test.[jt]s"],
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      babelConfig: require("./babel.config.ts"),
    },
  },
  transform: { "\\.ts$": "ts-jest" },
};

export default config;
