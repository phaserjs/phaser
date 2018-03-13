/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Rectangle = require('../rectangle/Rectangle');
var RectangleToRectangle = require('./RectangleToRectangle');

/**
 * [description]
 *
 * @function Phaser.Geom.Intersects.GetRectangleIntersection
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rectA - [description]
 * @param {Phaser.Geom.Rectangle} rectB - [description]
 * @param {Phaser.Geom.Rectangle} [output] - [description]
 *
 * @return {Phaser.Geom.Rectangle} [description]
 */
var GetRectangleIntersection = function (rectA, rectB, output)
{
    if (output === undefined) { output = new Rectangle(); }

    if (RectangleToRectangle(rectA, rectB))
    {
        output.x = Math.max(rectA.x, rectB.x);
        output.y = Math.max(rectA.y, rectB.y);
        output.width = Math.min(rectA.right, rectB.right) - output.x;
        output.height = Math.min(rectA.bottom, rectB.bottom) - output.y;
    }

    return output;
};

module.exports = GetRectangleIntersection;
