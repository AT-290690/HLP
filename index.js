import { readFile } from 'fs/promises'
import {
  compilePlainJs,
  runFromCompiled,
  runFromInterpreted,
} from './src/misc/utils.js'
import { encodeBase64, compress, decodeBase64 } from './src/misc/compression.js'
const logBoldMessage = (msg) => console.log('\x1b[1m', msg, '\x1b[0m')
const logErrorMessage = (msg) =>
  console.log('\x1b[31m', '\x1b[1m', msg, '\x1b[0m')
const logSuccessMessage = (msg) =>
  console.log('\x1b[32m', '\x1b[1m', msg, '\x1b[0m')
const logWarningMessage = (msg) =>
  console.log('\x1b[33m', '\x1b[1m', msg, '\x1b[0m')
const logResultInterpreted = (file, type = 'raw') =>
  readFile(`./examples/${file}`, 'utf-8')
    .then((result) =>
      logBoldMessage(
        type == 'items'
          ? runFromInterpreted(result).items
          : runFromInterpreted(result)
      )
    )
    .catch((error) => logErrorMessage(error.message))
const logResultCompiled = (file, type = 'raw') =>
  readFile(`./examples/${file}`, 'utf-8')
    .then((result) =>
      logBoldMessage(
        type == 'items'
          ? runFromCompiled(result).items
          : runFromCompiled(result)
      )
    )
    .catch((error) => logErrorMessage(error.message))

const encode = async (
  file,
  destination = 'https://at-290690.github.io/hlp'
) => {
  const encoded = encodeURIComponent(
    encodeBase64(await readFile(`./examples/${file}`, 'utf-8'))
  )
  const link = `${destination}?l=`
  logSuccessMessage(link + encoded)
}
const count = async (file) => {
  const encoded = encodeURIComponent(
    encodeBase64(await readFile(`./examples/${file}`, 'utf-8'))
  )
  logWarningMessage(`compressed size: ${encoded.length}`)
}
const encodeUri = async (file) => {
  const encoded = encodeURIComponent(
    encodeBase64(await readFile(`./examples/${file}`, 'utf-8'))
  )
  logWarningMessage(encoded)
}
const decodeUri = async (file) => {
  const dencoded = decodeBase64(
    decodeURIComponent(await readFile(`./examples/${file}`, 'utf-8'))
  )
  logWarningMessage(dencoded)
}
const compile = async (file) => {
  try {
    logWarningMessage(
      compilePlainJs(await readFile(`./examples/${file}`, 'utf-8'))
    )
  } catch (error) {
    logErrorMessage(error.message)
  }
}
const mangle = async (file) => {
  const compressed = compress(await readFile(`./examples/${file}`, 'utf-8'))
  logSuccessMessage(compressed)
}
const countMangled = async (file) => {
  const compressed = compress(await readFile(`./examples/${file}`, 'utf-8'))
  logWarningMessage(`mangled size: ${compressed.length}`)
}
const [, , filename, flag, arg] = process.argv
switch (flag) {
  case 'link':
  case 'L':
    encode(filename)
    break
  case 'uri':
    encodeUri(filename)
    break
  case 'deuri':
    decodeUri(filename)
    break
  case 'local':
    encode(filename, arg)
    break
  case 'mangle':
  case 'M':
    mangle(filename)
    break
  case 'JS':
    compile(filename)
    break
  case 'C':
  case 'count':
    count(filename)
    break
  case 'CM':
    countMangled(filename)
    break
  case 'COMPILE':
  case 'CR':
    logResultCompiled(filename, arg)
    break
  case 'run':
  case 'R':
  default:
    logResultInterpreted(filename, arg)
}
