:= [hello; "Hello"]; 
:= [world; "World"]; 
|> [hello; 
	~ [" "; world; "!"]; 
	text_to_upper_case []; 
	~ [" from HLP"]];