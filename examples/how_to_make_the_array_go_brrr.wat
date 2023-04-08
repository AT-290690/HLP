;; log
dom::load_bulma [0; 9; 4];
:= [root; |> [dom::get_root[]; dom::set_style [:: ["bg"; "#ebe7e5"; "til"; "l"]]]];

~*
["https://gist.githubusercontent.com/AT-290690/a06c8c5c5726e40ce7a1f24fba8cd601/raw/b2f530a95c92ec28fbcc67815f7bab89e85aea44/article.txt";
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
  dom::container [|> [dom::create_element ["p"]; dom::set_text_content["~* hlp v1.0.0"]; dom::add_class ["mb-2"]; dom::set_style [::["tal"; "x"]]]];
  |> [dom::container [
    |> [dom::container [
      |> [dom::container [
        |> [dom::container [
          |> [dom::insert [dom::create_element["nav"]; [
            |> [dom::container [
                |> [dom::set_attribute["href";dom::create_element ["a"]; "https://github.com/AT-290690"];
                  dom::insert [
                    |> [dom::set_attribute["src"; dom::create_element["img"];"https://at-290690.github.io/brrr/playground/assets/images/thunder.svg"]]; 
                    |> [dom::container [
              |> [dom::create_element ["p"]; 
              dom::set_text_content [content_title];
              dom::add_class ["title"]; 
              dom::add_class ["is-3"]];
             |> [dom::create_element ["p"]; 
              dom::set_text_content [content_subtitle];
              dom::add_class ["subtitle"]; 
              dom::add_class ["is-6"]]];
             dom::add_class ["column"]]]; 
                  dom::add_class ["navbar-item"]]];
                dom::add_class ["navbar-brand"]]]; 
              dom::add_class ["navbar"]; 
              set_attribute ["role"; "navigation"]]]];
        
        |> [dom::container [
          |> [dom::container [
            |> [dom::container [
              |> [dom::insert [dom::create_element["figure"]; [
              dom::set_attribute["src"; dom::create_element["img"];"https://lh3.googleusercontent.com/a/AGNmyxa1wAu9zGWLPL5YrsDj8cK1Jef3SNy6WKik5ovG=s96-c"]]];
            dom::add_class ["image"]; dom::add_class ["is-96x96"]]];
          dom::add_class ["media-left"]];
            |> [dom::container [
              |> [dom::create_element ["p"]; 
                  dom::set_text_content [content_author]; 
                  dom::add_class ["title"]; 
                  dom::add_class ["is-5"]];
              |> [dom::set_attribute["href"; dom::create_element ["a"]; "https://github.com/AT-290690"]; 
                  dom::set_text_content [content_git]; 
                  dom::add_class ["subtitle"]; 
                  dom::add_class ["is-6"]]];
                dom::add_class ["media-content"]]];
              dom::add_class ["media"]];
      
          |> [dom::container [
            dom::set_text_content [dom::create_element ["p"]; .: . [content_exposition; 0]];
            dom::set_text_content [dom::create_element ["strong"]; .: . [content_exposition; 1]];
            
            dom::create_element ["p"];
            
            dom::set_text_content [dom::create_element ["p"]; .: . [content_exposition; 2]]; 
            dom::set_text_content [dom::create_element ["p"]; .: . [content_goal; 0]];
            dom::set_text_content [dom::create_element ["i"]; .: . [content_goal; 1]]; dom::create_element ["p"];
            dom::set_text_content [dom::create_element ["p"]; .: . [content_goal; 2]];
            
            dom::create_element ["p"];
            
            dom::set_text_content [dom::create_element ["p"]; .: . [content_goal; 3]];
            dom::set_text_content [dom::create_element ["strong"]; .: . [content_goal; 4]]; 
   |> [dom::insert [dom::create_element["figure"]; [
            dom::set_attribute["src"; dom::create_element["img"];"https://miro.medium.com/max/1400/1*ErCCPAEcI3Gh1R4My8n8lQ.webp"]]];
            dom::add_class ["image"];  dom::add_class ["card-image"]];
  
       dom::set_text_content [dom::create_element ["p"]; 
              .: . [content_explanation; 0]];
  
       dom::set_text_content [dom::create_element ["p"]; 
              .: . [content_explanation; 1]];
    
   |> [dom::insert [dom::create_element["figure"]; [
            dom::set_attribute["src"; dom::create_element["img"];"https://miro.medium.com/max/1400/1*RiphOyRvYqkB4Z3Dv9PGgg.webp"]]];
            dom::add_class ["image"];  dom::add_class ["card-image"]];
  
            
             dom::set_text_content [dom::create_element ["p"]; 
           .: . [content_explanation; 2]];
  
            
   dom::set_text_content [dom::create_element ["p"]; 
  .: . [content_arithmetic; 0]]; 
  dom::insert [dom::create_element ["pre"]; 
  dom::set_text_content [dom::create_element ["p"]; .: . [content_arithmetic; 1]];
  dom::set_text_content [dom::create_element ["p"]; .: . [content_arithmetic; 2]];
  dom::set_text_content [dom::create_element ["p"]; .: . [content_arithmetic; 3]];
  dom::set_text_content [dom::create_element ["p"]; .: . [content_arithmetic; 4]];
  dom::set_text_content [dom::create_element ["p"]; .: . [content_arithmetic; 5]];
  dom::set_text_content [dom::create_element ["p"]; .: . [content_arithmetic; 6]];
  dom::set_text_content [dom::create_element ["p"]; .: . [content_arithmetic; 7]];
  dom::set_text_content [dom::create_element ["p"]; .: . [content_arithmetic; 8]];
  dom::set_text_content [dom::create_element ["p"]; .: . [content_arithmetic; 9]];
  dom::set_text_content [dom::create_element ["p"]; .: . [content_arithmetic; 10]];
  dom::set_text_content [dom::create_element ["p"]; .: . [content_arithmetic; 11]]];
  dom::create_element ["p"]]; 
              
    dom::container [|> [dom::insert [dom::create_element["figure"]; [
    dom::set_attribute["src"; dom::create_element["img"];"https://user-images.githubusercontent.com/88512646/189848001-5274f5bf-200d-46e3-80df-25c5718bfc4a.gif"]]];
    dom::add_class ["image"];  
    dom::add_class ["card-image"]];
             
    dom::set_text_content [dom::create_element ["i"]; .: . [content_source; 0]];
      dom::create_element ["p"];
    |> [
    dom::create_element ["p"];
    dom::insert [
    dom::set_text_content [dom::create_element ["i"]; .: . [content_source; 1]]]];
  
  
    |> [
    dom::create_element ["p"];
    dom::insert [
    dom::set_text_content [dom::create_element ["strong"]; .: . [content_source; 2]]]];
  
                    
    dom::set_text_content [dom::create_element ["i"]; .: . [content_source; 3]]];
    dom::add_class ["content"]];
  
    dom::create_element ["p"];
          
   |> [dom::insert [dom::create_element["figure"]; [
              |> [dom::set_attribute["src"; dom::create_element["iframe"];"https://at-290690.github.io/snippets/?g=AT-290690/278ed89f5029b355fc9dd27df5178fd4/raw/87bc661909897eaf9d3c1a03c7bcfee95d111f47/Brrr.js"]]]; 
                  dom::add_class ["has-ratio"]]]; 
              dom::add_class ["image"]; 
              dom::add_class ["is-square"]];
          
     dom::add_class [dom::container [
               dom::set_text_content [dom::create_element ["p"]; .: . [content_conclusion; 0]];
             dom::set_text_content [dom::set_attribute["href"; dom::create_element ["a"];"https://github.com/AT-290690/brrr"]; .: . [content_conclusion; 1]];
            dom::set_text_content [dom::create_element ["p"];  .: . [content_conclusion; 2]
             ]];  dom::add_class ["card-content"]]; 
          
          dom::container [
            |> [dom::insert [dom::create_element["figure"]; [
              |> [dom::set_attribute["src"; dom::create_element["iframe"];"https://at-290690.github.io/brrr/"]]; 
                  dom::add_class ["has-ratio"]]]; 
              dom::add_class ["image"]; 
              dom::add_class ["is-square"]];
          dom::create_element ["p"]]
        ]; 
           dom::add_class ["card-content"]]];
          dom::add_class ["card"]];
      
      |> [dom::container [
        |> [dom::container [
          |> [dom::container [
            dom::set_text_content [
              dom::create_element["span"]; 
              .: . [content_source; 5]]; 
              dom::set_text_content [
                dom::set_attribute["href"; dom::create_element ["a"]; "https://at-290690.github.io/hlp/editor"]; 
              "made with hlp"];
            dom::create_element ["p"];
            dom::set_text_content [
              make_time ["2023-03-05"];
              "11:09 PM - 5 Mar 2023"]]; 
              dom::set_style [::["tal"; "x"]]; 
              dom::add_class ["content"]]];
            dom::add_class ["card-content"]]]; 
            dom::add_class ["card"]]]; 
          dom::add_class ["column"];
          dom::add_class ["is-half"]]]; 
      dom::add_class ["columns"];
      dom::add_class ["is-centered"];
      dom::add_class ["is-full"]]]]];