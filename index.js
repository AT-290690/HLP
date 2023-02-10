import { readFile } from 'fs/promises'
import { runFromInterpreted } from './src/misc/utils.js'
import { encodeBase64 } from './src/misc/compression.js'
const logBoldMessage = (msg) => console.log('\x1b[1m', msg, '\x1b[0m')
const logErrorMessage = (msg) =>
  console.log('\x1b[31m', '\x1b[1m', msg, '\x1b[0m')
const logSuccessMessage = (msg) =>
  console.log('\x1b[32m', '\x1b[1m', msg, '\x1b[0m')
const logWarningMessage = (msg) =>
  console.log('\x1b[33m', '\x1b[1m', msg, '\x1b[0m')
const logResult = (file) =>
  readFile(`./examples/${file}`, 'utf-8')
    .then((result) =>
      logBoldMessage(runFromInterpreted(result?.items ?? result))
    )
    .catch((error) => logErrorMessage(error.message))

const encode = async (file) => {
  const encoded = encodeURIComponent(
    encodeBase64(await readFile(`./examples/${file}`, 'utf-8'))
  )
  const link = `https://at-290690.github.io/HLP?s=`
  logSuccessMessage(link + encoded)
}
const [, , filename, flag] = process.argv
switch (flag) {
  case 'link':
    encode(filename)
  default:
    logResult(filename)
}
