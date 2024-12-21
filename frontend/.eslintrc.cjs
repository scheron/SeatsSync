require("@rushstack/eslint-patch/eslint-bulk-suppressions")

module.exports = {
  root: true,
  plugins: ["import", "unused-imports"],
  extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/eslint-config-typescript", "prettier", "plugin:tailwindcss/recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  rules: {
    "no-undef": "error",
    "no-return-assign": "error",
    "no-extra-semi": "off",
    "prefer-destructuring": "off",
    "lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }],
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_+$" }],
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
    "vue/component-name-in-template-casing": ["error", "PascalCase", { registeredComponentsOnly: true, ignores: ["tr"] }],
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
    "vue/no-dupe-keys": ["error", { groups: [] }],
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
  },
 
}
