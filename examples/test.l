;; test
;; max_sub_array_recursive

;; test == [max_sub_array [.: [1; -2; 10; -5; 12; 3; -2; 3; -199; 10]]; 21]
;; test == [max_sub_array [.: [1; 2; 23]]; 25];
;; test == [max_sub_array [.: [1; 2; 23]]; 15];

<- [MATH] [LIBRARY];
<- [max; infinity] [MATH];
:= [max_sub_array; -> [arr; ~= [loop; -> [i; nums; maxGlobal; maxSoFar;
    ? [< [i; .: length [nums]]; : [
    = [maxGlobal; max [maxGlobal; = [maxSoFar; max [0; + [maxSoFar; ^ [nums; i]]]]]];
    loop [+= [i]; nums; maxGlobal; maxSoFar]];
    maxGlobal]]]
[0; arr; * [infinity; -1]; * [infinity; -1]]]];

max_sub_array [.: [1; 2; 3; 121]]