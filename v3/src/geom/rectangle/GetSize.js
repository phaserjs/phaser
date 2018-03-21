//  The size of the Rectangle object, expressed as a Point object 
//  with the values of the width and height properties.

var GetSize = function (rect, out)
{
    if (out === undefined) { out = { x: 0, y: 0 }; }

    out.x = rect.width;
    out.y = rect.height;

    return out;
};

module.exports = GetSize;
