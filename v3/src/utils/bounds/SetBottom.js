/**
* The left coordinate of the Game Object.
* This is the same as `x - offsetX`.
*
* @property {number} left
*/

var SetBottom = function (gameObject, value)
{
    gameObject.y = (value - gameObject.height) + (gameObject.height * gameObject.anchorY);

    return gameObject;
};

module.exports = SetBottom;
