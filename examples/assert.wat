void: [:= [is_degree; -> [x; && [>= [x; 1]; <= [x; 360]]]; is_integer; -> [x; && [>= [x; -360]; <= [x; 360]]]]];
:= [angle; 1]; assert: [is_degree [angle]; angle; "not a valid angle"];
* loop [359; -> [+=[angle]]]; assert: [is_degree [angle]; angle; "not a valid angle"];
assert: [is_integer [angle]; angle; "not a valid integer"];
angle;