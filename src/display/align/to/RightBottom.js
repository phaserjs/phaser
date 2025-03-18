/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetBottom = require('../../bounds/GetBottom');
var GetRight = require('../../bounds/GetRight');
var SetBottom = require('../../bounds/SetBottom');
var SetLeft = require('../../bounds/SetLeft');

/**
 * Takes given Game Object and aligns it so that it is positioned next to the right bottom position of the other.
 *
 * @function Phaser.Display.Align.To.RightBottom
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
var RightBottom = function (gameObject, alignTo, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetLeft(gameObject, GetRight(alignTo) + offsetX);
    SetBottom(gameObject, GetBottom(alignTo) + offsetY);

    return gameObject;
};

module.exports = RightBottom;
