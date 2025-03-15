import baseConfig from "@seats-sync/config/prettier"

export default {
  ...baseConfig,
  importOrder: [
    "<THIRD_PARTY_MODULES>",
    "^@/lib(.*)$",
    "^@/core(.*)$",
    "^@/modules(.*)$",
    "^@/constants(.*)$",
    "^@/utils(.*)$",
    "^@/shared(.*)$",
    "^(?!.*)[./].*$",
    "^[./]",
    "",
    "<TYPES>",
    "<TYPES>^[.]",
  ],
}
