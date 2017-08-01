var Reflect = require('./Reflect');

/**
* Glow blend mode. This mode is a variation of reflect mode with the source and backdrop colors swapped.
*/
var Glow = function (a, b)
{
    return Reflect(b, a);
};

module.exports = Glow;
