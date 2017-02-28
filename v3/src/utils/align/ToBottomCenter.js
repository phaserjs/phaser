var GetCenterX = require('../bounds/GetCenterX');
var GetBottom = require('../bounds/GetBottom');
var SetCenterX = require('../bounds/SetCenterX');
var SetTop = require('../bounds/SetTop');

var ToBottomCenter = function (gameObject, parent, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetCenterX(gameObject, GetCenterX(parent) + offsetX);
    SetTop(gameObject, GetBottom(parent) + offsetY);

    return gameObject;
};

module.exports = ToBottomCenter;
