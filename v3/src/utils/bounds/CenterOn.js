var CenterX = require('./CenterX');
var CenterY = require('./CenterY');

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

var CenterOn = function (gameObject, x, y)
{
    CenterX(gameObject, x);

    return CenterY(gameObject, y);
};

module.exports = CenterOn;
