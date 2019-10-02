/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Positions the Game Object so that the center top of its bounds aligns with the given coordinate.
 *
 * @function Phaser.Display.Bounds.SetCenterY
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject} G - [gameObject,$return]
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that will be re-positioned.
 * @param {number} y - The coordinate to position the Game Object bounds on.
 *
 * @return {Phaser.GameObjects.GameObject} The Game Object that was positioned.
 */
var SetCenterY = function (gameObject, y)
{
    var offsetY = gameObject.height * gameObject.originY;

    gameObject.y = (y + offsetY) - (gameObject.height * 0.5);

    return gameObject;
};

module.exports = SetCenterY;
