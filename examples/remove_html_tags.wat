:= [is_tag; 0]; 
|> ["<html><title>Remove html tags: </title><body><span>I'm a span</span><img src='./duck.png'/></body></html>";
	.: from_string [""]; 
	.: reduce >> [-> [out; x;
                      
                      : [
			? [|| [== [x; "<"]; == [x; ">"]]; 
				= [is_tag; ! [is_tag]];
				? [! [is_tag]; 
                   = [out; ~ [out; x]]]]; out]]; ""]];