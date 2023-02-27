;; log
;; Boxlines
;; Given a * [X; Y; Z] box built by arranging * [1; 1; 1] unit boxes, 
;; write a function f [X; Y; Z] that returns the number of edges (hence, boxlines) of length 1 (both inside and outside of the box)
;; Adjacent unit boxes share the same edges, so a 2*1*1 box will have 20 edges, not 24 edges
;; X,Y and Z are strictly positive, and can go as large as 2^16 - 1

;; [1; 1; 1] -> 12 - 1
;; [2; 1; 1] -> 20 - 2
;; [2; 2; 2] -> 54 - 4
:= [f; -> [x; y; z; : [
  ;; @check && [?== [x; 0]; ?== [y; 0]; ?== [z; 0]]
  ;; @check > [x; 0];
  ;; @check > [y; 0];
  ;; @check > [z; 0];
  ;; TODO:Your code here
  := [n; * [x; y; z]];
  := [k; + [x; y; z]];
  := [case; |> [.: [x; y; z]; .: map >> [-> [x; ![![- [x; 1]]]]]; .: reduce >> [-> [acc; x; + [acc; x]]; 0]]];
  := [cases; :: [
        "0"; -> [* [12; n]];
        "1"; -> [- [* [11; n]; 2]];
        "2"; -> [- [* [8; n]; 2]];
        "3"; -> [- [* [7; n]; 2]]
  ]];
  . [cases; `[case]][];
        ;; "0"; -> [- [* [12; n]; * [0; n]]];
        ;;"1"; -> [- [* [10; n]; * [2; n]]];
        ;;"2"; -> [- [* [8; n]; * [3; n]; * [1; n]; 2]];
        ;;"3"; -> [- [* [12; n]; * [4; n]; * [1; n]; 2]]
  ;; .: [*[n; 4]; * [12; n]];
 ;; - [* [12; n]; * [-[n; 1]; k]];
]]];
;; @test == [f [1; 1; 1]; 12]
;; @test == [f [2; 1; 1]; 20]
;; @test == [f [1; 2; 3]; 46]
;; @test == [f [2; 2; 2]; 54]
.: [f [1; 1; 1]; 
    f [2; 1; 1];
    f [2; 1; 3]; 
    f [2; 2; 2];
   ]; 
