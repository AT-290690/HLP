import {
  compilePlainJs,
  exe,
  runFromCompiled,
  runFromInterpreted,
} from './src/misc/utils.js'
import { encodeBase64, compress, decodeBase64 } from './src/misc/compression.js'
import {
  extractComments,
  handleHangingSemi,
  removeNoCode,
} from './src/misc/helpers.js'
import { readdirSync, readFileSync, writeFileSync } from 'fs'
const logBoldMessage = (msg) => console.log('\x1b[1m', msg, '\x1b[0m')
const logErrorMessage = (msg) =>
  console.log('\x1b[31m', '\x1b[1m', msg, '\x1b[0m')
const logSuccessMessage = (msg) =>
  console.log('\x1b[32m', '\x1b[1m', msg, '\x1b[0m')
const logWarningMessage = (msg) =>
  console.log('\x1b[33m', '\x1b[1m', msg, '\x1b[0m')
const logResultInterpreted = (file, type = 'raw') =>
  logBoldMessage(
    type == 'items' ? runFromInterpreted(file).items : runFromInterpreted(file)
  )
const test = (file) => {
  const mocks = extractComments(file)
    .map((x) => x.split(';; @mock')[1]?.trim())
    .filter(Boolean)
    .map((x) => handleHangingSemi(x) + ';')
    .join('\n')
  extractComments(file)
    .map((x) => x.split(';; @test')[1]?.trim())
    .filter(Boolean)
    .forEach((x) => {
      const t = runFromInterpreted(
        `${handleHangingSemi(removeNoCode(file))};${mocks}${x}`
      )
      t ? logSuccessMessage(`${t} ${x}`) : logErrorMessage(`${t} ${x}`)
    })
}

const check = (file) => {
  extractComments(file)
    .filter((x) => x.split(`;; @check`)[1]?.trim())
    .filter(Boolean)
    .forEach((x) => {
      const def = handleHangingSemi(x.split(';; @check')[1])
      file = file.replaceAll(x, `!throw[${def}; "${def}"];`)
    })
  try {
    runFromInterpreted(file)
    logSuccessMessage('All checks passed!')
  } catch (err) {
    logErrorMessage(err.message)
  }
}

const logResultCompiled = (file, type = 'raw') =>
  logBoldMessage(
    type == 'items' ? runFromCompiled(file).items : runFromCompiled(file)
  )

const encode = async (
  file,
  destination = 'https://at-290690.github.io/hlp'
) => {
  const encoded = encodeURIComponent(encodeBase64(file))
  const link = `${destination}?l=`
  logSuccessMessage(link + encoded)
}
const count = async (file) => {
  const encoded = encodeURIComponent(encodeBase64(file))
  logWarningMessage(`compressed size: ${encoded.length}`)
}
const encodeUri = async (file) => {
  const encoded = encodeURIComponent(encodeBase64(file))
  logWarningMessage(encoded)
}
const decodeUri = async (file) => {
  const dencoded = decodeBase64(decodeURIComponent(file))
  logWarningMessage(dencoded)
}
const compile = async (file) => {
  try {
    logWarningMessage(compilePlainJs(file))
  } catch (error) {
    logErrorMessage(error.message)
  }
}
const mangle = async (file) => {
  const compressed = compress(file)
  logSuccessMessage(compressed)
}
const countMangled = async (file) => {
  const compressed = compress(file)
  logWarningMessage(`mangled size: ${compressed.length}`)
}
const buildProject = (dir, arg) => {
  let cat = []
  readdirSync(dir).forEach((file) =>
    file.split('.').pop() === 'l'
      ? cat.push(handleHangingSemi(file.trim()))
      : undefined
  )
  writeFileSync(arg, cat.join(`;\n\n`))
}
const withBundle = (file) => {
  const imports = extractComments(file)
    .map((x) => x.split(';; @import')[1]?.trim())
    .filter(Boolean)

  if (imports) {
    const files = imports.map((f) => readFileSync(f.trim(), 'utf-8'))
    files.push(handleHangingSemi(file.trim()) + ';')
    return files
      .map((f) => handleHangingSemi(f.trim()) + ';')
      .join('\n\n')
      .trim()
  } else {
    return file
  }
}

const [, , filename, flag, arg] = process.argv
const file = withBundle(readFileSync(filename, 'utf-8'))
switch (flag?.toLowerCase()) {
  case 'build':
    buildProject(filename, arg)
    break
  case 'link':
  case 'l':
    encode(file)
    break
  case 'encode':
    encodeUri(file)
    break
  case 'decode':
    decodeUri(file)
    break
  case 'local':
    encode(file, arg)
    break
  case 'mangle':
  case 'm':
    mangle(file)
    break
  case 'js':
    compile(file)
    break
  case 'c':
  case 'count':
    count(file)
    break
  case 'cm':
    countMangled(file)
    break
  case 'compile':
  case 'cr':
    logResultCompiled(file, arg)
    break
  case 't':
  case 'test':
    test(file)
    break
  case 'run':
  case 'r':
  case 'log':
    logResultInterpreted(file, arg)
    break
  case 'check':
  case 'y':
    check(file)
    break
  case 'basic':
    {
      exe(removeNoCode(file.toString().trim()), {
        utils: { log: (msg) => console.log(msg), items: (a) => a.items },
      })
    }
    break
  case 'help':
  default:
    console.log(`
------------------------------------
| help                              |
------------------------------------
| encode  |   encode base64         |
------------------------------------
| decode  |   decode base64         |
------------------------------------
| mangle  |   compress only         |
------------------------------------
| js      |   log javascript output |
------------------------------------
| compile |   compile and run       |
------------------------------------
| count   |   bite size             |
------------------------------------
| run     |   interpret and run     |
------------------------------------
| link    |   create link           |
------------------------------------
| local   |   create local link     |
------------------------------------
| basic   |   run no extensions     |
------------------------------------
      `)
}
if (!filename)
  logErrorMessage(`Provide a <filename> argument\n\tyarn hlp myfile.l run`)
