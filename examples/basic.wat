<- [log; items] [utils];

|> [
  .: [1; 2; 3; 4];
  .: map << [-> [x; * [x; x]]];
  items [];
  log [];
]