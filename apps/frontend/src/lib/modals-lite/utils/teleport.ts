import type {TeleportStrategy} from "../model/types"

const ROOT_DEPTH_THRESHOLD = 3

function getElementDepth(selector: string): number {
  const element = document.querySelector(selector)
  if (!element) return 0

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node: Node) => {
      return node.contains(element) || node === element ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
    },
  })

  let depth = 0
  let current = walker.currentNode

  while (walker.nextNode() && current !== element) {
    depth++
    current = walker.currentNode
  }

  return depth
}

export function getTeleportStrategy(selector: string): TeleportStrategy {
  const depth = getElementDepth(selector)

  if (depth <= ROOT_DEPTH_THRESHOLD || selector === "body") {
    return {
      strategy: "fixed",
      lockScroll: true,
    }
  }

  return {
    strategy: "absolute",
    lockScroll: false,
  }
}

export function getTeleportTarget(teleportTarget: string) {
  try {
    const isExists = document.querySelector(teleportTarget)
    return isExists ? teleportTarget : "body"
  } catch {
    return "body"
  }
}
