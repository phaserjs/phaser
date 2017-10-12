/**
 * [description]
 *
 * @function Phaser.Display.Bounds.SetTop
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 * @param {number} value - [description]
 *
 * @return {Phaser.GameObjects.GameObject} [description]
 */
var SetTop = function (gameObject, value)
{
    gameObject.y = value + (gameObject.height * gameObject.originY);

    return gameObject;
};

module.exports = SetTop;
