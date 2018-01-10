/**
 * [description]
 *
 * @function Phaser.Display.Bounds.SetCenterY
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 * @param {number} y - [description]
 *
 * @return {Phaser.GameObjects.GameObject} [description]
 */
var SetCenterY = function (gameObject, y)
{
    var offsetY = gameObject.height * gameObject.originY;

    gameObject.y = (y + offsetY) - (gameObject.height * 0.5);

    return gameObject;
};

module.exports = SetCenterY;
