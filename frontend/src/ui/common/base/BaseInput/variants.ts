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
    "gap-2 relative inline-flex w-full select-none items-center justify-center rounded-md border border-outline-2 bg-base-1 px-2 outline-none transition-all duration-200 focus-within:border-content-1 focus-within:ring-1 focus-within:ring-content-1 hover:border-content-1",
  variants: {
    variant: {
      primary:
        "w-full rounded-lg border border-outline-1 bg-base-2 px-4 py-2 text-content-1 shadow-sm focus-within:border-blue-500 focus-within:ring-0 focus-within:ring-blue-500  hover:border-blue-500",
    },
    disabled: "cursor-not-allowed bg-base-3 opacity-80 !text-content-3 !border-outline-3 hover:bg-base-3",
    invalid: "border-red-500 focus-within:border-red-500",
  },
  defaultVariants: {
    variant: "primary",
  },
})

export const inputVariants = defineVariant({
  baseClass: "flex-1 border-none bg-transparent outline-none disabled:cursor-not-allowed",
  variants: {
    variant: {
      primary: "text-content-1 placeholder:text-content-3",
    },
    disabled: "cursor-not-allowed !text-content-3 placeholder:text-content-3",
  },
  defaultVariants: {
    variant: "primary",
  },
})
