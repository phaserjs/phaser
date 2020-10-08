/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../const');
var HexagonalWorldToTileXY = require('./HexagonalWorldToTileXY');
var IsometricWorldToTileXY = require('./IsometricWorldToTileXY');
var NOOP = require('../../utils/NOOP');
var StaggeredWorldToTileXY = require('./StaggeredWorldToTileXY');
var WorldToTileXY = require('./WorldToTileXY');

/**
 * Gets the correct function to use to translate tiles, based on the map orientation.
 *
 * @function Phaser.Tilemaps.Components.GetWorldToTileXYFunction
 * @since 3.50.0
 *
 * @param {number} orientation - The Tilemap orientation constant.
 *
 * @return {(Phaser.Tilemaps.Components.WorldToTileXY|Phaser.Tilemaps.Components.IsometricWorldToTileXY|Phaser.Tilemaps.Components.HexagonalWorldToTileXY|Phaser.Tilemaps.Components.StaggeredWorldToTileXY)} The function to use to translate tiles for the given map type.
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
