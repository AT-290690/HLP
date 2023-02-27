<- [MATH] [LIBRARY];
<- [abs] [MATH];
:= [is_odd; -> [x; == [% [x; 2]; 0]]];
:= [is_even; -> [x; % [x; 2]]];
:= [first_element; .: first [.: [1; 2; 3; 4]]];
:= [out; |> [
    .: [3; 4; 2; 1; 2; 3];
    .:map>> [-> [x; |> [x;
     + [2; 4];
    * [10000; first_element];
    => [-> [x; 
        |> [x; - [232321]]]]]]];
    .: map << [-> [x; abs[x]]];
  ]];
  
.: [is_even[.:first[out]]; is_odd[.:last[out]]]


