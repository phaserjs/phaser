/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Returns the center y coordinate from the bounds of the Game Object.
 *
 * @function Phaser.Display.Bounds.GetCenterY
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to get the bounds value from.
 *
 * @return {number} The center y coordinate of the bounds of the Game Object.
 */
var GetCenterY = function (gameObject)
{
    return gameObject.y - (gameObject.height * gameObject.originY) + (gameObject.height * 0.5);
};

module.exports = GetCenterY;
