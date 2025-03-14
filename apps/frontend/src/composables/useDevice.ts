import {breakpointsTailwind, useBreakpoints} from "@vueuse/core"

export function useDevice() {
  const breakpoint = useBreakpoints(breakpointsTailwind)

  return {
    isMobile: breakpoint.smaller("sm"),
    isTablet: breakpoint.smaller("md"),
    isDesktop: breakpoint.greaterOrEqual("md"),
  }
}
