var GetCenterX = require('../bounds/GetCenterX');
var GetTop = require('../bounds/GetTop');
var SetCenterX = require('../bounds/SetCenterX');
var SetTop = require('../bounds/SetTop');

var InTopCenter = function (gameObject, container, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetCenterX(gameObject, GetCenterX(container) + offsetX);
    SetTop(gameObject, GetTop(container) - offsetY);

    return gameObject;
};

module.exports = InTopCenter;
