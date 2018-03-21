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
export default function (str: any, len?: any, pad?: any, dir?: any): any;
