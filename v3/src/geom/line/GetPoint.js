//  Get a point on the given line 'progress' percentage along its length.
//  progress is a value between 0 and 1.

var GetPoint = function (line, progress)
{
    var x = line.x1 + (line.x2 - line.x1) * progress;
    var y = line.y1 + (line.y2 - line.y1) * progress;

    return { x: x, y: y };
};

module.exports = GetPoint;
