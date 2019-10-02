/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Returns the right coordinate from the bounds of the Game Object.
 *
 * @function Phaser.Display.Bounds.GetRight
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to get the bounds value from.
 *
 * @return {number} The right coordinate of the bounds of the Game Object.
 */
var GetRight = function (gameObject)
{
    return (gameObject.x + gameObject.width) - (gameObject.width * gameObject.originX);
};

module.exports = GetRight;
