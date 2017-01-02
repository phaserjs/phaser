var Contains = require('./Contains');

var ContainsPoint = function (circle, point)
{
    return Contains(circle, point.x, point.y);
};

module.exports = ContainsPoint;
