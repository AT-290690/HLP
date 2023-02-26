import { decodeBase64 } from './src/misc/compression.js'
import { compileToJs } from './src/core/compiler.js'
import {
  treeShake,
  languageUtilsString,
  runFromInterpreted,
} from './src/misc/utils.js'
import { wrapInBody, removeNoCode } from './src/misc/helpers.js'
import { parse } from './src/core/parser.js'
import Brrr from './src/extensions/Brrr.js'

const buildScript = (encoding) => {
  const inlined = wrapInBody(
    removeNoCode(decodeBase64(decodeURIComponent(encoding)))
  )
  const { top, program, modules } = compileToJs(parse(inlined))
  const lib = treeShake(modules)
  return `
${lib}
;(() => {
  ${top}
  ;document.getElementById("output").textContent = (
  ${program}
  )})()`
}

const encoding = new URLSearchParams(location.search).get('l')
window.runFromInterpreted = runFromInterpreted
window.decodeBase64 = decodeBase64
window.Brrr = Brrr
const std = document.createElement('script')
std.innerHTML = `const VOID = 0; const LOGGER = () => () => {}; ${languageUtilsString}`
document.body.appendChild(std)
const script = document.createElement('script')
if (encoding) script.innerHTML += buildScript(encoding)
document.body.appendChild(script)
