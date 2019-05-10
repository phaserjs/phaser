/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetRight = require('../../bounds/GetRight');
var GetTop = require('../../bounds/GetTop');
var SetLeft = require('../../bounds/SetLeft');
var SetTop = require('../../bounds/SetTop');

/**
 * Takes given Game Object and aligns it so that it is positioned next to the right top position of the other.
 *
 * @function Phaser.Display.Align.To.RightTop
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
var RightTop = function (gameObject, alignTo, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetLeft(gameObject, GetRight(alignTo) + offsetX);
    SetTop(gameObject, GetTop(alignTo) - offsetY);

    return gameObject;
};

module.exports = RightTop;
