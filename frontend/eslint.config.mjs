import * as vueParser from "vue-eslint-parser"
import tseslint from "@typescript-eslint/eslint-plugin"
import typescript from "@typescript-eslint/parser"
import eslintConfigPrettier from "eslint-config-prettier"
import importPlugin from "eslint-plugin-import"
import tailwindcss from "eslint-plugin-tailwindcss"
import unusedImports from "eslint-plugin-unused-imports"
import vue from "eslint-plugin-vue"

export default [
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx,vue}"],
    ignores: ["dist/**", "node_modules/**", ".eslintrc.js", "eslint.config.js", "postcss.config.js", "tailwind.config.ts", "vite.config.ts"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: typescript,
        project: ["./tsconfig.json"],
        extraFileExtensions: [".vue"],
        ecmaVersion: "latest",
        sourceType: "module",
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      vue: vue,
      import: importPlugin,
      "unused-imports": unusedImports,
      tailwindcss: tailwindcss,
    },
    rules: {
      "no-undef": "off",
      "no-return-assign": "error",
      "no-extra-semi": "off",
      "prefer-destructuring": "off",
      "lines-between-class-members": ["error", "always", {exceptAfterSingleLine: true}],
      "@typescript-eslint/no-unused-vars": ["warn", {argsIgnorePattern: "^_+$"}],
      "no-console": "off",
      "no-debugger": "off",
      "vue/multi-word-component-names": "off",
      "vue/component-tags-order": [
        "error",
        {
          order: ["script:not([setup])", "script[setup]", "template", "style:not([scoped])", "style[scoped]"],
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
            ["UNIQUE", "SLOT"],
            "TWO_WAY_BINDING",
            "OTHER_DIRECTIVES",
            "OTHER_ATTR",
            "EVENTS",
            "CONTENT",
          ],
          alphabetical: false,
        },
      ],
      "vue/component-definition-name-casing": ["error", "PascalCase"],
      "vue/component-name-in-template-casing": ["error", "PascalCase", {registeredComponentsOnly: true, ignores: ["tr"]}],
      "vue/no-irregular-whitespace": [
        "error",
        {
          skipStrings: true,
          skipComments: false,
          skipRegExps: false,
          skipTemplates: false,
          skipHTMLAttributeValues: false,
          skipHTMLTextContents: false,
        },
      ],
      "vue/no-dupe-keys": ["error", {groups: []}],
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "tailwindcss/classnames-order": "off",
      "tailwindcss/no-custom-classname": "off",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
          disallowTypeAnnotations: false,
        },
      ],
    },
  },
  {
    files: ["**/*.vue"],
    rules: {
      "vue/script-setup-uses-vars": "error",
      "vue/component-api-style": ["error", ["script-setup"]],
    },
  },
  eslintConfigPrettier,
]
