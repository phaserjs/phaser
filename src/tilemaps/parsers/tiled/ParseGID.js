/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var FLIPPED_HORIZONTAL = 0x80000000;
var FLIPPED_VERTICAL = 0x40000000;
var FLIPPED_ANTI_DIAGONAL = 0x20000000; // Top-right is swapped with bottom-left corners

/**
 * Parses a Tiled Global Tile ID (GID), extracting the tile index and any flip flags encoded
 * in the high bits of the value. In the Tiled TMX format, the top three bits of a GID are used
 * to indicate horizontal flip, vertical flip, and anti-diagonal flip (i.e. 90-degree rotation).
 *
 * This function strips those flag bits from the GID to recover the raw tile index, then
 * interprets all eight possible combinations of the three flags and converts them into a
 * rotation value (in radians) and a boolean `flipped` state that Phaser can apply directly
 * to a tile when rendering.
 *
 * See the Tiled documentation on tile flipping for the full flag specification:
 * http://docs.mapeditor.org/en/latest/reference/tmx-map-format/
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.ParseGID
 * @since 3.0.0
 *
 * @param {number} gid - A Tiled GID, potentially with flip flags encoded in the high bits.
 *
 * @return {Phaser.Types.Tilemaps.GIDData} A GIDData object containing the raw tile index, the three individual flip flags, and the derived rotation (in radians) and flipped state.
 */
var ParseGID = function (gid)
{
    var flippedHorizontal = Boolean(gid & FLIPPED_HORIZONTAL);
    var flippedVertical = Boolean(gid & FLIPPED_VERTICAL);
    var flippedAntiDiagonal = Boolean(gid & FLIPPED_ANTI_DIAGONAL);
    gid = gid & ~(FLIPPED_HORIZONTAL | FLIPPED_VERTICAL | FLIPPED_ANTI_DIAGONAL);

    // Parse the flip flags into something Phaser can use
    var rotation = 0;
    var flipped = false;

    if (flippedHorizontal && flippedVertical && flippedAntiDiagonal)
    {
        rotation = Math.PI / 2;
        flipped = true;
    }
    else if (flippedHorizontal && flippedVertical && !flippedAntiDiagonal)
    {
        rotation = Math.PI;
        flipped = false;
    }
    else if (flippedHorizontal && !flippedVertical && flippedAntiDiagonal)
    {
        rotation = Math.PI / 2;
        flipped = false;
    }
    else if (flippedHorizontal && !flippedVertical && !flippedAntiDiagonal)
    {
        rotation = 0;
        flipped = true;
    }
    else if (!flippedHorizontal && flippedVertical && flippedAntiDiagonal)
    {
        rotation = 3 * Math.PI / 2;
        flipped = false;
    }
    else if (!flippedHorizontal && flippedVertical && !flippedAntiDiagonal)
    {
        rotation = Math.PI;
        flipped = true;
    }
    else if (!flippedHorizontal && !flippedVertical && flippedAntiDiagonal)
    {
        rotation = 3 * Math.PI / 2;
        flipped = true;
    }
    else if (!flippedHorizontal && !flippedVertical && !flippedAntiDiagonal)
    {
        rotation = 0;
        flipped = false;
    }

    return {
        gid: gid,
        flippedHorizontal: flippedHorizontal,
        flippedVertical: flippedVertical,
        flippedAntiDiagonal: flippedAntiDiagonal,
        rotation: rotation,
        flipped: flipped
    };
};

module.exports = ParseGID;
