/**
* The y coordinate of the Game Object.
* This is the same as `y - offsetY`.
*
* @property {number} top
*/

var GetTop = function (gameObject)
{
    return gameObject.y - (gameObject.height * gameObject.originY);
};

module.exports = GetTop;
