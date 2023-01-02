/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ALIGN_CONST = require('../const');

var AlignInMap = [];

AlignInMap[ALIGN_CONST.BOTTOM_CENTER] = require('./BottomCenter');
AlignInMap[ALIGN_CONST.BOTTOM_LEFT] = require('./BottomLeft');
AlignInMap[ALIGN_CONST.BOTTOM_RIGHT] = require('./BottomRight');
AlignInMap[ALIGN_CONST.CENTER] = require('./Center');
AlignInMap[ALIGN_CONST.LEFT_CENTER] = require('./LeftCenter');
AlignInMap[ALIGN_CONST.RIGHT_CENTER] = require('./RightCenter');
AlignInMap[ALIGN_CONST.TOP_CENTER] = require('./TopCenter');
AlignInMap[ALIGN_CONST.TOP_LEFT] = require('./TopLeft');
AlignInMap[ALIGN_CONST.TOP_RIGHT] = require('./TopRight');
AlignInMap[ALIGN_CONST.LEFT_BOTTOM] = AlignInMap[ALIGN_CONST.BOTTOM_LEFT];
AlignInMap[ALIGN_CONST.LEFT_TOP] = AlignInMap[ALIGN_CONST.TOP_LEFT];
AlignInMap[ALIGN_CONST.RIGHT_BOTTOM] = AlignInMap[ALIGN_CONST.BOTTOM_RIGHT];
AlignInMap[ALIGN_CONST.RIGHT_TOP] = AlignInMap[ALIGN_CONST.TOP_RIGHT];

/**
 * Takes given Game Object and aligns it so that it is positioned relative to the other.
 * The alignment used is based on the `position` argument, which is an `ALIGN_CONST` value, such as `LEFT_CENTER` or `TOP_RIGHT`.
 *
 * @function Phaser.Display.Align.In.QuickSet
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject} G - [child,$return]
 *
 * @param {Phaser.GameObjects.GameObject} child - The Game Object that will be positioned.
 * @param {Phaser.GameObjects.GameObject} alignIn - The Game Object to base the alignment position on.
 * @param {number} position - The position to align the Game Object with. This is an align constant, such as `ALIGN_CONST.LEFT_CENTER`.
 * @param {number} [offsetX=0] - Optional horizontal offset from the position.
 * @param {number} [offsetY=0] - Optional vertical offset from the position.
 *
 * @return {Phaser.GameObjects.GameObject} The Game Object that was aligned.
 */
var QuickSet = function (child, alignIn, position, offsetX, offsetY)
{
    return AlignInMap[position](child, alignIn, offsetX, offsetY);
};

module.exports = QuickSet;
