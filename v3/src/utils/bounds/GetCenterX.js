/**
* The center x coordinate of the Game Object.
* This is the same as `(x - offsetX) + (width / 2)`.
*
* @property {number} centerX
*/

var GetCenterX = function (gameObject)
{
    return gameObject.x - (gameObject.width * gameObject.originX) + (gameObject.width * 0.5);
};

module.exports = GetCenterX;
