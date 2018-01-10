var Contains = require('./Contains');

/**
 * [description]
 *
 * @function Phaser.Geom.Ellipse.ContainsRect
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Ellipse} ellipse - [description]
 * @param {Phaser.Geom.Rectangle|object} rect - [description]
 *
 * @return {boolean} [description]
 */
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
