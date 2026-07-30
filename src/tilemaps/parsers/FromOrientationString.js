/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../const/ORIENTATION_CONST');

/**
 * Converts a Tilemap orientation string into the corresponding `Phaser.Tilemaps.OrientationType`
 * constant. Recognized values are `'isometric'`, `'staggered'`, and `'hexagonal'`. Any other
 * string, including `'orthogonal'`, will return the orthogonal orientation constant, which is
 * the default grid-based orientation used by most tilemaps.
 *
 * The comparison is case-insensitive.
 *
 * @function Phaser.Tilemaps.Parsers.FromOrientationString
 * @since 3.50.0
 *
 * @param {string} [orientation] - The orientation type as a string.
 *
 * @return {Phaser.Tilemaps.OrientationType} The Tilemap Orientation type.
 */
var FromOrientationString = function (orientation)
{
    orientation = orientation.toLowerCase();

    if (orientation === 'isometric')
    {
        return CONST.ISOMETRIC;
    }
    else if (orientation === 'staggered')
    {
        return CONST.STAGGERED;
    }
    else if (orientation === 'hexagonal')
    {
        return CONST.HEXAGONAL;
    }
    else
    {
        return CONST.ORTHOGONAL;
    }
};

module.exports = FromOrientationString;
