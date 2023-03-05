;; app
<- [DOM; STYLE; HTTP] [LIBRARY];
<- [set_style; make_user_interface; set_attribute; mak_eheader; make_iframe; add_text_content;  make_container; make_anchor; get_body; make_pre;
insert_into_container; make_strong_text; make_css_link; make_nav;  make_paragraph; make_figure; make_image; make_time; make_italic_text;
   make_span] [DOM];
<- [add_class; background_color; text_color; text_align; margin] [STYLE];
make_user_interface [];
make_css_link ["https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css"];
|> [get_body []; set_style [background_color ["#ebe7e5"]; text_align ["l"]]];

~*
["https://gist.githubusercontent.com/AT-290690/a06c8c5c5726e40ce7a1f24fba8cd601/raw/b2f530a95c92ec28fbcc67815f7bab89e85aea44/article.txt";
 -> [crates; : [
   := [data; ^ [crates; 0]];
  := [
      content_title; |> [data; ^ [0]; ^ [0]]; 
      content_subtitle;|> [data; ^ [0]; ^ [1]];
      content_author; |> [data; ^ [0]; ^ [2]];
      content_git; |> [data; ^ [0]; ^ [3]];
      content_exposition; ^ [data; 1];
      content_goal; ^ [data; 2];
      content_explanation; ^ [data; 3];
      content_arithmetic; ^ [data; 4];
      content_source; ^ [data; 5];
      content_conclusion; ^ [data; 6]
  ];
  make_container [|> [make_paragraph []; add_text_content["~* hlp v1.0.0"]; add_class ["mb-2"]; set_style [text_align ["c"]]]];
  |> [make_container [
    |> [make_container [
      |> [make_container [
        |> [make_container [
          |> [make_nav [
            |> [make_container [
                |> [make_anchor ["https://github.com/AT-290690"];
                  insert_into_container [
                    |> [make_image ["https://at-290690.github.io/brrr/playground/assets/images/thunder.svg"]]; 
                    |> [make_container [
              |> [make_paragraph []; 
              add_text_content [content_title];
              add_class ["title"]; 
              add_class ["is-3"]];
             |> [make_paragraph []; 
              add_text_content [content_subtitle];
              add_class ["subtitle"]; 
              add_class ["is-6"]]];
             add_class ["column"]]]; 
                  add_class ["navbar-item"]]];
                add_class ["navbar-brand"]]]; 
              add_class ["navbar"]; 
              set_attribute ["role"; "navigation"]]]];
        
        |> [make_container [
          |> [make_container [
            |> [make_container [
              |> [make_figure [
              make_image ["https://lh3.googleusercontent.com/a/AGNmyxa1wAu9zGWLPL5YrsDj8cK1Jef3SNy6WKik5ovG=s96-c"]];
            add_class ["image"]; add_class ["is-96x96"]]];
          add_class ["media-left"]];
            |> [make_container [
              |> [make_paragraph []; 
                  add_text_content [content_author]; 
                  add_class ["title"]; 
                  add_class ["is-5"]];
              |> [make_anchor ["https://github.com/AT-290690"]; 
                  add_text_content [content_git]; 
                  add_class ["subtitle"]; 
                  add_class ["is-6"]]];
                add_class ["media-content"]]];
              add_class ["media"]];
      
          |> [make_container [
            add_text_content [make_paragraph []; ^ [content_exposition; 0]];
            add_text_content [make_strong_text []; ^ [content_exposition; 1]];
            
            make_paragraph [];
            
            add_text_content [make_paragraph []; ^ [content_exposition; 2]]; 
            add_text_content [make_paragraph []; ^ [content_goal; 0]];
            add_text_content [make_italic_text []; ^ [content_goal; 1]]; make_paragraph [];
            add_text_content [make_paragraph []; ^ [content_goal; 2]];
            
            make_paragraph [];
            
            add_text_content [make_paragraph []; ^ [content_goal; 3]];
            add_text_content [make_strong_text []; ^ [content_goal; 4]]; 
   |> [make_figure [
            make_image ["https://miro.medium.com/max/1400/1*ErCCPAEcI3Gh1R4My8n8lQ.webp"]];
            add_class ["image"];  add_class ["card-image"]];
  
       add_text_content [make_paragraph []; 
              ^ [content_explanation; 0]];
  
       add_text_content [make_paragraph []; 
              ^ [content_explanation; 1]];
    
   |> [make_figure [
            make_image ["https://miro.medium.com/max/1400/1*RiphOyRvYqkB4Z3Dv9PGgg.webp"]];
            add_class ["image"];  add_class ["card-image"]];
  
            
             add_text_content [make_paragraph []; 
           ^ [content_explanation; 2]];
  
            
   add_text_content [make_paragraph []; 
  ^ [content_arithmetic; 0]]; 
  insert_into_container [make_pre []; 
  add_text_content [make_paragraph []; ^ [content_arithmetic; 1]];
  add_text_content [make_paragraph []; ^ [content_arithmetic; 2]];
  add_text_content [make_paragraph []; ^ [content_arithmetic; 3]];
  add_text_content [make_paragraph []; ^ [content_arithmetic; 4]];
  add_text_content [make_paragraph []; ^ [content_arithmetic; 5]];
  add_text_content [make_paragraph []; ^ [content_arithmetic; 6]];
  add_text_content [make_paragraph []; ^ [content_arithmetic; 7]];
  add_text_content [make_paragraph []; ^ [content_arithmetic; 8]];
  add_text_content [make_paragraph []; ^ [content_arithmetic; 9]];
  add_text_content [make_paragraph []; ^ [content_arithmetic; 10]];
  add_text_content [make_paragraph []; ^ [content_arithmetic; 11]]];
  make_paragraph []]; 
              
    make_container [|> [make_figure [
    make_image ["https://user-images.githubusercontent.com/88512646/189848001-5274f5bf-200d-46e3-80df-25c5718bfc4a.gif"]];
    add_class ["image"];  
    add_class ["card-image"]];
             
    add_text_content [make_italic_text []; ^ [content_source; 0]];
      make_paragraph [];
    |> [
    make_paragraph [];
    insert_into_container [
    add_text_content [make_italic_text []; ^ [content_source; 1]]]];
  
  
    |> [
    make_paragraph [];
    insert_into_container [
    add_text_content [make_strong_text []; ^ [content_source; 2]]]];
  
                    
    add_text_content [make_italic_text []; ^ [content_source; 3]]];
    add_class ["content"]];
  
    make_paragraph [];
          
   |> [make_figure [
              |> [make_iframe ["https://at-290690.github.io/snippets/?g=AT-290690/278ed89f5029b355fc9dd27df5178fd4/raw/87bc661909897eaf9d3c1a03c7bcfee95d111f47/Brrr.js"]; 
                  add_class ["has-ratio"]]]; 
              add_class ["image"]; 
              add_class ["is-square"]];
          
     add_class [make_container [
               add_text_content [make_paragraph []; ^ [content_conclusion; 0]];
             add_text_content [make_anchor ["https://github.com/AT-290690/brrr"]; ^ [content_conclusion; 1]];
            add_text_content [make_paragraph [];  ^ [content_conclusion; 2]
             ]];  add_class ["card-content"]]; 
          
          make_container [
            |> [make_figure [
              |> [make_iframe ["https://at-290690.github.io/brrr/"]; 
                  add_class ["has-ratio"]]]; 
              add_class ["image"]; 
              add_class ["is-square"]];
          make_paragraph []]
        ]; 
           add_class ["card-content"]]];
          add_class ["card"]];
      
      |> [make_container [
        |> [make_container [
          |> [make_container [
            add_text_content [
              make_span []; 
              ^ [content_source; 5]]; 
              add_text_content [make_anchor ["https://at-290690.github.io/hlp/editor"]; 
              "made with hlp"];
            make_paragraph [];
            add_text_content [
              make_time ["2023-03-05"];
              "11:09 PM - 5 Mar 2023"]]; 
              set_style [text_align["c"]]; 
              add_class ["content"]]];
            add_class ["card-content"]]]; 
            add_class ["card"]]]; 
          add_class ["column"];
          add_class ["is-half"]]]; 
      add_class ["columns"];
      add_class ["is-centered"];
      add_class ["is-full"]]]]];