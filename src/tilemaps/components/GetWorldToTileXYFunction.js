/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../const/ORIENTATION_CONST');
var HexagonalWorldToTileXY = require('./HexagonalWorldToTileXY');
var IsometricWorldToTileXY = require('./IsometricWorldToTileXY');
var NOOP = require('../../utils/NOOP');
var StaggeredWorldToTileXY = require('./StaggeredWorldToTileXY');
var WorldToTileXY = require('./WorldToTileXY');

/**
 * Returns the appropriate world-to-tile coordinate conversion function for the given map orientation.
 * The returned function converts world pixel coordinates (X, Y) into tile grid coordinates, using
 * the correct projection math for orthogonal, isometric, hexagonal, or staggered tilemaps.
 * If the orientation is unrecognised, a NOOP function is returned.
 *
 * @function Phaser.Tilemaps.Components.GetWorldToTileXYFunction
 * @since 3.50.0
 *
 * @param {number} orientation - The Tilemap orientation constant, as defined in `Phaser.Tilemaps.ORIENTATION_CONST`.
 *
 * @return {function} The world-to-tile coordinate conversion function for the given map orientation.
 */
var GetWorldToTileXYFunction = function (orientation)
{
    if (orientation === CONST.ORTHOGONAL)
    {
        return WorldToTileXY;
    }
    else if (orientation === CONST.ISOMETRIC)
    {
        return IsometricWorldToTileXY;
    }
    else if (orientation === CONST.HEXAGONAL)
    {
        return HexagonalWorldToTileXY;
    }
    else if (orientation === CONST.STAGGERED)
    {
        return StaggeredWorldToTileXY;
    }
    else
    {
        return NOOP;
    }
};

module.exports = GetWorldToTileXYFunction;
