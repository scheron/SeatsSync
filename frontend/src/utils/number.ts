const separateNum = (numStr: string, separator: string = " "): string => numStr.replace(/\B(?=(\d{3})+(?!\d))/g, separator)

export function formatNumber(number: number, separator: string = " "): string {
  if (number == undefined) return number

  const numStr = number.toString()
  const [int, decimals] = numStr.split(".")

  const formattedInt = separateNum(int, separator)

  return !decimals ? formattedInt : formattedInt + "." + decimals
}
