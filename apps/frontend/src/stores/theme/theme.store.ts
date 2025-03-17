import {ref, watch, watchEffect} from "vue"
import {useBroadcastChannel} from "@vueuse/core"
import {defineStore} from "pinia"
import {getItem, setItem} from "@/utils/persistStore"
import {generatePrimaryPalette, updateCssVariables} from "./utils/colorPalette"
import {changeThemeSafari, setTransition, watchUserSystemTheme} from "./utils/darkMode"

const BROADCAST_CHANNEL_NAME = "seats-sync.theme"
const STORAGE_KEY_MODE = "seats-sync.dark"
const DEFAULT_PRIMARY_COLOR = "#372CD3"

type ThemeData = {isDark: boolean; primaryColor: string}

export const useThemeStore = defineStore("theme", () => {
  const {post, data: themeData} = useBroadcastChannel<ThemeData, ThemeData>({name: BROADCAST_CHANNEL_NAME})

  const primaryColor = ref("#372CD3")
  const isDarkMode = ref(isDarkModeSaved())

  function setPrimaryColor(hex: string) {
    primaryColor.value = hex
    updateCssVariables(generatePrimaryPalette(hex))
    post({isDark: isDarkMode.value, primaryColor: hex})
  }

  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value
  }

  function isDarkModeSaved() {
    const isDark = getItem<boolean>(STORAGE_KEY_MODE)
    return isDark == null ? window.matchMedia("(prefers-color-scheme: dark)").matches : isDark
  }

  function setMode(isDark: boolean) {
    setTransition()

    document.documentElement.classList.toggle("dark", isDark)
    changeThemeSafari(isDark ? "#000000" : "#ffffff")

    setItem<boolean>(STORAGE_KEY_MODE, isDark)
    post({isDark, primaryColor: primaryColor.value})
  }

  function reset() {
    setPrimaryColor(DEFAULT_PRIMARY_COLOR)
    post({isDark: isDarkMode.value, primaryColor: primaryColor.value})
  }

  watch(isDarkMode, setMode, {immediate: true})
  watchUserSystemTheme((isDark) => (isDarkMode.value = isDark))
  setPrimaryColor(primaryColor.value)

  watchEffect(() => {
    if (!themeData.value) return

    isDarkMode.value = themeData.value.isDark
    primaryColor.value = themeData.value.primaryColor
  })

  return {
    isDarkMode,
    primaryColor,

    toggleDarkMode,
    setPrimaryColor,
    reset,
  }
})
