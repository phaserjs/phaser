/**
 * Positions the Game Object so that the left of its bounds aligns with the given coordinate.
 *
 * @function Phaser.Display.Bounds.SetLeft
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that will be re-positioned.
 * @param {number} value - The coordinate to position the Game Object bounds on.
 *
 * @return {Phaser.GameObjects.GameObject} The Game Object that was positioned.
 */
var SetLeft = function (gameObject, value)
{
    gameObject.x = value + (gameObject.width * gameObject.originX);

    return gameObject;
};

module.exports = SetLeft;
