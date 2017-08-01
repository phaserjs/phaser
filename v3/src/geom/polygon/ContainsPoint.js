var Contains = require('./Contains');

var ContainsPoint = function (polygon, point)
{
    return Contains(polygon, point.x, point.y);
};

module.exports = ContainsPoint;
