/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Create an array of points for each corner of a Rectangle
 * If an array is specified, each point object will be added to the end of the array, otherwise a new array will be created.
 *
 * @function Phaser.Geom.Rectangle.Decompose
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle object to be decomposed.
 * @param {array} [out] - If provided, each point will be added to this array.
 *
 * @return {array} Will return the array you specified or a new array containing the points of the Rectangle.
 */
var Decompose = function (rect, out)
{
    if (out === undefined) { out = []; }

    out.push({ x: rect.x, y: rect.y });
    out.push({ x: rect.right, y: rect.y });
    out.push({ x: rect.right, y: rect.bottom });
    out.push({ x: rect.x, y: rect.bottom });

    return out;
};

module.exports = Decompose;
