export function humanizeCamelCase(str: string) {
  const spaced = str.replace(/([A-Z])/g, ' $1')
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}
