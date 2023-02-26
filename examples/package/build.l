<- [MATH] [LIBRARY];
<- [max; infinity] [MATH];

;; * test == [max_sub_array [.: [1; -2; 10; -5; 12; 3; -2; 3; -199; 10]]; 21]
;; * test == [max_sub_array [.: [1; 2; 23]]; 25];

:= [max_sub_array; -> [arr; : [
    ;; * check ?== [arr; .: []];
    ;; * check .: length [arr];
    ;; * check .: every [arr; -> [x; ?== [x; 42]]];
    
    ~= [loop; -> [i; nums; maxGlobal; maxSoFar;
    ? [< [i; .: length [nums]]; : [
    = [maxGlobal; max [maxGlobal; = [maxSoFar; max [0; + [maxSoFar; ^ [nums; i]]]]]];
    loop [+= [i]; nums; maxGlobal; maxSoFar]];
    maxGlobal]]]
[0; arr; * [infinity; -1]; * [infinity; -1]]]]];

;; * test === [power_of_2_array [.: [1; 2; 3]]; .: [1; 4; 9]]
;; * test === [power_of_2_array [.: [0; 0; 0]]; .: [0; 0; 0]]
;; * test === [power_of_2_array [.: [2]]; .: [4]]

:= [power_of_2_array; -> [arr; : [
            ;; * check ?== [arr; .: []];
            ;; * check .: length [arr];
            ;; * check .: every [arr; -> [x; ?== [x; 69]]];
  
            .: map >> [arr; -> [x; * [x; x]]]]]];

|> [
    .: [1; 2; 3; 4];
    power_of_2_array [];
    max_sub_array []
]