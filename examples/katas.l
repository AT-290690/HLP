;; log

;; Boxlines
;; Given a * [X; Y; Z] box built by arranging * [1; 1; 1] unit boxes, 
;; write a function f [X; Y; Z] that returns the number of edges (hence, boxlines) of length 1 (both inside and outside of the box)

;; Notes
;; Adjacent unit boxes share the same edges, so a 2*1*1 box will have 20 edges, not 24 edges
;; X,Y and Z are strictly positive, and can go as large as 2^16 - 1

;; [1; 1; 1] -> 12 - 1
;; [2; 1; 1] -> 20 - 2
;; [2; 2; 2] -> 54 - 4
:= [f; -> [x; y; z; : [
  := [dims; .: [x; y; z]];
  ;; TODO:Your code here
  := [n; |> [dims; .: reduce >> [-> [acc; x; + [acc; x; -1]]; 1]]];
  := [sub; |> [dims; .: reduce >> [-> [acc; x; + [acc; * [+ [x; -1]; 4]]]; 0]]];
  ;; - [* [4; 4]; 4]
  .: [n; * [n; 12]]
]]];

;; * test == [f [2; 1; 1]; 20]
;; * test == [f [1; 2; 3]; 46]
;; * test == [f [2; 2; 2]; 54]
.: [f [1; 1; 1]; f [2; 1; 1]; f [1; 2; 3]; f [2; 2; 2]]; 

