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