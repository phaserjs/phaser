/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Decodes a base-64 encoded string, as used by Tiled when exporting tilemap layer data
 * with base-64 encoding. The binary data is interpreted as a sequence of little-endian
 * unsigned 32-bit integers, each representing a tile GID (Global Tile ID) in the layer.
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.Base64Decode
 * @since 3.0.0
 *
 * @param {object} data - The base-64 encoded string to decode.
 *
 * @return {array} Array of unsigned 32-bit integers representing the decoded tile GIDs.
 */
var Base64Decode = function (data)
{
    var binaryString = window.atob(data);
    var len = binaryString.length;
    var bytes = new Array(len / 4);

    // Interpret binaryString as an array of bytes representing little-endian encoded uint32 values.
    for (var i = 0; i < len; i += 4)
    {
        bytes[i / 4] = (
            binaryString.charCodeAt(i) |
            binaryString.charCodeAt(i + 1) << 8 |
            binaryString.charCodeAt(i + 2) << 16 |
            binaryString.charCodeAt(i + 3) << 24
        ) >>> 0;
    }

    return bytes;
};

module.exports = Base64Decode;
