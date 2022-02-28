/**
 * @author       samme
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ALIGN_CONST = require('../const');

var AlignToMap = [];

AlignToMap[ALIGN_CONST.BOTTOM_CENTER] = require('./BottomCenter');
AlignToMap[ALIGN_CONST.BOTTOM_LEFT] = require('./BottomLeft');
AlignToMap[ALIGN_CONST.BOTTOM_RIGHT] = require('./BottomRight');
AlignToMap[ALIGN_CONST.LEFT_BOTTOM] = require('./LeftBottom');
AlignToMap[ALIGN_CONST.LEFT_CENTER] = require('./LeftCenter');
AlignToMap[ALIGN_CONST.LEFT_TOP] = require('./LeftTop');
AlignToMap[ALIGN_CONST.RIGHT_BOTTOM] = require('./RightBottom');
AlignToMap[ALIGN_CONST.RIGHT_CENTER] = require('./RightCenter');
AlignToMap[ALIGN_CONST.RIGHT_TOP] = require('./RightTop');
AlignToMap[ALIGN_CONST.TOP_CENTER] = require('./TopCenter');
AlignToMap[ALIGN_CONST.TOP_LEFT] = require('./TopLeft');
AlignToMap[ALIGN_CONST.TOP_RIGHT] = require('./TopRight');

/**
 * Takes a Game Object and aligns it next to another, at the given position.
 * The alignment used is based on the `position` argument, which is a `Phaser.Display.Align` property such as `LEFT_CENTER` or `TOP_RIGHT`.
 *
 * @function Phaser.Display.Align.To.QuickSet
 * @since 3.22.0
 *
 * @generic {Phaser.GameObjects.GameObject} G - [child,$return]
 *
 * @param {Phaser.GameObjects.GameObject} child - The Game Object that will be positioned.
 * @param {Phaser.GameObjects.GameObject} alignTo - The Game Object to base the alignment position on.
 * @param {number} position - The position to align the Game Object with. This is an align constant, such as `Phaser.Display.Align.LEFT_CENTER`.
 * @param {number} [offsetX=0] - Optional horizontal offset from the position.
 * @param {number} [offsetY=0] - Optional vertical offset from the position.
 *
 * @return {Phaser.GameObjects.GameObject} The Game Object that was aligned.
 */
var QuickSet = function (child, alignTo, position, offsetX, offsetY)
{
    return AlignToMap[position](child, alignTo, offsetX, offsetY);
};

module.exports = QuickSet;
