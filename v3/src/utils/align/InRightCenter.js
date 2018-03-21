var GetRight = require('../bounds/GetRight');
var GetCenterY = require('../bounds/GetCenterY');
var SetRight = require('../bounds/SetRight');
var SetCenterY = require('../bounds/SetCenterY');

var InRightCenter = function (gameObject, container, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetRight(gameObject, GetRight(container) + offsetX);
    SetCenterY(gameObject, GetCenterY(container) + offsetY);

    return gameObject;
};

module.exports = InRightCenter;
