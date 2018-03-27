/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Point = require('../point/Point');

/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.Random
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
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
