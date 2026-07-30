/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../const/ORIENTATION_CONST');
var NULL = require('../../utils/NULL');
var StaggeredWorldToTileY = require('./StaggeredWorldToTileY');
var WorldToTileY = require('./WorldToTileY');

/**
 * Returns the correct function to use for converting a world Y coordinate to a tile Y coordinate,
 * based on the map orientation. Returns `WorldToTileY` for orthogonal maps, `StaggeredWorldToTileY`
 * for staggered maps, and a NULL function for all other orientations.
 *
 * @function Phaser.Tilemaps.Components.GetWorldToTileYFunction
 * @since 3.50.0
 *
 * @param {number} orientation - The Tilemap orientation constant.
 *
 * @return {function} The function to use to convert a world Y coordinate to a tile Y coordinate for the given map orientation.
 */
var GetWorldToTileYFunction = function (orientation)
{
    if (orientation === CONST.ORTHOGONAL)
    {
        return WorldToTileY;
    }
    else if (orientation === CONST.STAGGERED)
    {
        return StaggeredWorldToTileY;
    }
    else
    {
        return NULL;
    }
};

module.exports = GetWorldToTileYFunction;
