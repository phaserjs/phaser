/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Returns the amount the Game Object is visually offset from its x coordinate.
 * This is the same as `width * origin.x`.
 * This value will only be > 0 if `origin.x` is not equal to zero.
 *
 * @function Phaser.Display.Bounds.GetOffsetX
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to get the bounds value from.
 *
 * @return {number} The horizontal offset of the Game Object.
 */
var GetOffsetX = function (gameObject)
{
    return gameObject.width * gameObject.originX;
};

module.exports = GetOffsetX;
