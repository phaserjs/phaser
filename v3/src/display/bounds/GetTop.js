/**
 * [description]
 *
 * @function Phaser.Display.Bounds.GetTop
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 *
 * @return {number} [description]
 */
var GetTop = function (gameObject)
{
    return gameObject.y - (gameObject.height * gameObject.originY);
};

module.exports = GetTop;
