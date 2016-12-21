var Floor = function (rect)
{
    rect.x = Math.floor(rect.x);
    rect.y = Math.floor(rect.y);

    return rect;
};

module.exports = Floor;
