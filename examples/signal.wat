;; window
<- [CONSOLE] [LIBRARY];
<- [console_log] [CONSOLE];
~* ["http://127.0.0.1:8080/examples/counter_signal.bit"; -> [signals; : [
  := [counter; ^ [signals; 0][]];
    console_log [counter []];
    console_log [counter []];
    console_log [counter []];
    console_log [counter []];
    console_log [counter []];
]]]