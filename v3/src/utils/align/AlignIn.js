var CONST = require('./const');

var AlignInMap = [];

AlignInMap[CONST.BOTTOM_CENTER] = require('./InBottomCenter');
AlignInMap[CONST.BOTTOM_LEFT] = require('./InBottomLeft');
AlignInMap[CONST.BOTTOM_RIGHT] = require('./InBottomRight');
AlignInMap[CONST.CENTER] = require('./InCenter');
AlignInMap[CONST.LEFT_CENTER] = require('./InLeftCenter');
AlignInMap[CONST.RIGHT_CENTER] = require('./InRightCenter');
AlignInMap[CONST.TOP_CENTER] = require('./InTopCenter');
AlignInMap[CONST.TOP_LEFT] = require('./InTopLeft');
AlignInMap[CONST.TOP_RIGHT] = require('./InTopRight');

var AlignIn = function (child, container, position, offsetX, offsetY)
{
    return AlignInMap[position](child, container, offsetX, offsetY);
};

module.exports = AlignIn;
