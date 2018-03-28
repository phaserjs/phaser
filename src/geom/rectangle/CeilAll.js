/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.CeilAll
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [rect,$return]
 *
 * @param {Phaser.Geom.Rectangle} rect - [description]
 *
 * @return {Phaser.Geom.Rectangle} [description]
 */
var CeilAll = function (rect)
{
    rect.x = Math.ceil(rect.x);
    rect.y = Math.ceil(rect.y);
    rect.width = Math.ceil(rect.width);
    rect.height = Math.ceil(rect.height);

    return rect;
};

module.exports = CeilAll;
