var Rectangle = require('../rectangle/Rectangle');

/**
 * [description]
 *
 * @function Phaser.Geom.Circle.GetBounds
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Circle} circle - [description]
 * @param {Phaser.Geom.Rectangle|object} [out] - [description]
 * @return {Phaser.Geom.Rectangle|object} [description]
 */
var GetBounds = function (circle, out)
{
    if (out === undefined) { out = new Rectangle(); }

    out.x = circle.left;
    out.y = circle.top;
    out.width = circle.diameter;
    out.height = circle.diameter;

    return out;
};

module.exports = GetBounds;
