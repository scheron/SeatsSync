import baseConfig from "@seats-sync/config/prettier"

export default {
  ...baseConfig,
  importOrder: [
    "^@/seats-sync(.*)$",
    "",
    "^vue$",
    "^vue-(.*)$",
    "^@vueuse/(.*)$",
    "<THIRD_PARTY_MODULES>",
    "^@/api(.*)$",
    "^@/lib(.*)$",
    "^@/utils(.*)$",
    "^@/constants(.*)$",
    "^@/composables(.*)$",
    "^@/stores(.*)$",
    "^@/ui(.*)$",
    "^(?!.*)[./].*$",
    "^[./]",
    "",
    "<TYPES>",
    "<TYPES>^[.]",
  ],
}
