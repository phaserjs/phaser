/**
 * @author       Niklas von Hertzen (https://github.com/niklasvh/base64-arraybuffer)
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/**
 * Converts an ArrayBuffer into a base64 string.
 * 
 * The resulting string can optionally be a data uri if the `mediaType` argument is provided.
 * 
 * See https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs for more details.
 *
 * @function Phaser.Utils.Base64.ArrayBufferToBase64
 * @since 3.18.0
 * 
 * @param {ArrayBuffer} arrayBuffer - The Array Buffer to encode.
 * @param {string} [mediaType] - An optional media type, i.e. `audio/ogg` or `image/jpeg`. If included the resulting string will be a data URI.
 * 
 * @return {string} The base64 encoded Array Buffer.
 */
var ArrayBufferToBase64 = function (arrayBuffer, mediaType)
{
    var bytes = new Uint8Array(arrayBuffer);
    var len = bytes.length;

    var base64 = (mediaType) ? 'data:' + mediaType + ';base64,' : '';

    for (var i = 0; i < len; i += 3)
    {
        base64 += chars[bytes[i] >> 2];
        base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
        base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
        base64 += chars[bytes[i + 2] & 63];
    }

    if ((len % 3) === 2)
    {
        base64 = base64.substring(0, base64.length - 1) + '=';
    }
    else if (len % 3 === 1)
    {
        base64 = base64.substring(0, base64.length - 2) + '==';
    }
  
    return base64;
};

module.exports = ArrayBufferToBase64;
