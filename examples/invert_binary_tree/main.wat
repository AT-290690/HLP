;; @import ./examples/invert_binary_tree/types.wat
;; @import ./examples/invert_binary_tree/make_node.wat
;; @import ./examples/invert_binary_tree/invert_binary_tree.wat

:= [tree; make_node [3; make_node[4; :: []; :: []]; make_node[5; :: []; :: []]]];
invert_binary_tree[tree];
tree