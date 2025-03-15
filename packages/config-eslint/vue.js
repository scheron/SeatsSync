import * as vueParser from "vue-eslint-parser";
import typescript from "@typescript-eslint/parser";
import tseslint from "@typescript-eslint/eslint-plugin";
import baseConfig from "./base.js";
import importPlugin from "eslint-plugin-import";
import vue from "eslint-plugin-vue";

export default [
  ...baseConfig,
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: typescript,
        extraFileExtensions: [".vue"],
        ecmaVersion: "latest",
        sourceType: "module",
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      vue,
      "@typescript-eslint": tseslint,
      import: importPlugin,
    },
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/component-tags-order": [
        "error",
        {
          order: [
            "script:not([setup])",
            "script[setup]",
            "template",
            "style:not([scoped])",
            "style[scoped]",
          ],
        },
      ],
      "vue/attributes-order": [
        "error",
        {
          order: [
            "DEFINITION",
            "LIST_RENDERING",
            "CONDITIONALS",
            "RENDER_MODIFIERS",
            "GLOBAL",
            "UNIQUE",
            "TWO_WAY_BINDING",
            "OTHER_DIRECTIVES",
            "OTHER_ATTR",
            "EVENTS",
            "CONTENT",
          ],
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
];
