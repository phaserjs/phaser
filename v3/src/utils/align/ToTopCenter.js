var GetCenterX = require('../bounds/GetCenterX');
var GetTop = require('../bounds/GetTop');
var SetCenterX = require('../bounds/SetCenterX');
var SetBottom = require('../bounds/SetBottom');

var ToTopCenter = function (gameObject, parent, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetCenterX(gameObject, GetCenterX(parent) + offsetX);
    SetBottom(gameObject, GetTop(parent) - offsetY);

    return gameObject;
};

module.exports = ToTopCenter;
