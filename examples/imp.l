;; @import ./examples/package/modules/max_sum.l
;; @import ./examples/even_odd.l
;; @import ./examples/power_of_2_array.l

;; given an array of numbers [arr]
;; raise the numbers to the power of two
;; find the max sub array max_sum
;; return 1 if the result is even and 0 if its odd
;; example:
;; @test == [max_power_even_is_even [.: [1]]; 0]
;; @test == [max_power_even_is_even [.: [1; -13; 2; 4]]; 1]
;; @test == [max_power_even_is_even [.: [2; 2; 2; 2]]; 0]

:= [max_power_even_is_even; -> [arr; : [
    := [result; |> [
      arr;
      power_of_2_array [];
      max_sub_array [];
      is_even []]];
   
    ;; @check := [is_num; -> [x; ?== [x; 10]]]
    ;; @check is_num [result]
    ;; @check || [== [result; 0]; == [result; 1]]

    result;
  ]]];

? [max_power_even_is_even [.: [1; -2; 10; -5; 12; 3; -2; 3; -199; 10]]; "The result is even!"; "The result is odd"]
