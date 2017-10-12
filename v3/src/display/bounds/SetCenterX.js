/**
 * [description]
 *
 * @function Phaser.Display.Bounds.SetCenterX
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 * @param {number} x - [description]
 *
 * @return {Phaser.GameObjects.GameObject} [description]
 */
var SetCenterX = function (gameObject, x)
{
    var offsetX = gameObject.width * gameObject.originX;

    gameObject.x = (x + offsetX) - (gameObject.width * 0.5);

    return gameObject;
};

module.exports = SetCenterX;
