import { cli } from 'jsdoc-spec'
export const formatErrors = (results) => {
  return results
    .filter(Boolean)
    .filter((test) => test.length)
    .flat(1)
    .join(', ')
}
const files = ['./dist/misc/utils.js', './dist/core/parser.js']
;(async () => {
  const raw = await Promise.all(
    files.map((f) => cli({ argv: ['-file', f, '-logging', 'none'] }))
  )
  const results = formatErrors(raw)
  if (results)
    console.log(
      '\x1b[31m',
      '\x1b[1m',
      '\n  The following comment tests have failed:',
      '\x1b[33m',
      results,
      '\n\x1b[0m'
    )
  else console.log('\x1b[32m', '\n  All doctests passed!\n', '\x1b[0m')
})()
