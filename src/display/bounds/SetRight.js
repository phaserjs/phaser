/**
 * [description]
 *
 * @function Phaser.Display.Bounds.SetRight
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 * @param {number} value - [description]
 *
 * @return {Phaser.GameObjects.GameObject} [description]
 */
var SetRight = function (gameObject, value)
{
    gameObject.x = (value - gameObject.width) + (gameObject.width * gameObject.originX);

    return gameObject;
};

module.exports = SetRight;
