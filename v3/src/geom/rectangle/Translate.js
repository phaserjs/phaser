var Translate = function (rect, x, y)
{
    rect.x += x;
    rect.y += y;

    return rect;
};

module.exports = Translate;
