var Clamp = require('../../../math/Clamp');

var CircleBodyIntersects = function (circle, body)
{
    var x = Clamp(circle.center.x, body.left, body.right);
    var y = Clamp(circle.center.y, body.top, body.bottom);

    var dx = (circle.center.x - x) * (circle.center.x - x);
    var dy = (circle.center.y - y) * (circle.center.y - y);

    return (dx + dy) <= (circle.halfWidth * circle.halfWidth);
};

module.exports = CircleBodyIntersects;
