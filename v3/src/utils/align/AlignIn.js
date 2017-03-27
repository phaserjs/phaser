
var AlignInMap = {
    BOTTOM_CENTER: require('./InBottomCenter'),
    BOTTOM_LEFT: require('./InBottomLeft'),
    BOTTOM_RIGHT: require('./InBottomRight'),
    CENTER: require('./InCenter'),
    LEFT_CENTER: require('./InLeftCenter'),
    RIGHT_CENTER: require('./InRightCenter'),
    TOP_CENTER: require('./InTopCenter'),
    TOP_LEFT: require('./InTopLeft'),
    TOP_RIGHT: require('./InTopRight')
};

var AlignIn = function (child, container, position)
{
    return AlignInMap[position](child, container);
};

module.exports = AlignIn;
