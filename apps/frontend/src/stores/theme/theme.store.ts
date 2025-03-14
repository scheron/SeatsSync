import {ref, watch} from "vue"
import {defineStore} from "pinia"
import {getItem, setItem} from "@/utils/persistStore"
import {generatePrimaryPalette, updateCssVariables} from "./utils/colorPalette"
import {changeThemeSafari, setTransition, watchUserSystemTheme} from "./utils/darkMode"

const STORAGE_KEY_MODE = "seats-sync.dark"

export const useThemeStore = defineStore("theme", () => {
  const primaryColor = ref("#372CD3")
  const isDarkMode = ref(isDarkModeSaved())

  function setPrimaryColor(hex: string) {
    primaryColor.value = hex
    updateCssVariables(generatePrimaryPalette(hex))
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
  }

  watch(isDarkMode, setMode, {immediate: true})
  watchUserSystemTheme((isDark) => (isDarkMode.value = isDark))
  setPrimaryColor(primaryColor.value)

  return {
    isDarkMode,
    toggleDarkMode,
    primaryColor,
    setPrimaryColor,
  }
})
