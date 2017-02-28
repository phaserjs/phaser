/**
* The amount the Game Object is visually offset from its x coordinate.
* This is the same as `width * anchor.x`.
* It will only be > 0 if anchor.x is not equal to zero.
*
* @property {number} offsetX
* @readOnly
*/

var GetOffsetX = function (gameObject)
{
    return gameObject.width * gameObject.anchorX;
};

module.exports = GetOffsetX;
