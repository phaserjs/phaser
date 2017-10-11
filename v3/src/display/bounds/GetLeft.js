/**
* The left coordinate of the Game Object.
* This is the same as `x - offsetX`.
*
* @property {number} left
*/

var GetLeft = function (gameObject)
{
    return gameObject.x - (gameObject.width * gameObject.originX);
};

module.exports = GetLeft;
