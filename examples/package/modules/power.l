;; test === [power_of_2_array [.: [1; 2; 3]]; .: [1; 4; 9]]
;; test === [power_of_2_array [.: [0; 0; 0]]; .: [0; 0; 0]]
;; test === [power_of_2_array [.: [2]]; .: [4]]

:= [power_of_2_array; -> [arr; : [
            ;; check ?== [arr; .: []];
            ;; check .: length [arr];
            ;; check .: every [arr; -> [x; ?== [x; 69]]];
  
            .: map >> [arr; -> [x; * [x; x]]]]]];
