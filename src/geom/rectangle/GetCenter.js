var Point = require('../point/Point');

//  The center of the Rectangle object, expressed as a Point object 

/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.GetCenter
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - [description]
 * @param {Phaser.Geom.Point|object} [out] - [description]
 *
 * @return {Phaser.Geom.Point|object} [description]
 */
var GetCenter = function (rect, out)
{
    if (out === undefined) { out = new Point(); }

    out.x = rect.right / 2;
    out.y = rect.bottom / 2;

    return out;
};

module.exports = GetCenter;
