' [tolerance; current; type; Generation; Export; id];
:= [meters_group; -> [meters; : [
:= [
;; get first meter
a; .: < [meters]; 
;; get last meter
b; .: > [meters]];
 ;; are meters of the same type
 ? [&& [a; b; == [:: . [a; type]; :: . [b; type]]]; 
  ;; then don't filter because meters are the same type
   meters; 
   ;; if every meter has no reads submitted
    ? [.: every [meters; -> [meter; ! [:: . ? [meter; current]]]]; 
     ;; then go to the first meter type (Generation)
     .: filter [meters; -> [meter; == [:: . [meter; type]; :: . [a; type]]]]; 
     ;; if every meter has read submitted we have to cycle through them for additional submissions
     ? [.: every [meters; -> [meter; 
        && [:: . ? [meter; current]; 
         :: . ? [a; current]; 
         :: . ? [b; current]]]]; 
      ;; check which meter has the latest read
      ? [> [|> [a; :: . [current]; :: . [id]]; |> [b; :: . [current]; :: . [id]]]; 
       ;; if A has recenlty submitted it is B turn
       .: filter [meters; -> [meter; == [:: . [meter; type]; :: . [b; type]]]]; 
       ;; if B has recently submitted it's A turn again
       .: filter [meters; -> [meter; == [:: . [meter; type]; :: . [a; type]]]]]; 
      ;; if some meters are out of tolerance
      ? [.: some [meters; -> [meter; 
         && [:: . ? [meter; current]; |> [meter; :: . [current]; :: . ? [tolerance]]]]]; 
       ;; go back to the out of tolerence ones
       .: filter [meters; -> [meter; 
         && [:: . ? [meter; current]; 
            |> [meter; :: . [current]; :: . ? [tolerance]]]]]; 
       ;; otherwise get only the meters that don't have reads submitted
       .: filter [meters; -> [meter; ! [:: . ? [meter; current]]]]]]]]]]]; 
assert: [
  |> [
    .:[
      |> [meters_group [.: [:: [type; Generation]; :: [type; Export]]]];
      |> [meters_group [.: [:: [type; Generation; current; :: [id; 1]]; :: [type; Export]]]];
      |> [meters_group [.: [:: [type; Generation; current; :: [id; 1]]; :: [type; Export; current; :: [id; 2]]]]];
      |> [meters_group [.: [:: [type; Generation; current; :: [id; 2]]; :: [type; Export; current; :: [id; 1]]]]];
      |> [meters_group [.: [:: [type; Generation; current; :: [id; 2; tolerance; 1]]; :: [type; Export; current; :: [id; 1]]]]];
      |> [meters_group [.: [:: [type; Generation; current; :: [id; 1; tolerance; 1]]; :: [type; Export]]]];
      |> [meters_group [.: [:: [type; Generation; current; :: [id; 1]]; :: [type; Generation; current; :: [id; 2]]; :: [type; Export; current; :: [id; 3]]]]];
      |> [meters_group [.: [:: [type; Generation; current; :: [id; 1; tolerance; 1]]; :: [type; Generation; current; :: [id; 2; tolerance; 1]]; :: [type; Export]]]];
      |> [meters_group [.: [:: [type; Generation; current; :: [id; 3]]; :: [type; Generation; current; :: [id; 4]]; :: [type; Export; current; :: [id; 1]]; :: [type; Export; current; :: [id; 2]]]]];
    ]; 
    .: map >> [-> [meters; |> [meters; .: map >> [-> [meter; :: . [meter; type]]]]]];
    === [
      .: [
        .: [Generation]; 
        .: [Export]; 
        .: [Generation]; 
        .: [Export]; 
        .: [Export]; 
        .: [Generation]; 
        .: [Generation; Generation]; 
        .: [Generation; Generation];
        .: [Export; Export]
      ]]]; "Incorrect program!"];