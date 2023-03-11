<- [DOM; STYLE] [LIBRARY];
<- [set_style; make_user_interface; set_attribute; mak_eheader; make_iframe; add_text_content;  make_container; make_anchor; get_body; make_pre;
insert_into_container; make_strong_text; make_css_link; make_nav;  make_paragraph; make_figure; make_image; make_time; make_italic_text;
   make_span] [DOM];
<- [add_class; background_color; text_color; text_align; margin] [STYLE];
.: [
-> [make_css_link ["https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css"]];
-> [|> [get_body []; set_style [background_color ["#ebe7e5"]; text_align ["l"]]]];
-> [make_container [|> [make_paragraph []; add_text_content["~* hlp v1.0.0"]; add_class ["mb-2"]; set_style [text_align ["c"]]]]];
-> [title; subtitle; img; |> [make_container [
          |> [make_nav [
            |> [make_container [
                |> [make_anchor [github];
                  insert_into_container [
                    |> [make_image [img]]; 
                    |> [make_container [
              |> [make_paragraph []; 
              add_text_content [title];
              add_class ["title"]; 
              add_class ["is-3"]];
             |> [make_paragraph []; 
              add_text_content [subtitle];
              add_class ["subtitle"]; 
              add_class ["is-6"]]];
             add_class ["column"]]]; 
                  add_class ["navbar-item"]]];
                add_class ["navbar-brand"]]]; 
              add_class ["navbar"]; 
              set_attribute ["role"; "navigation"]]]]];
  -> [author; git; img; |> [make_container [
            |> [make_container [
              |> [make_figure [
              make_image [img]];
            add_class ["image"]; add_class ["is-96x96"]]];
          add_class ["media-left"]];
            |> [make_container [
              |> [make_paragraph []; 
                  add_text_content [author]; 
                  add_class ["title"]; 
                  add_class ["is-5"]];
              |> [make_anchor [git]; 
                  add_text_content [git]; 
                  add_class ["subtitle"]; 
                  add_class ["is-6"]]];
                add_class ["media-content"]]];
              add_class ["media"]]];
    -> [img; |> [make_figure [
              |> [make_iframe [img]; 
                  add_class ["has-ratio"]]]; 
              add_class ["image"]; 
              add_class ["is-square"]]];
    -> [date; timestamp; source; |> [make_container [
        |> [make_container [
          |> [make_container [
            add_text_content [
              make_span []; 
              source]; 
              add_text_content [make_anchor ["https://at-290690.github.io/hlp/editor"]; 
              "made with hlp"];
            make_paragraph [];
            add_text_content [
              make_time [date];
              timestamp]]; 
              set_style [text_align["c"]]; 
              add_class ["content"]]];
            add_class ["card-content"]]]]]
];
