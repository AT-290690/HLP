import { parseExpression } from '../core/parser.js';
import { extractComments, removeNoCode, wrapInBody } from './utils.js';
const format = (tree, level = 0, out = '') => {
    for (const node of tree) {
        if (node.type === 'value' && node.class !== 'void')
            out += (node.class === 'string' ? `"${node.value}"` : node.value) + '; ';
        else if (node.type === 'word')
            out += node.name + '; ';
        else if (node.type === 'apply') {
            out += '\n';
            if (node.operator.type === 'word') {
                out += '\t'.repeat(level);
                if (node.operator.name == undefined &&
                    node.operator.args[0].type === 'word')
                    out += node.operator.args[0].name + ' [';
                else {
                    level++;
                    if (node.operator.name === ':=') {
                        out += node.operator.name + ' [' + format([node.args[0]], level);
                        node.args.slice(1).forEach((item, index) => {
                            out +=
                                ' ' +
                                    (index % 2 === 0
                                        ? format([item], level)
                                        : '\n\t' + format([item], level));
                        });
                        out += ']; ';
                    }
                    else
                        out += node.operator.name + ` [${format(node.args, level)}]; `;
                    level--;
                }
            }
            else if (node.operator.type === 'apply') {
                if (node.operator.operator.type === 'word') {
                    level++;
                    out +=
                        node.operator.operator.name +
                            ' [' +
                            format(node.operator.args, level) +
                            ']' +
                            ' [' +
                            format(node.args, level) +
                            ']; ';
                    level--;
                }
            }
            else {
                level++;
                out += format(node.args, level) + ']; ';
                level--;
            }
        }
    }
    return out.replaceAll(';]', ']').trim();
};
export const pretty = (raw) => {
    const { source, match } = extractComments(raw);
    const comments = match != undefined ? match.filter(Boolean).map((x) => x.trim()) : [];
    const { expr } = parseExpression(wrapInBody(removeNoCode(source.toString().trim())));
    if (expr.type === 'apply') {
        const formatted = format(expr.args);
        return formatted
            .split('void: ["#comment"];')
            .reduce((acc, x, i) => {
            acc += x.trim()
                ? x + (comments[i] ?? '') + '\n'
                : '\n' + (comments[i] ?? '');
            return acc;
        }, '')
            .trim();
    }
    else
        return source;
};
