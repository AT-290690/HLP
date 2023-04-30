aliases = [
  Object; ::;
  get; ::.;
  set; ::.=;
];

|> [Object ["x"; 10]; 
            set ["y"; 23]; 
            set ["x"; |> [Object ["x"; 10];
                          set ["y"; 23];
                          set ["x"; 23]]];
                          get ["x"]; 
                          get ["y"]];