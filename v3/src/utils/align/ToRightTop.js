var GetRight = require('../bounds/GetRight');
var GetTop = require('../bounds/GetTop');
var SetLeft = require('../bounds/SetLeft');
var SetTop = require('../bounds/SetTop');

var ToRightTop = function (gameObject, parent, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetLeft(gameObject, GetRight(parent) + offsetX);
    SetTop(gameObject, GetTop(parent) - offsetY);

    return gameObject;
};

module.exports = ToRightTop;
