;; log
<- [REGEXP] [LIBRARY];
<- [match; make_regexp] [REGEXP];

match ["Hello World 10 !!!"; make_regexp ["\bWorld \b\d{2}"]]