/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetBottom = require('../../bounds/GetBottom');
var GetLeft = require('../../bounds/GetLeft');
var SetBottom = require('../../bounds/SetBottom');
var SetRight = require('../../bounds/SetRight');

/**
 * Takes given Game Object and aligns it so that it is positioned next to the left bottom position of the other.
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
