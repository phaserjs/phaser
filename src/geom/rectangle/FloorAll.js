/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.FloorAll
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [rect,$return]
 *
 * @param {Phaser.Geom.Rectangle} rect - [description]
 *
 * @return {Phaser.Geom.Rectangle} [description]
 */
var FloorAll = function (rect)
{
    rect.x = Math.floor(rect.x);
    rect.y = Math.floor(rect.y);
    rect.width = Math.floor(rect.width);
    rect.height = Math.floor(rect.height);

    return rect;
};

module.exports = FloorAll;
