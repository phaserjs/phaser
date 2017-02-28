var SetCenterX = require('./SetCenterX');
var SetCenterY = require('./SetCenterY');

/**
* The center x coordinate of the Game Object.
* This is the same as `(x - offsetX) + (width / 2)`.
*
* @property {number} centerX
*/

var CenterOn = function (gameObject, x, y)
{
    SetCenterX(gameObject, x);

    return SetCenterY(gameObject, y);
};

module.exports = CenterOn;
