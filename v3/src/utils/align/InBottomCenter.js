var GetCenterX = require('../bounds/GetCenterX');
var GetBottom = require('../bounds/GetBottom');
var SetCenterX = require('../bounds/SetCenterX');
var SetBottom = require('../bounds/SetBottom');

var InBottomCenter = function (gameObject, container, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetCenterX(gameObject, GetCenterX(container) + offsetX);
    SetBottom(gameObject, GetBottom(container) + offsetY);

    return gameObject;
};

module.exports = InBottomCenter;
