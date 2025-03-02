export class TooltipLite {
  private tooltip: HTMLDivElement
  private currentTarget: HTMLElement | null
  private delay: number
  private delayHide: number
  private showTimeout: ReturnType<typeof setTimeout> | null
  private hideTimeout: ReturnType<typeof setTimeout> | null

  constructor({delay = 500, delayHide = 3000} = {}) {
    this.tooltip = document.createElement("div")
    this.tooltip.classList.add("tooltip-lite")
    document.body.appendChild(this.tooltip)

    this.updateTooltipPosition = this.updateTooltipPosition.bind(this)
    this.handleEvent = this.handleEvent.bind(this)

    this.currentTarget = null
    this.delay = delay
    this.delayHide = delayHide
    this.showTimeout = null
    this.hideTimeout = null

    document.addEventListener("mouseover", this.handleEvent)
    document.addEventListener("mouseout", this.handleEvent)
  }

  show(target: HTMLElement, content: string, position: "auto" | "up" | "bottom" | "left" | "right" = "auto"): void {
    if (!target) return

    clearTimeout(this.showTimeout!)
    clearTimeout(this.hideTimeout!)

    this.currentTarget = target
    this.tooltip.textContent = content
    this.tooltip.style.opacity = "1"
    this.tooltip.style.pointerEvents = "auto"
    this.updateTooltipPosition(position)

    this.hideTimeout = setTimeout(() => {
      this.hide()
    }, this.delayHide)
  }

  hide(): void {
    clearTimeout(this.showTimeout!)
    clearTimeout(this.hideTimeout!)

    if (!this.currentTarget) return

    this.tooltip.style.opacity = "0"
    this.tooltip.style.pointerEvents = "none"
    this.currentTarget = null
  }

  private updateTooltipPosition(position: "auto" | "up" | "bottom" | "left" | "right" = "auto"): void {
    if (!this.currentTarget) return

    const tooltipRect = this.tooltip.getBoundingClientRect()
    const targetRect = this.currentTarget.getBoundingClientRect()

    let top = 0,
      left = 0

    switch (position) {
      case "up":
        top = targetRect.top - tooltipRect.height - 8
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2
        break
      case "bottom":
        top = targetRect.bottom + 8
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2
        break
      case "left":
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2
        left = targetRect.left - tooltipRect.width - 8
        break
      case "right":
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2
        left = targetRect.right + 8
        break
      default: {
        const spaceAbove = targetRect.top
        const spaceBelow = window.innerHeight - targetRect.bottom

        if (spaceAbove > tooltipRect.height + 8) {
          top = targetRect.top - tooltipRect.height - 8
          left = targetRect.left + (targetRect.width - tooltipRect.width) / 2
        } else if (spaceBelow > tooltipRect.height + 8) {
          top = targetRect.bottom + 8
          left = targetRect.left + (targetRect.width - tooltipRect.width) / 2
        } else {
          top = targetRect.top + (targetRect.height - tooltipRect.height) / 2
          left = targetRect.right + 8
        }
      }
    }

    left = Math.max(8, Math.min(left, window.innerWidth - tooltipRect.width - 8))
    top = Math.max(8, Math.min(top, window.innerHeight - tooltipRect.height - 8))

    this.tooltip.style.top = `${top}px`
    this.tooltip.style.left = `${left}px`
  }

  private handleEvent(event: MouseEvent): void {
    const target = (event.target as HTMLElement).closest("[data-tooltip]") as HTMLElement

    switch (event.type) {
      case "mouseover":
        if (target) {
          const content = target.getAttribute("data-tooltip") || ""
          const position = (target.getAttribute("data-tooltip-position") || "auto") as "auto" | "up" | "bottom" | "left" | "right"

          clearTimeout(this.hideTimeout!)
          this.showTimeout = setTimeout(() => {
            this.show(target, content, position)
          }, this.delay)
        }
        break

      case "mouseout":
        if (this.currentTarget) {
          const relatedTarget = event.relatedTarget as HTMLElement
          const isMovingToTooltip = relatedTarget && relatedTarget.closest("[data-tooltip]")

          if (!isMovingToTooltip) {
            clearTimeout(this.showTimeout!)
            this.hideTimeout = setTimeout(() => {
              this.hide()
            }, this.delayHide)
          }
        }
        break
    }
  }

  destroy(): void {
    document.removeEventListener("mouseover", this.handleEvent)
    document.removeEventListener("mouseout", this.handleEvent)
    this.tooltip.remove()
  }
}
