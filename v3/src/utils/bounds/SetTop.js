/**
* The y coordinate of the Game Object.
* This is the same as `y - offsetY`.
*
* @property {number} top
*/

var SetTop = function (gameObject, value)
{
    gameObject.y = value + (gameObject.height * gameObject.originY);

    return gameObject;
};

module.exports = SetTop;
