import { compileToJs } from '../core/compiler.js'
import { parse } from '../core/parser.js'
import { runFromAST } from '../core/interpreter.js'
import { tokens } from '../core/tokens.js'
import { STD, protolessModule } from '../extensions/extentions.js'
import { removeNoCode, wrapInBody } from './helpers.js'
import Brrr from '../extensions/Brrr.js'
export const languageUtilsString = `
const _tco=e=>(...t)=>{let r=e(...t);for(;"function"==typeof r;)r=r();return r},_spreadArr=e=>{if(!Brrr.isBrrr(e[0]))return e.reduce((e,t)=>({...e,...t}),{});{let[t,...r]=e;return t.merge(...r)}},_cast=e=>"string"==typeof e||void 0==e?Number(e):e.toString(),_difference=(e,t)=>e.difference(t),_intersection=(e,t)=>e.intersection(t),_xor=(e,t)=>e.xor(t),_union=(e,t)=>e.union(t),_fill=e=>Brrr.from(Array.from({length:e}).fill(null).map((e,t)=>t)),_findIndexLeft=(e,t)=>e.findIndex(t),_findIndexRight=(e,t)=>e.findLastIndex(t),_throw=(e,t)=>{if(!e)throw Error(t+" failed!")},_checkType=(e,t)=>e.constructor.name===t.constructor.name,_mapEntries=e=>Brrr.from([...e.entries()].map(Brrr.from)),_mapKeys=e=>Brrr.from([...e.keys()]),_mapValues=e=>Brrr.from([...e.values()]),_mapGet=(e,t)=>e.get(t),_mapSize=e=>e.size,_mapRemove=(e,t)=>(e.delete(t),e),_mapSet=(e,t,r)=>(e.set(t,r),e),_mapHas=(e,t)=>e.has(t),_scanLeft=(e,t)=>{for(let r=0;r<e.length;++r)t(e.get(r),r,e);return e},_scanRight=(e,t)=>{for(let r=e.length-1;r>=0;--r)t(e.get(r),r,e);return e},_mapLeft=(e,t,r=new Brrr)=>{for(let n=0;n<e.length;++n)r.set(n,t(e.at(n),n,e));return r.balance()},_mapRight=(e,t,r=new Brrr)=>{for(let n=e.length-1;n>=0;--n)r.set(n,t(e.at(n),n,e));return r.balance()},_filter=(e,t)=>e.filter(t),_reduceLeft=(e,t,r=[])=>e.reduce(t,r),_reduceRight=(e,t,r=[])=>e.reduceRight(t,r),_findLeft=(e,t)=>e.find(t),_findRight=(e,t)=>e.findLast(t),_repeat=(e,t)=>{let r;for(let n=0;n<e;++n)r=t(n);return r},_every=(e,t)=>e.every(t),_some=(e,t)=>e.some(t),_append=(e,t)=>e.append(t),_prepend=(e,t)=>e.prepend(t),_head=e=>e.head(),_tail=e=>e.tail(),_cut=e=>e.cut(),_chop=e=>e.chop(),_slice=(e,t,r)=>e.slice(t,r),_length=e=>e.length,_split=(e,t)=>Brrr.from(e.split(t)),_join=(e,t)=>e.join(t),_arrAt=(e,t)=>e.at(t),_arrGet=(e,t)=>e.get(t),_arrSet=(e,t,r)=>e.set(t,r),_arrInBounds=(e,t)=>e.isInBounds(Math.abs(t)),_partition=(e,t)=>e.partition(t),_mSort=(e,t)=>e.mergeSort(t),_qSort=(e,t)=>e.quickSort(t),_grp=(e,t)=>e.group(t),_rot=(e,t,r)=>e.rotate(t,r),_flatMap=(e,t)=>e.flatten(t),_call=(e,t)=>t(e),_flat=(e,t)=>e.flat(t),call=(e,t)=>t(e),printout=(...e)=>console.log(...e),protolessModule=e=>{let t=Object.create(null);for(let r in e)t[r]=e[r];return t},_addAt=(e,t,r)=>e.addAt(t,...r),_removeFrom=(e,t,r)=>e.removeFrom(t,r);
`
export const logBoldMessage = (msg) => console.log('\x1b[1m', msg)
export const logErrorMessage = (msg) =>
  console.log('\x1b[31m', '\x1b[1m', msg, '\x1b[0m')
export const logSuccessMessage = (msg) =>
  console.log('\x1b[32m', '\x1b[1m', msg, '\x1b[0m')
export const logWarningMessage = (msg) =>
  console.log('\x1b[33m', '\x1b[1m', msg, '\x1b[0m')

const findParent = (ast) => {
  let out = { fn: null, res: null }
  for (const prop in ast)
    if (Array.isArray(ast[prop]))
      for (const arg of ast[prop]) {
        if (arg.type === 'apply') out.fn = arg.operator.name
        const temp = findParent(arg)
        if (temp.res !== undefined) out.res = temp.res
      }
    else if (ast[prop] !== undefined) out.res = ast[prop]
  return out
}

export const runFromInterpreted = (source, extensions) =>
  exe(
    handleUnbalancedParens(removeNoCode(source.toString().trim())),
    STD,
    extensions
  )
export const runFromCompiled = (source) => eval(compileModule(source))

export const exe = (source, std = {}, extensions = {}) => {
  for (const ext in extensions) std[ext] = extensions[ext]
  const ENV = protolessModule(std)
  ENV[';;runes'] = protolessModule(tokens)
  const AST = parse(wrapInBody(source))
  return runFromAST(AST, ENV).result
}
export const isBalancedParenthesis = (sourceCode) => {
  let count = 0
  const stack = []
  const str = sourceCode.replace(/"(.*?)"/g, '')
  const pairs = { ']': '[' }
  for (let i = 0; i < str.length; ++i)
    if (str[i] === '[') stack.push(str[i])
    else if (str[i] in pairs) if (stack.pop() !== pairs[str[i]]) ++count
  return { str, diff: count - stack.length }
}
export const handleUnbalancedParens = (sourceCode) => {
  const parenMatcher = isBalancedParenthesis(sourceCode)
  if (parenMatcher.diff !== 0)
    throw new SyntaxError(
      `Parenthesis are unbalanced by ${parenMatcher.diff > 0 ? '+' : ''}${
        parenMatcher.diff
      } "]"`
    )
  return sourceCode
}

export const treeShake = (modules) => {
  let lib = ''
  const dfs = (modules, lib, LIBRARY) => {
    for (const key in modules) {
      if (key !== 'LIBRARY' && modules[key] !== undefined) {
        lib += '["' + key + '"]:{'
        for (const method of modules[key]) {
          if (LIBRARY[key]) {
            const current = LIBRARY[key][method]
            if (current) {
              if (typeof current === 'object') {
                lib += dfs({ [method]: modules[method] }, '', LIBRARY[key])
              } else {
                lib += '["' + method + '"]:'
                lib += current.toString()
                lib += ','
              }
            }
          }
        }
        lib += '},'
      }
    }
    return lib
  }
  lib += 'const LIBRARY = {' + dfs(modules, lib, STD.LIBRARY) + '}'
  return lib
}
export const compilePlain = (source) => {
  const inlined = wrapInBody(removeNoCode(source))
  const { top, program, modules } = compileToJs(parse(inlined))
  const lib = treeShake(modules)
  return `${lib};
${top}
${program}`
}
export const compileModule = (source) => {
  const inlined = wrapInBody(removeNoCode(source))
  const { top, program, modules } = compileToJs(parse(inlined))
  const lib = treeShake(modules)
  return `const VOID = 0;
${Brrr.toString()}
${languageUtilsString}
${lib};
${top}${program}`
}
export const compilePlainJs = (source) => {
  const inlined = wrapInBody(removeNoCode(source))
  const { top, program } = compileToJs(parse(inlined))
  return `const VOID = 0;
${top}${program}`
}

export const compileHtml = (
  source,
  scripts = `<script
src="./src/misc/two.min.js"
></script>`
) => {
  const inlined = wrapInBody(removeNoCode(source))
  const { top, program, modules } = compileToJs(parse(inlined))
  const lib = treeShake(modules)
  return `
<style>body { background: #0e0e0e } </style><body>
${scripts}
<script>
${Brrr.toString()}
const VOID = 0;
${languageUtilsString}
</script>
<script>${lib}</script>
<script> (() => { ${top}${program} })()</script>
</body>`
}
export const compileHtmlModule = (
  source,
  scripts = `<script
  src="./src/misc/two.min.js"
  ></script>`
) => {
  const inlined = wrapInBody(removeNoCode(source))
  const { top, program, modules } = compileToJs(parse(inlined))
  const lib = treeShake(modules)
  return `
<style>body { background: #0e0e0e } </style><body>
${scripts}
<script type="module">
  import Brrr from '../../chip/language/extensions/Brrr.js'; 
  const VOID = 0;
  ${languageUtilsString};
  ${lib};
  (() => { ${top}${program} })()
 </script>
</body>`
}

export const compileExecutable = (source, ctx) => {
  const inlined = wrapInBody(removeNoCode(source))
  const ENV = protolessModule(ctx)
  ENV[';;runes'] = protolessModule(tokens)
  delete ENV[';;runes']['<-']
  const AST = parse(inlined)
  // const { AST } = cell(ENV, false)(inlined)
  const { top, program, modules } = compileToJs(AST, ctx)
  const lib = treeShake(modules)
  return `const VOID = 0;
  ${Brrr.toString()}
  ${languageUtilsString}
  ${lib};
  ${top}${program}`
}
