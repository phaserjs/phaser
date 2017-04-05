/**
* Takes the given string and pads it out, to the length required, using the character
* specified. For example if you need a string to be 6 characters long, you can call:
*
* `pad('bob', 6, '-', 2)`
*
* This would return: `bob---` as it has padded it out to 6 characters, using the `-` on the right.
*
* You can also use it to pad numbers (they are always returned as strings):
* 
* `pad(512, 6, '0', 1)`
*
* Would return: `000512` with the string padded to the left.
*
* If you don't specify a direction it'll pad to both sides:
* 
* `pad('c64', 7, '*')`
*
* Would return: `**c64**`
*
* @method Phaser.Utils.pad
* @param {string} str - The target string. `toString()` will be called on the string, which means you can also pass in common data types like numbers.
* @param {integer} [len=0] - The number of characters to be added.
* @param {string} [pad=" "] - The string to pad it out with (defaults to a space).
* @param {integer} [dir=3] - The direction dir = 1 (left), 2 (right), 3 (both).
* @return {string} The padded string.
*/
var Pad = function (str, len, pad, dir)
{
    if (len === undefined) { len = 0; }
    if (pad === undefined) { pad = ' '; }
    if (dir === undefined) { dir = 3; }

    str = str.toString();

    var padlen = 0;

    if (len + 1 >= str.length)
    {
        switch (dir)
        {
            case 1:
                str = new Array(len + 1 - str.length).join(pad) + str;
                break;

            case 3:
                var right = Math.ceil((padlen = len - str.length) / 2);
                var left = padlen - right;
                str = new Array(left + 1).join(pad) + str + new Array(right + 1).join(pad);
                break;

            default:
                str = str + new Array(len + 1 - str.length).join(pad);
                break;
        }
    }

    return str;
};

module.exports = Pad;
