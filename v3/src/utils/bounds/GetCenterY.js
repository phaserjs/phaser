/**
* The center x coordinate of the Game Object.
* This is the same as `(x - offsetX) + (width / 2)`.
*
* @property {number} centerX
*/

var GetCenterY = function (gameObject)
{
    return gameObject.y - (gameObject.height * gameObject.originY) + (gameObject.height * 0.5);
};

module.exports = GetCenterY;
