/**
* The center x coordinate of the Game Object.
* This is the same as `(x - offsetX) + (width / 2)`.
*
* @property {number} centerX
*/

//  Phaser.Utils.Bounds.GetCenterX(bob)
//  Phaser.Utils.Bounds.CenterOn(bob, x, y)
//  Phaser.Utils.Bounds.CenterX(bob, x)
//  Phaser.Utils.Bounds.CenterY(bob, x)

var SetCenterY = function (gameObject, y)
{
    var offsetY = gameObject.height * gameObject.originY;

    gameObject.y = (y + offsetY) - (gameObject.height * 0.5);

    return gameObject;
};

module.exports = SetCenterY;
