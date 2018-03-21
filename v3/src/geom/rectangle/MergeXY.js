
var MergeXY = function (target, x, y)
{
    var minX = Math.min(target.x, x);
    var maxX = Math.max(target.right, x);

    target.x = minX;
    target.width = maxX - minX;

    var minY = Math.min(target.y, y);
    var maxY = Math.max(target.bottom, y);

    target.y = minY;
    target.height = maxY - minY;

    return target;
};

module.exports = MergeXY;
