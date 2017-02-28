var GetLeft = require('../bounds/GetLeft');
var GetCenterY = require('../bounds/GetCenterY');
var SetRight = require('../bounds/SetRight');
var SetCenterY = require('../bounds/SetCenterY');

var ToLeftCenter = function (gameObject, parent, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetRight(gameObject, GetLeft(parent) - offsetX);
    SetCenterY(gameObject, GetCenterY(parent) + offsetY);

    return gameObject;
};

module.exports = ToLeftCenter;
