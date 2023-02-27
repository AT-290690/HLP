;; * import ./playground/types.l
;; * import ./playground/make_node.l
;; * import ./playground/invert_binary_tree.l

:= [tree; make_node [3; make_node[4; :: []; :: []]; make_node[5; :: []; :: []]]];
invert_binary_tree[tree];
tree;