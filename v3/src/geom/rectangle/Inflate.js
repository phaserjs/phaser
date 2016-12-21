//  Increases the size of the Rectangle object by the specified amounts.
//  The center point of the Rectangle object stays the same, and its size increases 
//  to the left and right by the x value, and to the top and the bottom by the y value.

var Inflate = function (rect, x, y)
{
    //  Get the current center
    var cx = rect.x + (rect.width / 2);
    var cy = rect.y + (rect.height / 2);

    //  Inflate
    rect.width = 2 * x;
    rect.height = 2 * y;

    rect.x = x - (rect.width / 2);
    rect.y = y - (rect.height / 2);

    return rect;
};

module.exports = Inflate;
