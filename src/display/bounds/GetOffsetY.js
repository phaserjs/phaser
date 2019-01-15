/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Returns the amount the Game Object is visually offset from its y coordinate.
 * This is the same as `width * origin.y`.
 * This value will only be > 0 if `origin.y` is not equal to zero.
 *
 * @function Phaser.Display.Bounds.GetOffsetY
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to get the bounds value from.
 *
 * @return {number} The vertical offset of the Game Object.
 */
var GetOffsetY = function (gameObject)
{
    return gameObject.height * gameObject.originY;
};

module.exports = GetOffsetY;
