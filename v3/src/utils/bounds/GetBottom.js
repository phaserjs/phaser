/**
* The left coordinate of the Game Object.
* This is the same as `x - offsetX`.
*
* @property {number} left
*/

var GetBottom = function (gameObject)
{
    return (gameObject.y + gameObject.height) - (gameObject.height * gameObject.anchorY);
};

module.exports = GetBottom;
