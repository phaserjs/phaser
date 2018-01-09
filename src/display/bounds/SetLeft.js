/**
 * [description]
 *
 * @function Phaser.Display.Bounds.SetLeft
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 * @param {number} value - [description]
 *
 * @return {Phaser.GameObjects.GameObject} [description]
 */
var SetLeft = function (gameObject, value)
{
    gameObject.x = value + (gameObject.width * gameObject.originX);

    return gameObject;
};

module.exports = SetLeft;
