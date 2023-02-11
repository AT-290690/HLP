import { CodeMirror } from './hlp.editor.bundle.js'
import { run as chipRun } from '../src/misc/utils.js'
import { encodeBase64 } from '../src/misc/compression.js'

const consoleElement = document.getElementById('console')
const editorContainer = document.getElementById('editor-container')
const droneButton = document.getElementById('drone')
const errorIcon = document.getElementById('error-drone-icon')
const execIcon = document.getElementById('exec-drone-icon')
const popupContainer = document.getElementById('popup-container')
const autoComplete = document.getElementById('autocomplete-container')
const consoleEditor = CodeMirror(popupContainer)

const CONSOLE_HEIGHT_FACTOR = 5
const extensions = {
  LOGGER: (disable = 0) => {
    if (disable) return () => {}
    popupContainer.style.display = 'block'
    const popup = consoleEditor
    popup.setValue('')
    const bouds = document.body.getBoundingClientRect()
    const width = bouds.width
    const height = bouds.height
    popup.setSize(width - 2, height / CONSOLE_HEIGHT_FACTOR)
    return (msg) => {
      const current = popup.getValue()
      popup.setValue(
        `${current ? current : ''}
${
  msg !== undefined
    ? typeof msg === 'string'
      ? `"${msg}"`
      : typeof msg === 'function'
      ? '-> []'
      : JSON.stringify(
          msg.constructor.name === 'Brrr'
            ? msg.items
            : msg.constructor.name === 'Map'
            ? Object.fromEntries(msg)
            : msg,
          null
        )
          .replaceAll('[', '.: [')
          .replaceAll('{', ':: [')
          .replaceAll('}', ']')
          .replaceAll(',', '; ')
          .replaceAll('":', '"; ')
          .replaceAll('null', 'void')
          .replaceAll('undefined', 'void')
    : 'void'
}`
      )
      popup.setCursor(
        popup.posToOffset({ ch: 0, line: popup.lineCount() - 1 }),
        true
      )
      return msg
    }
  },
}

const droneIntel = (icon) => {
  icon.style.visibility = 'visible'
  setTimeout(() => (icon.style.visibility = 'hidden'), 500)
}
const exe = async (source) => {
  consoleElement.style.fontFamily = 'Fantastic'
  try {
    consoleElement.classList.remove('error_line')
    consoleElement.classList.add('info_line')
    const result = chipRun(source, extensions)
    droneButton.classList.remove('shake')
    droneIntel(execIcon)
    return result
  } catch (err) {
    consoleElement.classList.remove('info_line')
    consoleElement.classList.add('error_line')
    consoleElement.value = err + ' '
    droneButton.classList.remove('shake')
    droneButton.classList.add('shake')
    droneIntel(errorIcon)
  }
}

const editor = CodeMirror(editorContainer, {})
droneButton.addEventListener('click', () => {
  consoleElement.value = ''
  consoleElement.classList.add('info_line')
  consoleElement.classList.remove('error_line')
  const source = editor.getValue()
  const selection = editor.getSelection().trim()
  if (!selection) {
    return document.dispatchEvent(
      new KeyboardEvent('keydown', {
        ctrlKey: true,
        key: 's',
      })
    )
  }
  const isEndingWithSemi = selection[selection.length - 1] === ';'
  const out = `__debug_log[${
    isEndingWithSemi ? selection.substring(0, selection.length - 1) : selection
  }; ""]${isEndingWithSemi ? ';' : ''}`
  editor.replaceSelection(out)

  exe(`:=[__debug_log; LOGGER[0]]; ${editor.getValue().trim()}`)
  editor.setValue(source)
  consoleEditor.focus()
})

document.addEventListener('keydown', (e) => {
  if (e.key && e.key.toLowerCase() === 's' && (e.ctrlKey || e.metaKey)) {
    e = e || window.event
    e.preventDefault()
    e.stopPropagation()
    popupContainer.style.display = 'none'
    exe(editor.getValue().trim())

    const encoded = encodeURIComponent(encodeBase64(editor.getValue()))
    consoleElement.style.fontFamily = 'Drifter'
    consoleElement.value = encoded
    window.open(
      `https://at-290690.github.io/HLP/?s=` + encoded,
      'Bit',
      `menubar=no,directories=no,toolbar=no,status=no,scrollbars=no,resize=no,width=600,height=600,left=600,top=150`
    )
  } else if (e.key === 'Escape') {
    e.preventDefault()
    e.stopPropagation()
    popupContainer.style.display = 'none'
    autoComplete.innerHTML = ''
    autoComplete.style.display = 'none'
  }
})
editor.focus()
window.addEventListener('resize', () => {
  const bouds = document.body.getBoundingClientRect()
  const width = bouds.width
  const height = bouds.height
  editor.setSize(width - 10, height - 60)
  if (popupContainer.style.display === 'block') {
    consoleEditor.setSize(width - 2, height / CONSOLE_HEIGHT_FACTOR)
  }
})
const bounds = document.body.getBoundingClientRect()
editor.setSize(bounds.width - 10, bounds.height - 60)
