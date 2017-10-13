/**
 * [description]
 *
 * @function Phaser.Geom.Circle.Contains
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Circle} circle - [description]
 * @param {number} x - [description]
 * @param {number} y - [description]
 *
 * @return {boolean} [description]
 */
var Contains = function (circle, x, y)
{
    //  Check if x/y are within the bounds first
    if (circle.radius > 0 && x >= circle.left && x <= circle.right && y >= circle.top && y <= circle.bottom)
    {
        var dx = (circle.x - x) * (circle.x - x);
        var dy = (circle.y - y) * (circle.y - y);

        return (dx + dy) <= (circle.radius * circle.radius);
    }
    else
    {
        return false;
    }
};

module.exports = Contains;
