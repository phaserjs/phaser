/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetCenterY = require('../../bounds/GetCenterY');
var GetRight = require('../../bounds/GetRight');
var SetCenterY = require('../../bounds/SetCenterY');
var SetRight = require('../../bounds/SetRight');

/**
 * Takes given Game Object and aligns it so that it is positioned in the right center of the other.
 *
 * @function Phaser.Display.Align.In.RightCenter
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
var RightCenter = function (gameObject, alignIn, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetRight(gameObject, GetRight(alignIn) + offsetX);
    SetCenterY(gameObject, GetCenterY(alignIn) + offsetY);

    return gameObject;
};

module.exports = RightCenter;
