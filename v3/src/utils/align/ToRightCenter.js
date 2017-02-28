var GetRight = require('../bounds/GetRight');
var GetCenterY = require('../bounds/GetCenterY');
var SetLeft = require('../bounds/SetLeft');
var SetCenterY = require('../bounds/SetCenterY');

var ToRightTop = function (gameObject, parent, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetLeft(gameObject, GetRight(parent) + offsetX);
    SetCenterY(gameObject, GetCenterY(parent) + offsetY);

    return gameObject;
};

module.exports = ToRightTop;
