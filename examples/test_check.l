  ;; validate ;; assert ;; log 
  ;; You take your son to the forest to see the monkeys. You know that there are a certain number there (n), but your son is too young to just appreciate the full number, he has to start counting them from 1.
  ;;  As a good parent, you will sit and count with him. Given the number (n), populate an array with all numbers up to and including that number, but excluding zero.
  ;;  For example(Input --> Output):
  ;;  10 --> [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  ;;  1 --> [1]
  
  ;; * test === [monkey_count [5]; .: [1; 2; 3; 4; 5]];
  ;; * test === [monkey_count [3]; .: [1; 2; 3]];
  ;; * test === [monkey_count [9]; .: [1; 2; 3; 4; 5; 6; 7; 8; 9]];
  ;; * test === [monkey_count [10]; .: [1; 2; 3; 4; 5; 6; 7; 8; 9; 10]];
  ;; * test === [monkey_count [20]; .: [1; 2; 3; 4; 5; 6; 7; 8; 9; 10; 11; 12; 13; 14; 15; 16; 17; 18; 19; 20]];
  
  := [monkey_count; -> [n; : [
    ;; your code here
    ;; * check ?== [n; 5];
    
    := [res; .: []];
    ~= [loop; -> [count; bounds; : [
      ;; * check ?== [count; 42];
      ;; * check ?== [bounds; 41];
      ;; * check <= [count; bounds];
      ;; * check > [count; 0];
      .: append [res; count];
      ? [> [bounds; count]; loop [+= [count]; bounds]]]]];
    
    loop[1; n];
    ;; * check ?== [res; .: []];
    ;; * check .: every [res; -> [x; ?== [x; 69]]];
    ;; * check == [.: first [res]; 1];
    ;; * check === [.: slice [res; 0; .: length [res]]; .: slice [.: seq [+ [1; .: length [res]]]; 1; + [1; .: length [res]]]]
    res
  ]]];
  ;; run the code
  monkey_count [5]

  
