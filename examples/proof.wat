;; Remove html tags and leave only text
:= [remove_html_tags; -> [html; 
		: [:= [is_tag; 0]; 
			|> [html; 
				.:from_string [""]; 
				.:reduce>> [-> [out; x; 
						: [? [|| [== [x; "<"]; 
									== [x; ">"]]; 
								= [is_tag; 
									! [is_tag]]; 
								? [! [is_tag]; 
									= [out; 
										~ [out; x]]]]; out]]; ""]]]]]; 
void: [
;; Proof
;; remove_html_tags -> [html]
;; should
	!throw [== [remove_html_tags ["<html><title>Remove html tags: </title><body><span>I'm a span</span><img src='./duck.png'/></body></html>"]; 
;; equal
 "Remove html tags: I'm a span"]; 
;; message
 "<html><title>...</title><span>...</span><img/></html>"]; 
;; should
	!throw [== [remove_html_tags ["<>Hello<>"]; 
;; eqqual
 "Hello"]; 
;; message
 "<>...<>"]; 
;; should
	!throw [== [remove_html_tags ["<div><pre>You prefer coffee or tea? </br>I like coffee!</pre></div>"]; 
;; equal
 "You prefer coffee or tea? I like coffee!"]; 
;; message
 "<div><pre>...</br></pre></div>"]];