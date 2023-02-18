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
const encoding = new URLSearchParams(location.search).get('s')
window.runFromInterpreted = runFromInterpreted
window.decodeBase64 = decodeBase64
window.Brrr = Brrr
if (encoding) {
  const inlined = wrapInBody(
    removeNoCode(decodeBase64(decodeURIComponent(encoding)))
  )
  const { top, program, modules } = compileToJs(parse(inlined))
  const lib = treeShake(modules)
  const s = `
const VOID = null;
const LOGGER = () => () => {}
${languageUtilsString}
${lib}
;(() => { 
  ${top}
  ;document.getElementById("output").textContent = (
  ${program}
  )})()`
  const script = document.createElement('script')

  script.innerHTML = s
  document.body.appendChild(script)
}
