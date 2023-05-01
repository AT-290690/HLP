export const stringify = (tree, out = '') => {
    for (const node of tree) {
        if (node.type === 'value' && node.class !== 'void')
            out += (node.class === 'string' ? `"${node.value}"` : node.value) + ';';
        else if (node.type === 'word')
            out += node.name + ';';
        else if (node.type === 'apply') {
            if (node.operator.type === 'word') {
                if (node.operator.name == undefined &&
                    node.operator.args[0].type === 'word')
                    out += node.operator.args[0].name + '[';
                else
                    out += node.operator.name + '[' + stringify(node.args) + '];';
            }
            else if (node.operator.type === 'apply') {
                if (node.operator.operator.type === 'word') {
                    out +=
                        node.operator.operator.name +
                            '[' +
                            stringify(node.operator.args) +
                            ']' +
                            '[' +
                            stringify(node.args) +
                            '];';
                }
            }
            else
                out += stringify(node.args) + '];';
        }
    }
    return out.replace(/\;\]/g, ']');
};
