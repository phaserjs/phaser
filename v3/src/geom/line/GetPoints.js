var Length = require('./Length');
var Point = require('../point/Point');

var GetPoints = function (line, quantity, stepRate, out)
{
    if (out === undefined) { out = []; }

    //  If quantity is a falsey value (false, null, 0, undefined, etc) then we calculate it based on the stepRate instead.
    if (!quantity)
    {
        quantity = Length(line) / stepRate;
    }

    var x1 = line.x1;
    var y1 = line.y1;

    var x2 = line.x2;
    var y2 = line.y2;

    for (var i = 0; i < quantity; i++)
    {
        var position = i / quantity;

        var x = x1 + (x2 - x1) * position;
        var y = y1 + (y2 - y1) * position;

        out.push(new Point(x, y));
    }

    return out;
};

module.exports = GetPoints;
