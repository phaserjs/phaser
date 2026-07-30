/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetBottom = require('../../bounds/GetBottom');
var GetCenterX = require('../../bounds/GetCenterX');
var SetBottom = require('../../bounds/SetBottom');
var SetCenterX = require('../../bounds/SetCenterX');

/**
 * Takes a given Game Object and aligns it so that its bottom edge matches the bottom edge of the `alignIn` Game Object, with its horizontal center aligned to the horizontal center of `alignIn`.
 *
 * @function Phaser.Display.Align.In.BottomCenter
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject} G - [gameObject,$return]
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that will be positioned.
 * @param {Phaser.GameObjects.GameObject} alignIn - The Game Object to base the alignment position on.
 * @param {number} [offsetX=0] - Optional horizontal offset from the position.
 * @param {number} [offsetY=0] - Optional vertical offset from the position.
 *
 * @return {Phaser.GameObjects.GameObject} The Game Object that was aligned.
 */
var BottomCenter = function (gameObject, alignIn, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetCenterX(gameObject, GetCenterX(alignIn) + offsetX);
    SetBottom(gameObject, GetBottom(alignIn) + offsetY);

    return gameObject;
};

module.exports = BottomCenter;
