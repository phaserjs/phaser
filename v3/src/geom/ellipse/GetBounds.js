var Rectangle = require('../rectangle/Rectangle');

/**
 * [description]
 *
 * @function Phaser.Geom.Ellipse.GetBounds
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Ellipse} ellipse - [description]
 * @param {Phaser.Geom.Rectangle|object} [out] - [description]
 *
 * @return {Phaser.Geom.Rectangle} [description]
 */
var GetBounds = function (ellipse, out)
{
    if (out === undefined) { out = new Rectangle(); }

    out.x = ellipse.x - ellipse.width;
    out.y = ellipse.y - ellipse.height;
    out.width = ellipse.width;
    out.height = ellipse.height;

    return out;
};

module.exports = GetBounds;
