export const NoCodeRegExp = /[ ]+(?=[^"]*(?:"[^"]*"[^"]*)*$)+|\n|\t|;;.+/g
export const extractComments = (source: string) => source.match(/;;.+/g) ?? []
export const extractTests = (source: string) =>
  (source.match(new RegExp(/(?<=;; @test).*?(?=\n)/gm)) ?? [])
    .map((x) => x.trim())
    .filter(Boolean)
export const extractMocks = (source: string) =>
  (source.match(new RegExp(/(?<=;; @mock).*?(?=\n)/gm)) ?? [])
    .filter(Boolean)
    .map((x) => x.trim())
export const extractChecks = (source: string) =>
  (source.match(new RegExp(/(?<=;; @check).*?(?=\n)/gm)) ?? [])
    .filter(Boolean)
    .map((x) => x.trim())
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
