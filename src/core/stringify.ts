import { Expression } from '.'

export const stringify = (tree: Expression[], out = ''): string => {
  for (const node of tree) {
    if (node.type === 'value') {
      out += node.value + ';'
    } else if (node.type === 'word') {
      out += node.name + ';'
    } else if (node.type === 'apply') {
      out += node.operator.name + '['
      if (node.operator.type === 'word') {
        out += stringify(node.args) + '];'
      } else out += stringify(node.args) + '];'
    }
  }
  return out
}
