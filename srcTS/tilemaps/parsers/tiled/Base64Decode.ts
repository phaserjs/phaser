/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.Base64Decode
 * @since 3.0.0
 *
 * @param {object} data - [description]
 *
 * @return {array} [description]
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
