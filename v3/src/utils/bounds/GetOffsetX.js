/**
* The amount the Game Object is visually offset from its x coordinate.
* This is the same as `width * origin.x`.
* It will only be > 0 if origin.x is not equal to zero.
*
* @property {number} offsetX
* @readOnly
*/

var GetOffsetX = function (gameObject)
{
    return gameObject.width * gameObject.originX;
};

module.exports = GetOffsetX;
