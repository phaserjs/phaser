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

var SetCenterX = function (gameObject, x)
{
    var offsetX = gameObject.width * gameObject.originX;

    gameObject.x = (x + offsetX) - (gameObject.width * 0.5);

    return gameObject;
};

module.exports = SetCenterX;
