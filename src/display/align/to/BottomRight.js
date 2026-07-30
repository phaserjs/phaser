/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetBottom = require('../../bounds/GetBottom');
var GetRight = require('../../bounds/GetRight');
var SetRight = require('../../bounds/SetRight');
var SetTop = require('../../bounds/SetTop');

/**
 * Takes a given Game Object and aligns it so that it is placed directly below and flush with the right edge of the other Game Object. The right edge of `gameObject` is aligned to the right edge of `alignTo`, and the top edge of `gameObject` is placed at the bottom edge of `alignTo`.
 *
 * @function Phaser.Display.Align.To.BottomRight
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
var BottomRight = function (gameObject, alignTo, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetRight(gameObject, GetRight(alignTo) + offsetX);
    SetTop(gameObject, GetBottom(alignTo) + offsetY);

    return gameObject;
};

module.exports = BottomRight;
