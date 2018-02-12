/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Random = require('../geom/rectangle/Random');

/**
 * [description]
 *
 * @function Phaser.Actions.RandomRectangle
 * @since 3.0.0
 * 
 * @param {array} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Rectangle} rect - [description]
 *
 * @return {array} The array of Game Objects that was passed to this Action.
 */
var RandomRectangle = function (items, rect)
{
    for (var i = 0; i < items.length; i++)
    {
        Random(rect, items[i]);
    }

    return items;
};

module.exports = RandomRectangle;
