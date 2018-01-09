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

//  Phaser.Display.Align.In.QuickSet

var QuickSet = function (child, container, position, offsetX, offsetY)
{
    return AlignInMap[position](child, container, offsetX, offsetY);
};

module.exports = QuickSet;
