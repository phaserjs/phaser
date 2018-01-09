/**
 * [description]
 *
 * @function Phaser.Display.Bounds.GetBottom
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 *
 * @return {number} [description]
 */
var GetBottom = function (gameObject)
{
    return (gameObject.y + gameObject.height) - (gameObject.height * gameObject.originY);
};

module.exports = GetBottom;
