/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetCenterY = require('../../bounds/GetCenterY');
var GetLeft = require('../../bounds/GetLeft');
var SetCenterY = require('../../bounds/SetCenterY');
var SetRight = require('../../bounds/SetRight');

/**
 * Takes a given Game Object and aligns it so that its right edge touches the left edge of the `alignTo` Game Object, with their vertical centers matched.
 *
 * @function Phaser.Display.Align.To.LeftCenter
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
var LeftCenter = function (gameObject, alignTo, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetRight(gameObject, GetLeft(alignTo) - offsetX);
    SetCenterY(gameObject, GetCenterY(alignTo) + offsetY);

    return gameObject;
};

module.exports = LeftCenter;
