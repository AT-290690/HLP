;; app
dom_load_bulma [0; 9; 4];
:= [root; |> [dom_get_root[]; dom_set_style [:: ["bg"; "#ebe7e5"; "til"; "l"]]]];

~*
["https://gist.githubusercontent.com/AT-290690/a06c8c5c5726e40ce7a1f24fba8cd601/raw/779a03af3fef8143fabc591ae835f1a75d88c2ef/article.txt";
 -> [crates; : [
   := [data; .: . [crates; 0]];
  := [
      content_title; |> [data; .: . [0]; .: . [0]]; 
      content_subtitle;|> [data; .: . [0]; .: . [1]];
      content_author; |> [data; .: . [0]; .: . [2]];
      content_git; |> [data; .: . [0]; .: . [3]];
      content_exposition; .: . [data; 1];
      content_goal; .: . [data; 2];
      content_explanation; .: . [data; 3];
      content_arithmetic; .: . [data; 4];
      content_source; .: . [data; 5];
      content_conclusion; .: . [data; 6]
  ];
  |> [dom_container [|> [dom_create_element ["p"]; dom_set_text_content["~* hlp v1.0.0"]; dom_add_class ["mb-2"]; dom_set_style [::["tal"; "x"]]]]; dom_append_to [root]];

|> [dom_container [
    |> [dom_container [
      |> [dom_container [
        |> [dom_container [
          |> [dom_insert [
            dom_create_element["nav"]; 
            |> [dom_container [
                |> [dom_set_attribute[dom_create_element ["a"]; "href"; "https://github.com/AT-290690"];
                  dom_insert [
                    |> [dom_set_attribute[dom_create_element["img"]; "src"; "https://at-290690.github.io/brrr/playground/assets/images/thunder.svg"]]; 
                    |> [dom_container [
              |> [dom_create_element ["p"]; 
              dom_set_text_content [content_title];
              dom_add_class ["title"]; 
              dom_add_class ["is-3"]];
             |> [dom_create_element ["p"]; 
              dom_set_text_content [content_subtitle];
              dom_add_class ["subtitle"]; 
              dom_add_class ["is-6"]]];
             dom_add_class ["column"]]]; 
                  dom_add_class ["navbar-item"]]];
                dom_add_class ["navbar-brand"]]]; 
              dom_add_class ["navbar"]; 
              dom_set_attribute ["role"; "navigation"]]];
        
        |> [dom_container [
          |> [dom_container [
            |> [dom_container [
              |> [dom_insert [dom_create_element["figure"];
              dom_set_attribute[dom_create_element["img"]; "src"; "https://lh3.googleusercontent.com/a/AGNmyxa1wAu9zGWLPL5YrsDj8cK1Jef3SNy6WKik5ovG=s96-c"]];
            dom_add_class ["image"]; dom_add_class ["is-96x96"]]];
          dom_add_class ["media-left"]];
            |> [dom_container [
              |> [dom_create_element ["p"]; 
                  dom_set_text_content [content_author]; 
                  dom_add_class ["title"]; 
                  dom_add_class ["is-5"]];
              |> [dom_set_attribute[dom_create_element ["a"]; "href"; "https://github.com/AT-290690"]; 
                  dom_set_text_content [content_git]; 
                  dom_add_class ["subtitle"]; 
                  dom_add_class ["is-6"]]];
                dom_add_class ["media-content"]]];
              dom_add_class ["media"]];
      
          |> [dom_container [
            dom_set_text_content [dom_create_element ["p"]; .: . [content_exposition; 0]];
            dom_set_text_content [dom_create_element ["strong"]; .: . [content_exposition; 1]];
            
            dom_create_element ["p"];
            
            dom_set_text_content [dom_create_element ["p"]; .: . [content_exposition; 2]]; 
            dom_set_text_content [dom_create_element ["p"]; .: . [content_goal; 0]];
            dom_set_text_content [dom_create_element ["i"]; .: . [content_goal; 1]]; dom_create_element ["p"];
            dom_set_text_content [dom_create_element ["p"]; .: . [content_goal; 2]];
            
            dom_create_element ["p"];
            
            dom_set_text_content [dom_create_element ["p"]; .: . [content_goal; 3]];
            dom_set_text_content [dom_create_element ["strong"]; .: . [content_goal; 4]]; 
   |> [dom_insert [dom_create_element["figure"]; 
            dom_set_attribute[dom_create_element["img"]; "src"; "https://miro.medium.com/max/1400/1*ErCCPAEcI3Gh1R4My8n8lQ.webp"]];
            dom_add_class ["image"];  dom_add_class ["card-image"]];
  
       dom_set_text_content [dom_create_element ["p"]; 
              .: . [content_explanation; 0]];
  
       dom_set_text_content [dom_create_element ["p"]; 
              .: . [content_explanation; 1]];
    
   |> [dom_insert [dom_create_element["figure"]; 
            dom_set_attribute[dom_create_element["img"]; "src"; "https://miro.medium.com/max/1400/1*RiphOyRvYqkB4Z3Dv9PGgg.webp"]];
            dom_add_class ["image"];  dom_add_class ["card-image"]];
  
            
             dom_set_text_content [dom_create_element ["p"]; 
           .: . [content_explanation; 2]];
  
            
   dom_set_text_content [dom_create_element ["p"]; 
  .: . [content_arithmetic; 0]]; 
  dom_insert [dom_create_element ["pre"]; 
  dom_set_text_content [dom_create_element ["p"]; .: . [content_arithmetic; 1]];
  dom_set_text_content [dom_create_element ["p"]; .: . [content_arithmetic; 2]];
  dom_set_text_content [dom_create_element ["p"]; .: . [content_arithmetic; 3]];
  dom_set_text_content [dom_create_element ["p"]; .: . [content_arithmetic; 4]];
  dom_set_text_content [dom_create_element ["p"]; .: . [content_arithmetic; 5]];
  dom_set_text_content [dom_create_element ["p"]; .: . [content_arithmetic; 6]];
  dom_set_text_content [dom_create_element ["p"]; .: . [content_arithmetic; 7]];
  dom_set_text_content [dom_create_element ["p"]; .: . [content_arithmetic; 8]];
  dom_set_text_content [dom_create_element ["p"]; .: . [content_arithmetic; 9]];
  dom_set_text_content [dom_create_element ["p"]; .: . [content_arithmetic; 10]];
  dom_set_text_content [dom_create_element ["p"]; .: . [content_arithmetic; 11]]];
  dom_create_element ["p"]]; 
              
    dom_container [|> [dom_insert [dom_create_element["figure"]; 
    dom_set_attribute[dom_create_element["img"]; "src"; "https://user-images.githubusercontent.com/88512646/189848001-5274f5bf-200d-46e3-80df-25c5718bfc4a.gif"]];
    dom_add_class ["image"];  
    dom_add_class ["card-image"]];
             
    dom_set_text_content [dom_create_element ["i"]; .: . [content_source; 0]];
      dom_create_element ["p"];
    |> [
    dom_create_element ["p"];
    dom_insert [
    dom_set_text_content [dom_create_element ["i"]; .: . [content_source; 1]]]];
  
  
    |> [
    dom_create_element ["p"];
    dom_insert [
    dom_set_text_content [dom_create_element ["strong"]; .: . [content_source; 2]]]];
  
                    
    dom_set_text_content [dom_create_element ["i"]; .: . [content_source; 3]]];
    dom_add_class ["content"]];
  
    dom_create_element ["p"];
          
   |> [dom_insert [dom_create_element["figure"]; 
              |> [dom_set_attribute[dom_create_element["iframe"]; "src"; "https://at-290690.github.io/snippets/?g=AT-290690/278ed89f5029b355fc9dd27df5178fd4/raw/87bc661909897eaf9d3c1a03c7bcfee95d111f47/Brrr.js"]]; 
                  dom_add_class ["has-ratio"]]]; 
              dom_add_class ["image"]; 
              dom_add_class ["is-square"]];
          
     dom_add_class [dom_container [
               dom_set_text_content [dom_create_element ["p"]; .: . [content_conclusion; 0]];
             dom_set_text_content [dom_set_attribute[dom_create_element ["a"]; "href"; "https://github.com/AT-290690/brrr"]; .: . [content_conclusion; 1]];
            dom_set_text_content [dom_create_element ["p"];  .: . [content_conclusion; 2]
             ]];  dom_add_class ["card-content"]]; 
          
          dom_container [
            |> [dom_insert [dom_create_element["figure"]; 
              |> [dom_set_attribute[dom_create_element["iframe"]; "src"; "https://at-290690.github.io/brrr/"]]; 
                  dom_add_class ["has-ratio"]]; 
              dom_add_class ["image"]; 
              dom_add_class ["is-square"]];
          dom_create_element ["p"]]
        ]; 
           dom_add_class ["card-content"]]];
          dom_add_class ["card"]];
      
      |> [dom_container [
        |> [dom_container [
          |> [dom_container [
            dom_set_text_content [
              dom_create_element["span"]; 
              .: . [content_source; 5]]; 
              dom_set_text_content [
                dom_set_attribute[dom_create_element ["a"]; "href"; "https://at-290690.github.io/hlp/editor"]; 
              "made with hlp"];
            dom_create_element ["p"];
            dom_set_text_content [
              dom_set_attribute [dom_create_element ["time"]; "datetime"; "2023-03-05"];
              "11:09 PM - 5 Mar 2023"]]; 
              dom_set_style [::["tal"; "x"]]; 
              dom_add_class ["content"]]];
            dom_add_class ["card-content"]]]; 
            dom_add_class ["card"]]]; 
          dom_add_class ["column"];
          dom_add_class ["is-half"]]]; 
      dom_add_class ["columns"];
      dom_add_class ["is-centered"];
      dom_add_class ["is-full"]; 
    dom_append_to [root]]]]];