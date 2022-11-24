/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../const/ORIENTATION_CONST');
var NULL = require('../../utils/NULL');
var WorldToTileX = require('./WorldToTileX');

/**
 * Gets the correct function to use to translate tiles, based on the map orientation.
 *
 * Only orthogonal maps support this feature.
 *
 * @function Phaser.Tilemaps.Components.GetWorldToTileXFunction
 * @since 3.50.0
 *
 * @param {number} orientation - The Tilemap orientation constant.
 *
 * @return {function} The function to use to translate tiles for the given map type.
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
