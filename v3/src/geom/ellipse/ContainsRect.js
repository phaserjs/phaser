var Contains = require('./Contains');

var ContainsRect = function (ellipse, rect)
{
    return (
        Contains(ellipse, rect.x, rect.y) &&
        Contains(ellipse, rect.right, rect.y) &&
        Contains(ellipse, rect.x, rect.bottom) &&
        Contains(ellipse, rect.right, rect.bottom)
    );
};

module.exports = ContainsRect;
