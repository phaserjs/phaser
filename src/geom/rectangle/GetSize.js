/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Point = require('../point/Point');

//  The size of the Rectangle object, expressed as a Point object 
//  with the values of the width and height properties.

/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.GetSize
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - [description]
 * @param {Phaser.Geom.Point|object} [out] - [description]
 *
 * @return {Phaser.Geom.Point|object} [description]
 */
var GetSize = function (rect, out)
{
    if (out === undefined) { out = new Point(); }

    out.x = rect.width;
    out.y = rect.height;

    return out;
};

module.exports = GetSize;
