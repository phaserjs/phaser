/**
 * @author       samme
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetBottom = require('./GetBottom');
var GetLeft = require('./GetLeft');
var GetRight = require('./GetRight');
var GetTop = require('./GetTop');

/**
 * Returns the unrotated bounds of the Game Object as a rectangle.
 *
 * @function Phaser.Display.Bounds.GetBounds
 * @since 3.24.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to get the bounds value from.
 * @param {(Phaser.Geom.Rectangle|object)} [output] - An object to store the values in.
 *
 * @return {(Phaser.Geom.Rectangle|object)} - The bounds of the Game Object.
 */
var GetBounds = function (gameObject, output)
{
    if (output === undefined) { output = {}; }

    var left = GetLeft(gameObject);
    var top = GetTop(gameObject);

    output.x = left;
    output.y = top;
    output.width = GetRight(gameObject) - left;
    output.height = GetBottom(gameObject) - top;

    return output;
};

module.exports = GetBounds;
