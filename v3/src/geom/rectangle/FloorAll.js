var FloorAll = function (rect)
{
    rect.x = Math.floor(rect.x);
    rect.y = Math.floor(rect.y);
    rect.width = Math.floor(rect.width);
    rect.height = Math.floor(rect.height);

    return rect;
};

module.exports = FloorAll;
