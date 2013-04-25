# open.js

open a file or url in the default associated application

# install

```
npm install open
```

# usage

```js
var open = require('open');

open('http://www.google.com');
```

# how it works 

- on `win32` uses `start`
- on `darwin` uses `open`
- otherwise uses the xdg-open script from [Portland](http://portland.freedesktop.org)

# warning

The same care should be taken when calling open as if you were calling 
child_process.exec directly. If its an executable it will run in a new shell. 
