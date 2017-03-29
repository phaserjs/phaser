var Contains = require('./Contains');

var ContainsPoint = function (triangle, point)
{
    return Contains(triangle, point.x, point.y);
};

module.exports = ContainsPoint;
