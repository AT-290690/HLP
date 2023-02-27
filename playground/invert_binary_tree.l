;; * test : [:= [t1; make_node[10; make_node[3; :: []; :: []]; make_node[4; :: []; :: []]]; t2; make_node[10; make_node[4; :: []; :: []]; make_node[3; :: []; :: []]]]; invert_binary_tree [t1]; === [t1; t2]]; 
;; * test : [:= [t1; make_node[10; make_node[3; make_node[2; :: []; :: []]; make_node[3; :: []; :: []]]; make_node[4; make_node[5; :: []; :: []]; make_node[6; :: []; :: []]]]; t2; make_node[10; make_node[4; make_node[6; :: []; :: []]; make_node[5; :: []; :: []]]; make_node[3; make_node[3; :: []; :: []]; make_node[2; :: []; :: []]]]]; invert_binary_tree [t1]; === [t1; t2]]; 

:= [invert_binary_tree; -> [node;  : [
      ;; * check is_object [node]
      ? [:: size [node]; : [
        := [temp_l; . [node; left]];
        := [temp_r; . [node; right]];

        .= [node; left; temp_r];
        .= [node; right; temp_l];
        
        invert_binary_tree [. [node; left]];
        invert_binary_tree [. [node; right]];
      ]; node]]]];
      