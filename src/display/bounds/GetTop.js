/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Returns the top coordinate from the bounds of the Game Object.
 *
 * @function Phaser.Display.Bounds.GetTop
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to get the bounds value from.
 *
 * @return {number} The top coordinate of the bounds of the Game Object.
 */
var GetTop = function (gameObject)
{
    return gameObject.y - (gameObject.height * gameObject.originY);
};

module.exports = GetTop;
