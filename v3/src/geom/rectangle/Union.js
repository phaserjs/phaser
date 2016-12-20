var Rectangle = require('./Rectangle');

var Union = function (rectA, rectB, output)
{
    if (output === undefined) { output = Rectangle(); }

    var x = Math.min(rectA.x, rectB.x);
    var y = Math.min(rectA.y, rectB.y);

    return output.set(
        x,
        y,
        Math.max(rectA.right, rectB.right) - x,
        Math.max(rectA.bottom, rectB.bottom) - y
    );
    
};

module.exports = Union;
