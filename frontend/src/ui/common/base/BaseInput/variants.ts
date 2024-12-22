import {defineVariant} from "@/utils/tailwindcss"

export const sizesVariants = defineVariant({
  baseClass: "w-full",
  variants: {
    size: {
      xs: "h-6 px-2 text-xs",
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-3",
      lg: "h-12 px-4 text-lg",
      xl: "h-14 px-5 text-xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

export const containerVariants = defineVariant({
  baseClass:
    "gap-2 relative inline-flex w-full select-none items-center justify-center rounded-md border border-outline-2 bg-base-1 px-2 outline-none transition-all duration-200 focus-within:border-primary-800 focus-within:ring-1 focus-within:ring-primary-800 hover:border-primary-800",
  variants: {
    variant: {
      primary:
        "w-full rounded-lg border border-primary-300 bg-primary-200 px-4 py-2 text-content shadow-sm focus-within:border-accent focus-within:ring-0 focus-within:ring-accent  hover:border-accent",
    },
    disabled: "cursor-not-allowed bg-primary-300 opacity-80 !text-content-3 !border-primary-300 hover:bg-bg-primary-300",
    invalid: "border-error focus-within:border-error",
  },
  defaultVariants: {
    variant: "primary",
  },
})

export const inputVariants = defineVariant({
  baseClass: "flex-1 border-none bg-transparent outline-none disabled:cursor-not-allowed",
  variants: {
    variant: {
      primary: "text-content placeholder:text-content/30",
    },
    disabled: "cursor-not-allowed !text-content placeholder:text-content/30",
  },
  defaultVariants: {
    variant: "primary",
  },
})
