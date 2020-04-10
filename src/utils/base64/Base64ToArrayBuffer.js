/**
 * @author       Niklas von Hertzen (https://github.com/niklasvh/base64-arraybuffer)
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

//  Use a lookup table to find the index.
var lookup = new Uint8Array(256);

for (var i = 0; i < chars.length; i++)
{
    lookup[chars.charCodeAt(i)] = i;
}

/**
 * Converts a base64 string, either with or without a data uri, into an Array Buffer.
 *
 * @function Phaser.Utils.Base64.Base64ToArrayBuffer
 * @since 3.18.0
 * 
 * @param {string} base64 - The base64 string to be decoded. Can optionally contain a data URI header, which will be stripped out prior to decoding.
 * 
 * @return {ArrayBuffer} An ArrayBuffer decoded from the base64 data.
 */
var Base64ToArrayBuffer = function (base64)
{
    //  Is it a data uri? if so, strip the header away
    base64 = base64.substr(base64.indexOf(',') + 1);

    var len = base64.length;
    var bufferLength = len * 0.75;
    var p = 0;
    var encoded1;
    var encoded2;
    var encoded3;
    var encoded4;

    if (base64[len - 1] === '=')
    {
        bufferLength--;

        if (base64[len - 2] === '=')
        {
            bufferLength--;
        }
    }

    var arrayBuffer = new ArrayBuffer(bufferLength);
    var bytes = new Uint8Array(arrayBuffer);

    for (var i = 0; i < len; i += 4)
    {
        encoded1 = lookup[base64.charCodeAt(i)];
        encoded2 = lookup[base64.charCodeAt(i + 1)];
        encoded3 = lookup[base64.charCodeAt(i + 2)];
        encoded4 = lookup[base64.charCodeAt(i + 3)];

        bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
        bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
        bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arrayBuffer;
};

module.exports = Base64ToArrayBuffer;
