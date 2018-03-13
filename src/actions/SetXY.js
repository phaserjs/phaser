/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Actions.SetXY
 * @since 3.0.0
 * 
 * @param {array} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {number} x - [description]
 * @param {number} y - [description]
 * @param {number} [stepX=0] - [description]
 * @param {number} [stepY=0] - [description]
 *
 * @return {array} The array of Game Objects that was passed to this Action.
 */
var SetXY = function (items, x, y, stepX, stepY)
{
    if (stepX === undefined) { stepX = 0; }
    if (stepY === undefined) { stepY = 0; }

    for (var i = 0; i < items.length; i++)
    {
        items[i].x = x + (i * stepX);
        items[i].y = y + (i * stepY);
    }

    return items;
};

module.exports = SetXY;
