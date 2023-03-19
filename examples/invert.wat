;; log ;; validate ;; test
;; @check := [is_number; -> [n; ?== [n; number[]]]]
;; @check := [is_string; -> [n; ?== [n; string[]]]]
;; @check := [is_array; -> [n; ?== [n; array[]]]]
;; @check := [is_object; -> [n; ?== [n; object[]]]]
;; @check := [is_function; -> [n; ?== [n; -> [1]]]]
;; @check := [is_boolean; -> [n; || [== [n; 0]; == [n; 1]]]]
;; @check := [is_one_of; -> [key; strings; .: some [strings; -> [x; == [x; key]]]]]
;; @check := [is_empty_array; -> [arr; .: length [arr]]]
;; @check := [is_empty_object; -> [obj; :: size [obj]]]

' [value; left; right];
;; @test === [make_node [10; make_node[3; :: []; :: []]; make_node[10; :: []; :: []]]; :: [value; 10; left; :: [value; 3; left; :: []; right; :: []]; right;  :: [value; 10; left;:: []; right; :: []]]]
:= [make_node; -> [v; l; r; : [
    ;; @check is_object [r]
    ;; @check is_object [l]
    :: [value; v; left; l; right; r]]]];

;; @mock := [t1; make_node[10; make_node[3; :: []; :: []]; make_node[4; :: []; :: []]]]
;; @mock := [t2; make_node[10; make_node[4; :: []; :: []]; make_node[3; :: []; :: []]]]
;; @mock := [t3; make_node[10; make_node[3; make_node[2; :: []; :: []]; make_node[3; :: []; :: []]];  make_node[4; make_node[5; :: []; :: []]; make_node[6; :: []; :: []]]]] 
;; @mock := [t4; make_node[10; make_node[4; make_node[6; :: []; :: []];  make_node[5; :: []; :: []]]; make_node[3; make_node[3; :: []; :: []]; make_node[2; :: []; :: []]]]]

;; @test invert_binary_tree [t1]; === [t1; t2]
;; @test invert_binary_tree [t3]; === [t3; t4] 
:= [invert_binary_tree; -> [node; : [
      ;; @check is_object [node]
      ? [:: size [node]; : [
        := [temp_l; . [node; left]];
        := [temp_r; . [node; right]];

        .= [node; left; temp_r];
        .= [node; right; temp_l];
        
        invert_binary_tree [. [node; left]];
        invert_binary_tree [. [node; right]];
      ]; node]]]];

:= [tree; make_node [3; make_node[4; :: []; :: []]; make_node[5; :: []; :: []]]];
invert_binary_tree[tree];
tree