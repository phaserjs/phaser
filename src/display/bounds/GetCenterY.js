/**
 * [description]
 *
 * @function Phaser.Display.Bounds.GetCenterY
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 *
 * @return {number} [description]
 */
var GetCenterY = function (gameObject)
{
    return gameObject.y - (gameObject.height * gameObject.originY) + (gameObject.height * 0.5);
};

module.exports = GetCenterY;
