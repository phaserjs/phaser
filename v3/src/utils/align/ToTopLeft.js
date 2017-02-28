var GetLeft = require('../bounds/GetLeft');
var GetTop = require('../bounds/GetTop');
var SetLeft = require('../bounds/SetLeft');
var SetBottom = require('../bounds/SetBottom');

var ToTopLeft = function (gameObject, parent, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetLeft(gameObject, GetLeft(parent) - offsetX);
    SetBottom(gameObject, GetTop(parent) - offsetY);

    return gameObject;
};

module.exports = ToTopLeft;
