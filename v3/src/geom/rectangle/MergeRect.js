//  Merges source rectangle into target rectangle and returns target
//  Neither rect should have negative widths or heights

var MergeRect = function (target, source)
{
    var minX = Math.min(target.x, source.x);
    var maxX = Math.max(target.right, source.right);

    target.x = minX;
    target.width = maxX - minX;

    var minY = Math.min(target.y, source.y);
    var maxY = Math.max(target.bottom, source.bottom);

    target.y = minY;
    target.height = maxY - minY;

    return target;
};

module.exports = MergeRect;
