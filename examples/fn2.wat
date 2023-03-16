;; log ;; validate ;; assert

;; @test == [fn [10]; 100]
;; @test == [fn [20]; 200]
:= [fn; -> [n; : [
  ;; @check ?== [n; 0];
  ;; @check > [n; 0];
  * [n; 10]
]]];

fn [10]