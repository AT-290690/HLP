;; @test == [power_of_two_sum [.: [1; 2; 3; 4]]; + [1; 4; 9; 16]];
;; @test == [power_of_two_sum [.: [0; 0; 0]]; 0];
;; @test == [power_of_two_sum [.: []]; 0];
;; @test == [power_of_two_sum [.: [1]]; 1];

:= [power_of_two_sum; -> [arr; : [ 
  ;; @check ?== [arr; array []];
  ;; @check .: every [arr; -> [x; ?== [x; number []]]];
                                               |> [arr;
                          .: map >> [-> [x; * [x; x]]];
         .: reduce >> [-> [acc; x; + [acc; x]]; 0]]]]];

power_of_two_sum [.: [1; 2; "4"]];