var GetLeft = require('../bounds/GetLeft');
var GetCenterY = require('../bounds/GetCenterY');
var SetLeft = require('../bounds/SetLeft');
var SetCenterY = require('../bounds/SetCenterY');

var InLeftCenter = function (gameObject, container, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetLeft(gameObject, GetLeft(container) - offsetX);
    SetCenterY(gameObject, GetCenterY(container) + offsetY);

    return gameObject;
};

module.exports = InLeftCenter;
