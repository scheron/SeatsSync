import {findFocusableEl} from "@seats-sync/utils/dom"

export default {
  mounted(el: HTMLElement) {
    setTimeout(() => {
      const focusableElement = findFocusableEl(el)

      if (focusableElement) focusableElement.focus?.()
    }, 0)
  },
}
