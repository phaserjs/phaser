var GetLeft = require('../bounds/GetLeft');
var GetBottom = require('../bounds/GetBottom');
var SetLeft = require('../bounds/SetLeft');
var SetTop = require('../bounds/SetTop');

var ToBottomLeft = function (gameObject, parent, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetLeft(gameObject, GetLeft(parent) - offsetX);
    SetTop(gameObject, GetBottom(parent) + offsetY);

    return gameObject;
};

module.exports = ToBottomLeft;
