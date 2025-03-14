export function getItem<T>(key: string) {
  try {
    const item = localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : null
  } catch (error) {
    console.log("Error getting data from localStorage", error)
    return null
  }
}

export function setItem<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.log("Error saving data in localStorage", error)
    return false
  }
}

export function removeItem(key: string) {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.log("Error removing data from localStorage", error)
    return false
  }
}
