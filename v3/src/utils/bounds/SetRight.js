/**
* The left coordinate of the Game Object.
* This is the same as `x - offsetX`.
*
* @property {number} left
*/

var SetRight = function (gameObject, value)
{
    gameObject.x = (value - gameObject.width) + (gameObject.width * gameObject.anchorX);

    return gameObject;
};

module.exports = SetRight;
