export function setTransition() {
  document.body.classList.add("theme-transition")

  setTimeout(() => {
    document.body.classList.remove("theme-transition")
  }, 300)
}

export function watchUserSystemTheme(callback: (isDark: boolean) => void) {
  const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)")
  if (!prefersDarkMode) return

  prefersDarkMode.onchange = (event: MediaQueryListEvent) => callback(event.matches)
}

export function changeThemeSafari(color: string) {
  const isDarkMode: boolean = window.matchMedia("(prefers-color-scheme: dark)").matches

  let themeMetaTagLight: HTMLMetaElement | null = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: light)"]'); // prettier-ignore
  let themeMetaTagDark: HTMLMetaElement | null = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]'); // prettier-ignore

  if (!themeMetaTagLight) {
    themeMetaTagLight = document.createElement("meta")
    themeMetaTagLight.name = "theme-color"
    themeMetaTagLight.media = "(prefers-color-scheme: light)"
    document.head.appendChild(themeMetaTagLight)
  }

  if (!themeMetaTagDark) {
    themeMetaTagDark = document.createElement("meta")
    themeMetaTagDark.name = "theme-color"
    themeMetaTagDark.media = "(prefers-color-scheme: dark)"
    document.head.appendChild(themeMetaTagDark)
  }

  if (isDarkMode) themeMetaTagDark.content = color
  else themeMetaTagLight.content = color
}
