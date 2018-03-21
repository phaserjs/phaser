var GetRight = require('../bounds/GetRight');
var GetBottom = require('../bounds/GetBottom');
var SetLeft = require('../bounds/SetLeft');
var SetBottom = require('../bounds/SetBottom');

var ToRightBottom = function (gameObject, parent, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetLeft(gameObject, GetRight(parent) + offsetX);
    SetBottom(gameObject, GetBottom(parent) + offsetY);

    return gameObject;
};

module.exports = ToRightBottom;
