;; log
aliases = [
  object; ::;
  get; ::.;
  set; ::.=;
];

|> [object ["x"; 10]; 
            set ["y"; 23]; 
            set ["x"; |> [object ["x"; 10];
                          set ["y"; 23];
                          set ["x"; 23]]];
                          get ["x"]; 
                          get ["y"]];