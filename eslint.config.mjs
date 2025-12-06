import nextConfig from "eslint-config-next";

const config = [
  {
    ignores: ["**/.next/**", "**/node_modules/**", "**/public/models/**"],
  },
  ...nextConfig,
  {
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "react/no-unescaped-entities": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default config;
