var Contains = require('./Contains');

/**
 * [description]
 *
 * @function Phaser.Geom.Circle.ContainsRect
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Circle} circle - [description]
 * @param {Phaser.Geom.Rectangle|object} rect - [description]
 *
 * @return {boolean} [description]
 */
var ContainsRect = function (circle, rect)
{
    return (
        Contains(circle, rect.x, rect.y) &&
        Contains(circle, rect.right, rect.y) &&
        Contains(circle, rect.x, rect.bottom) &&
        Contains(circle, rect.right, rect.bottom)
    );
};

module.exports = ContainsRect;
