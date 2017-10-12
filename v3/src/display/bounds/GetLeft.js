/**
 * [description]
 *
 * @function Phaser.Display.Bounds.GetLeft
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 *
 * @return {number} [description]
 */
var GetLeft = function (gameObject)
{
    return gameObject.x - (gameObject.width * gameObject.originX);
};

module.exports = GetLeft;
