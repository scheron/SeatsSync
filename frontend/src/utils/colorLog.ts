type ColorKeys = keyof typeof COLORS

type LogParams = {
  color?: ColorKeys
  bgColor?: ColorKeys
  fontSize?: string
  padding?: string
}

const PARAMS: LogParams = {
  color: "black",
  bgColor: "transparent",
  fontSize: "12px",
  padding: "2px",
}

const COLORS = {
  transparent: "transparent",
  success: "#00B257",
  info: "#0074d9",
  error: "#D05B72",
  warning: "#FF8C00",
  navy: "#001f3f",
  blue: "#0074d9",
  aqua: "#7fdbff",
  teal: "#39cccc",
  olive: "#3d9970",
  green: "#2ecc40",
  lime: "#01ff70",
  yellow: "#ffdc00",
  orange: "#ff851b",
  red: "#ff4136",
  fuchsia: "#f012be",
  purple: "#b10dc9",
  maroon: "#85144b",
  white: "#ffffff",
  gray: "#aaaaaa",
  silver: "#dddddd",
  black: "#111111",
}

function log(msg: string, params: LogParams = {}, styles: string = "") {
  const {color, bgColor, fontSize, padding} = {...PARAMS, ...params}

  const logStyles = `
    color:${COLORS[color as ColorKeys] ?? color};
    background:${COLORS[bgColor as ColorKeys] ?? bgColor};
    font-weight: bold;
    font-size:${fontSize};
    padding:${padding};
  `.concat(styles)

  console.log(`${new Date().toLocaleTimeString()}\n%c${msg}`, logStyles)
}

export const colorLog = {
  success: (msg: string, params: LogParams = {}, styles: string = "") => log(msg, {...params, color: "success"}, styles),
  successBg: (msg: string, params: LogParams = {}, styles: string = "") => log(msg, {...params, bgColor: "success", color: "white"}, styles),

  error: (msg: string, params: LogParams = {}, styles: string = "") => log(msg, {...params, color: "error"}, styles),
  errorBg: (msg: string, params: LogParams = {}, styles: string = "") => log(msg, {...params, bgColor: "error", color: "white"}, styles),

  info: (msg: string, params: LogParams = {}, styles: string = "") => log(msg, {...params, color: "info"}, styles),
  infoBg: (msg: string, params: LogParams = {}, styles: string = "") => log(msg, {...params, bgColor: "info", color: "black"}, styles),

  warning: (msg: string, params: LogParams = {}, styles: string = "") => log(msg, {...params, color: "white"}, styles),
  warningBg: (msg: string, params: LogParams = {}, styles: string = "") => log(msg, {...params, bgColor: "warning", color: "white"}, styles),

  dark: (msg: string, params: LogParams = {}, styles: string = "") => log(msg, {...params, color: "error", bgColor: "black"}, styles),
  common: (msg: string, styles: string = "") => log(msg, {}, styles),
  custom: (msg: string, params: LogParams = {}, styles: string = "") => log(msg, params, styles),
}
