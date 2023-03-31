export const NoCodeRegExp = /[ ]+(?=[^"]*(?:"[^"]*"[^"]*)*$)+|\n|\t|;;.+/g;
export const extractComments = (source) => source.match(/;;.+/g) ?? [];
export const extractTests = (source) => (source.match(new RegExp(/(?<=;; @test).*?(?=\n)/gm)) ?? [])
    .map((x) => x.trim())
    .filter(Boolean);
export const extractMocks = (source) => (source.match(new RegExp(/(?<=;; @mock).*?(?=\n)/gm)) ?? [])
    .filter(Boolean)
    .map((x) => x.trim());
export const extractChecks = (source) => (source.match(new RegExp(/(?<=;; @check).*?(?=\n)/gm)) ?? [])
    .filter(Boolean)
    .map((x) => x.trim());
export const handleHangingSemi = (source) => source[source.length - 1] === ';'
    ? source.substring(0, source.length - 1)
    : source;
export const removeNoCode = (source) => source.replace(NoCodeRegExp, '');
export const wrapInBody = (source) => `:[${source}]`;
export const protolessModule = (methods) => {
    const env = Object.create(null);
    for (const method in methods)
        env[method] = methods[method];
    return env;
};
