/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../const/ORIENTATION_CONST');
var NULL = require('../../utils/NULL');
var WorldToTileX = require('./WorldToTileX');

/**
 * Returns the correct function to use for converting a world pixel X coordinate to a tile X
 * (column) index, based on the map orientation. Only orthogonal maps support this conversion;
 * for all other orientations a NULL function is returned.
 *
 * @function Phaser.Tilemaps.Components.GetWorldToTileXFunction
 * @since 3.50.0
 *
 * @param {number} orientation - The Tilemap orientation constant.
 *
 * @return {function} The function to use to convert a world X coordinate to a tile X index for the given map orientation, or a NULL function if the orientation is unsupported.
 */
var GetWorldToTileXFunction = function (orientation)
{
    if (orientation === CONST.ORTHOGONAL)
    {
        return WorldToTileX;
    }
    else
    {
        return NULL;
    }
};

module.exports = GetWorldToTileXFunction;
