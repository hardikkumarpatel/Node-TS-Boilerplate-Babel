import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";
import sonarJS from "eslint-plugin-sonarjs";

export default [
  eslintConfigPrettier,
  eslint.configs.recommended,
  sonarJS.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.strict,
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  {
    languageOptions: {
      globals: {
        NodeJS: true,
        Express: true,
        ...globals.node
      }
    }
  },
  { settings: { node: { version: "detect" } } },
  {
    plugins: {
      prettier: prettierPlugin
    }
  },
  {
    rules: {
      "no-undef": "error",
      "no-dupe-class-members": "off",
      "prefer-const": "warn",
      "no-empty-function": ["error", { allow: ["getters", "setters", "constructors"] }],
      "@typescript-eslint/no-extraneous-class": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
      "sonarjs/sonar-no-fallthrough": "off",
      "sonarjs/public-static-readonly": "off"
      // "max-lines-per-function": ["error", { "max": 30 }],
      // "max-lines": ["error", { "max": 30, "skipBlankLines": true, "skipComments": true }],
      // "sonarjs/sonar-max-lines-per-function": ["error", { "maximum": 30 }],
      // "sonarjs/sonar-max-lines": ["error", { "maximum": 30 }]
    }
  },
  {
    ignores: [
      "eslint.config.mjs",
      "src/typings/*",
      "**/build/**",
      "**/dist/**",
      "**/node_modules/",
      ".git/",
      "src/api/graphql/schema/**/*.graphql",
      "src/upload/*"
    ]
  }
];
