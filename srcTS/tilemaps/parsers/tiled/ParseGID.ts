/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var FLIPPED_HORIZONTAL = 0x80000000;
var FLIPPED_VERTICAL = 0x40000000;
var FLIPPED_ANTI_DIAGONAL = 0x20000000; // Top-right is swapped with bottom-left corners

/**
 * See Tiled documentation on tile flipping:
 * http://docs.mapeditor.org/en/latest/reference/tmx-map-format/
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.ParseGID
 * @since 3.0.0
 *
 * @param {number} gid - [description]
 *
 * @return {object} [description]
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
