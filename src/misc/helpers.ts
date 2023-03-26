export const NoCodeRegExp = /[ ]+(?=[^"]*(?:"[^"]*"[^"]*)*$)+|\n|\t|;;.+/g
export const extractComments = (source: string) =>
  (source.match(NoCodeRegExp) ?? []).filter((x) => x[0] === ';' && x[1] === ';')
export const handleHangingSemi = (source: string) =>
  source[source.length - 1] === ';'
    ? source.substring(0, source.length - 1)
    : source
export const removeNoCode = (source: string) => source.replace(NoCodeRegExp, '')
export const wrapInBody = (source: string) => `:[${source}]`
export const protolessModule = (methods: Record<string, unknown>) => {
  const env = Object.create(null)
  for (const method in methods) env[method] = methods[method]
  return env
}
