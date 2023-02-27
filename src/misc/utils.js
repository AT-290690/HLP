import { compileToJs } from '../core/compiler.js'
import { parse } from '../core/parser.js'
import { runFromAST } from '../core/interpreter.js'
import { tokens } from '../core/tokens.js'
import { STD, protolessModule } from '../extensions/extentions.js'
import { removeNoCode, wrapInBody } from './helpers.js'
import Brrr from '../extensions/Brrr.js'
export const languageUtilsString = `
const _sameValueZero=(t,e)=>t===e||Number.isNaN(t)&&Number.isNaN(e),_clamp=(t,e,r)=>Math.min(Math.max(t,e),r),_isIterable=t=>null!=t&&"function"==typeof t[Symbol.iterator],_tailCallOptimisedRecursion=t=>(...e)=>{let r=t(...e);for(;"function"==typeof r;)r=r();return r},_flatten=(t,e,r)=>t.reduce((t,i)=>(Brrr.isBrrr(i)?t.push(...r(i,e)):t.push(i),t),[]),_toMatrix=(...t)=>{if(0===t.length)return;let e=new Brrr().with(...t),r=e.chop(),i=new Brrr;for(let s=0;s<r;++s)i.set(s,_toMatrix(...e));return i},_toArrayDeep=t=>Brrr.isBrrr(t)?t.map(t=>Brrr.isBrrr(t)?t.some(Brrr.isBrrr)?_toArrayDeep(t):t.toArray():t).toArray():t,_toObjectDeep=t=>Brrr.isBrrr(t)?t.map(t=>Brrr.isBrrr(t)?t.some(Brrr.isBrrr)?_toObjectDeep(t):t.toObject():t).toObject():t,_toShapeDeep=(t,e=[])=>(Brrr.isBrrr(t.get(0))?t.forEach(t=>{e.push(_toShapeDeep(t))}):e=[t.length],e),_quickSortAsc=(t,e,r)=>{if(t.length>1){let i=t.get((r+e)/2|.5),s=e,o=r;for(;s<=o;){for(;t.get(s)<i;)++s;for(;t.get(o)>i;)o--;s<=o&&(t.swap(s,o),++s,o--)}e<s-1&&_quickSortAsc(t,e,s-1),s<r&&_quickSortAsc(t,s,r)}return t},_quickSortDesc=(t,e,r)=>{if(t.length>1){let i=t.get((r+e)/2|.5),s=e,o=r;for(;s<=o;){for(;t.get(s)>i;)++s;for(;t.get(o)<i;)o--;s<=o&&(t.swap(s,o),++s,o--)}e<s-1&&_quickSortDesc(t,e,s-1),s<r&&_quickSortDesc(t,s,r)}return t},_merge=(t,e,r)=>{let i=[];for(;t.length&&e.length;)r(e.at(0),t.at(0))>0?i.push(t.chop()):i.push(e.chop());for(let s=0;s<t.length;++s)i.push(t.get(s));for(let o=0;o<e.length;++o)i.push(e.get(o));let n=new Brrr,u=i.length/2|.5;for(let f=u-1;f>=0;--f)n.prepend(i[f]);for(let h=u;h<i.length;++h)n.append(i[h]);return n},_mergeSort=(t,e)=>{let r=t.length/2|.5;if(t.length<2)return t;let i=t.splice(0,r);return _merge(_mergeSort(i,e),_mergeSort(t,e),e)},_binarySearch=_tailCallOptimisedRecursion((t,e,r,i,s,o)=>{if(s>o)return;let n=(s+o)/2|.5,u=t.get(n);if(void 0===u)return;let f=r(u);return f===e?u:i(u)?_binarySearch(t,e,r,i,s,n-1):_binarySearch(t,e,r,i,n+1,o)}),_Identity=t=>t;class _Group{constructor(){this.items={}}get(t){return this.items[t]}set(t,e){return this.items[t]=e,this}get values(){return Object.values(this.items)}get keys(){return Object.keys(this.items)}has(t){return t in this.items}forEntries(t){for(let e in this.items)t([e,this.items[e]],this.items);return this}forEach(t){for(let e in this.items)t(this.items[e],e);return this}map(t){for(let e in this.items)this.items[e]=t(this.items[e],e,this.items);return this}}const _isEqual=(t,e)=>{if(t===e)return!0;if(t&&e&&"object"==typeof t&&"object"==typeof e){if(t.constructor!==e.constructor)return!1;let r,i,s;if(Brrr.isBrrr(t)&&Brrr.isBrrr(e)){if((r=t.length)!=e.length)return!1;for(i=r;0!=i--;)if(!_isEqual(t.get(i),e.get(i)))return!1;return!0}if(Array.isArray(t)){if((r=t.length)!=e.length)return!1;for(i=r;0!=i--;)if(!_isEqual(t[i],e[i]))return!1;return!0}if(t instanceof Map&&e instanceof Map){if(t.size!==e.size)return!1;for(i of t.entries())if(!e.has(i[0]))return!1;for(i of t.entries())if(!_isEqual(i[1],e.get(i[0])))return!1;return!0}if(t instanceof Set&&e instanceof Set){if(t.size!==e.size)return!1;for(i of t.entries())if(!e.has(i[0]))return!1;return!0}if(ArrayBuffer.isView(t)&&ArrayBuffer.isView(e)){if((r=t.length)!=e.length)return!1;for(i=r;0!=i--;)if(t[i]!==e[i])return!1;return!0}if(t.constructor===RegExp)return t.source===e.source&&t.flags===e.flags;if(t.valueOf!==Object.prototype.valueOf)return t.valueOf()===e.valueOf();if(t.toString!==Object.prototype.toString)return t.toString()===e.toString();if((r=(s=Object.keys(t)).length)!==Object.keys(e).length)return!1;for(i=r;0!=i--;)if(!Object.prototype.hasOwnProperty.call(e,s[i]))return!1;for(i=r;0!=i--;){let o=s[i];if(!_isEqual(t[o],e[o]))return!1}return!0}return t!=t&&e!=e};class _Shadow{isShortCircuited(){return!0}}for(const method of Brrr.from([...Object.getOwnPropertyNames(Brrr),...Object.getOwnPropertyNames(Brrr.prototype),]).without("prototype","isShortCircuited","constructor").items)_Shadow.prototype[method]=()=>_shadow;const _shadow=Object.freeze(new _Shadow);
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
