/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetBottom = require('../../bounds/GetBottom');
var GetLeft = require('../../bounds/GetLeft');
var SetBottom = require('../../bounds/SetBottom');
var SetRight = require('../../bounds/SetRight');

/**
 * Takes a given Game Object and aligns it so that its right edge touches the left edge of the `alignTo` Game Object, with its bottom edge aligned to the bottom edge of `alignTo`.
 *
 * @function Phaser.Display.Align.To.LeftBottom
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject} G - [gameObject,$return]
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that will be positioned.
 * @param {Phaser.GameObjects.GameObject} alignTo - The Game Object to base the alignment position on.
 * @param {number} [offsetX=0] - Optional horizontal offset from the position.
 * @param {number} [offsetY=0] - Optional vertical offset from the position.
 *
 * @return {Phaser.GameObjects.GameObject} The Game Object that was aligned.
 */
var LeftBottom = function (gameObject, alignTo, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetRight(gameObject, GetLeft(alignTo) - offsetX);
    SetBottom(gameObject, GetBottom(alignTo) + offsetY);

    return gameObject;
};

module.exports = LeftBottom;
