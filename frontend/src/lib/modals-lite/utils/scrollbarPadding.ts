export const scrollbarPadding = {
  get: getScrollbarWidth,
  set: setScrollbarPadding,
  delete: deleteScrollbarPadding,
}

function getScrollbarWidth() {
  const div = document.createElement("div")
  div.style.position = "absolute"
  div.style.top = "-9999px"
  div.style.width = "100px"
  div.style.height = "100px"
  div.style.overflow = "scroll"
  document.body.appendChild(div)

  const scrollbarWidth = div.offsetWidth - div.clientWidth
  document.body.removeChild(div)
  return scrollbarWidth
}

function setScrollbarPadding() {
  const scrollbarWidth = getScrollbarWidth()

  const container = document.body

  const hasScrollbar = container.scrollHeight > document.documentElement.clientHeight

  if (hasScrollbar) {
    container.style.paddingRight = `${scrollbarWidth}px`
    container.style.overflow = "hidden"
  } else {
    container.style.paddingRight = ""
  }
}

function deleteScrollbarPadding() {
  const container = document.body
  container.style.paddingRight = ""
  container.style.overflow = "auto"
}
