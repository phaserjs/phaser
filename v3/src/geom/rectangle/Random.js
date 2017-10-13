var Point = require('../point/Point');

/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.Random
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - [description]
 * @param {Phaser.Geom.Point} out - [description]
 *
 * @return {Phaser.Geom.Point} [description]
 */
var Random = function (rect, out)
{
    if (out === undefined) { out = new Point(); }

    out.x = rect.x + (Math.random() * rect.width);
    out.y = rect.y + (Math.random() * rect.height);

    return out;
};

module.exports = Random;
