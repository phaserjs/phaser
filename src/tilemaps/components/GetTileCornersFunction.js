/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../const/ORIENTATION_CONST');
var HexagonalGetTileCorners = require('./HexagonalGetTileCorners');
var NOOP = require('../../utils/NOOP');
var GetTileCorners = require('./GetTileCorners');

/**
 * Gets the correct function to use to get the tile corners, based on the map orientation.
 *
 * @function Phaser.Tilemaps.Components.GetTileCornersFunction
 * @since 3.60.0
 *
 * @param {number} orientation - The Tilemap orientation constant.
 *
 * @return {function} The function to use to translate tiles for the given map type.
 */
var GetTileCornersFunction = function (orientation)
{
    if (orientation === CONST.ORTHOGONAL)
    {
        return GetTileCorners;
    }
    else if (orientation === CONST.ISOMETRIC)
    {
        return NOOP;
    }
    else if (orientation === CONST.HEXAGONAL)
    {
        return HexagonalGetTileCorners;
    }
    else if (orientation === CONST.STAGGERED)
    {
        return NOOP;
    }
    else
    {
        return NOOP;
    }
};

module.exports = GetTileCornersFunction;
