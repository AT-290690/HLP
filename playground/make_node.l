' [value; left; right];

;; * test === [make_node [10; make_node[3; :: []; :: []]; make_node[10; :: []; :: []]]; :: [value; 10; left; :: [value; 3; left; :: []; right; :: []]; right;  :: [value; 10; left;:: []; right; :: []]]]
:= [make_node; -> [v; l; r; : [
    ;; * check is_object [r]
    ;; * check is_object [l]
    :: [value; v; left; l; right; r]]]];