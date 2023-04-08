import { CodeMirror } from './hlp.editor.bundle.js'
import {
  runFromInterpreted,
  extractChecks,
  extractMocks,
  extractTests,
  handleHangingSemi,
  removeNoCode,
} from '../dist/misc/utils.js'
import { encodeBase64 } from '../dist/misc/compression.js'

const consoleElement = document.getElementById('console')
const editorContainer = document.getElementById('editor-container')
const droneButton = document.getElementById('drone')
const errorIcon = document.getElementById('error-drone-icon')
const execIcon = document.getElementById('exec-drone-icon')
const consoleEditor = CodeMirror(consoleElement)
let RATIO_Y = 1
const droneIntel = (icon) => {
  icon.style.visibility = 'visible'
  setTimeout(() => (icon.style.visibility = 'hidden'), 500)
}
const extensions = {
  log: (disable = 0) => {
    if (disable) return () => {}
    return (msg) => {
      const current = consoleEditor.getValue()
      consoleEditor.setValue(
        `${current ? `${current}; ` : ''}${
          msg !== undefined
            ? typeof msg === 'string'
              ? `"${msg}"`
              : typeof msg === 'function'
              ? '-> []'
              : (msg.constructor.name === 'Set'
                  ? JSON.stringify([...msg]).replaceAll('[', ':. [')
                  : JSON.stringify(
                      msg.constructor.name === 'Inventory'
                        ? msg.items
                        : msg.constructor.name === 'Map'
                        ? Object.fromEntries(msg)
                        : msg,
                      null
                    )
                      .replaceAll('[', '.: [')
                      .replaceAll('{', ':: [')
                )

                  .replaceAll('}', ']')
                  .replaceAll(',', '; ')
                  .replaceAll('":', '"; ')
                  .replaceAll('null', 'void')
                  .replaceAll('undefined', 'void')
            : 'void'
        }`
      )
      // popup.setCursor(
      //   popup.posToOffset({ ch: 0, line: popup.lineCount() - 1 }),
      //   true
      // )
      return msg
    }
  },
}
const execute = async (source) => {
  try {
    consoleElement.classList.remove('error_line')
    const result = runFromInterpreted(source, extensions)
    droneButton.classList.remove('shake')
    droneIntel(execIcon)
    return result
  } catch (err) {
    consoleElement.classList.add('error_line')
    consoleEditor.setValue(err + ' ')
    droneButton.classList.remove('shake')
    droneButton.classList.add('shake')
    droneIntel(errorIcon)
  }
}

const editor = CodeMirror(editorContainer, {})
droneButton.addEventListener('click', () => {
  return document.dispatchEvent(
    new KeyboardEvent('keydown', {
      ctrlKey: true,
      key: 's',
    })
  )
})

const cmds = {
  validate: ';; validate',
  assert: ';; assert',
  open: ';; open',
  share: ';; share',
  window: ';; window',
  log: ';; log',
  exe: ';; exe',
  app: ';; app',
  focus: ';; focus',
}

const withCommand = (command = editor.getLine(0)) => {
  const value = editor.getValue()
  switch (command.trim()) {
    case cmds.validate:
      {
        let result = value
        extractChecks(file).forEach((x) => {
          const def = handleHangingSemi(x)
          result = result
            .replaceAll(x, `!throw[${def}; "${def}"];`)
            .replaceAll(';; @check', '')
        })
        try {
          runFromInterpreted(result)
          consoleEditor.setValue(
            `${consoleEditor.getValue()} All checks passed!`
          )
        } catch (err) {
          consoleEditor.setValue(err.message.trim())
        }
      }
      break
    case cmds.assert:
      {
        const mocks = extractMocks(value)
          .map((x) => handleHangingSemi(x) + ';')
          .join('\n')

        const res = extractTests(value).map((x) =>
          runFromInterpreted(
            `${handleHangingSemi(removeNoCode(value))};${mocks}${x}`
          )
        )
        if (res.every((x) => !!x))
          consoleEditor.setValue(
            `${consoleEditor.getValue()} All tests passed!`
          )
        else
          consoleEditor.setValue(
            `Tests: ${res.map((x) => (x ? '+' : '-')).join(' ')}`
          )
      }
      break
    case cmds.open:
      {
        const encoded = encodeURIComponent(encodeBase64(value))
        window.open(
          `https://at-290690.github.io/hlp/?l=` + encoded,
          'Bit',
          `menubar=no,directories=no,toolbar=no,status=no,scrollbars=no,resize=no,width=600,height=600,left=600,top=150`
        )
      }
      break
    case cmds.share:
      {
        const link = `https://at-290690.github.io/hlp/?l=${encodeURIComponent(
          encodeBase64(value)
        )}`
        consoleEditor.setValue(link)
        consoleEditor.focus()
        consoleEditor.setSelection(0, link.length)
      }

      break
    case cmds.window:
      {
        const encoded = encodeURIComponent(encodeBase64(value))
        window.open(
          `${
            window.location.href.split('/editor/')[0]
          }/index.html?l=${encoded}`,
          'Bit',
          `menubar=no,directories=no,toolbar=no,status=no,scrollbars=no,resize=no,width=600,height=600,left=600,top=150`
        )
      }
      break
    case cmds.focus:
      {
        const application = document.getElementById('application')
        application.style.display = 'none'
        application.src = `${
          window.location.href.split('/editor/')[0]
        }/index.html`
        const bouds = document.body.getBoundingClientRect()
        const width = bouds.width
        const height = bouds.height
        RATIO_Y = 1
        editor.setSize(width, (height - 60) * RATIO_Y)
      }
      break
    case cmds.app:
      {
        const encoded = encodeURIComponent(encodeBase64(value))
        const application = document.getElementById('application')
        application.src = `${
          window.location.href.split('/editor/')[0]
        }/index.html?l=${encoded}`
        application.style.display = 'block'
        const bouds = document.body.getBoundingClientRect()
        const width = bouds.width
        const height = bouds.height
        RATIO_Y = 0.35
        editor.setSize(width, (height - 60) * RATIO_Y)
      }
      break
    case cmds.log:
      {
        const selection = editor.getSelection().trim()
        if (selection) {
          const isEndingWithSemi = selection[selection.length - 1] === ';'
          const out = `__debug_log[${
            isEndingWithSemi
              ? selection.substring(0, selection.length - 1)
              : selection
          }; ""]${isEndingWithSemi ? ';' : ''}`
          editor.replaceSelection(out)

          execute(`:=[__debug_log; log[]]; ${editor.getValue().trim()}`)
          editor.setValue(value)
        } else execute(`:=[__debug_log; log[]]; __debug_log[:[${value}]]`)
      }
      break
    case cmds.exe:
    default:
      execute(value)
      break
  }
}
const knownCmds = (cmd) => cmd.trim() in cmds
document.addEventListener('keydown', (e) => {
  if (e.key && e.key.toLowerCase() === 's' && (e.ctrlKey || e.metaKey)) {
    e = e || window.event
    e.preventDefault()
    e.stopPropagation()
    consoleEditor.setValue('')
    const cmds = editor.getLine(0).split(';; ').filter(knownCmds)
    if (!cmds.length) cmds.push(';; exe')
    cmds.map((x) => `;; ${x.trim()}`).forEach((cmd) => withCommand(cmd))
  } else if (e.key === 'Escape') {
    e.preventDefault()
    e.stopPropagation()
  }
})
editor.focus()
window.addEventListener('resize', () => {
  const bouds = document.body.getBoundingClientRect()
  const width = bouds.width
  const height = bouds.height
  editor.setSize(width, (height - 60) * RATIO_Y)
  consoleEditor.setSize(width - 80, 40)
})
const bounds = document.body.getBoundingClientRect()
editor.setSize(bounds.width, (bounds.height - 60) * RATIO_Y)
consoleEditor.setSize(bounds.width - 80, 40)

const registerSW = async () => {
  if ('serviceWorker' in navigator)
    try {
      await navigator.serviceWorker.register('../sw.js')
    } catch (e) {
      console.log(`SW registration failed`)
    }
}

window.addEventListener('load', registerSW)
