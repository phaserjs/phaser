var GetLeft = require('../bounds/GetLeft');
var GetBottom = require('../bounds/GetBottom');
var SetRight = require('../bounds/SetRight');
var SetBottom = require('../bounds/SetBottom');

var ToLeftBottom = function (gameObject, parent, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetRight(gameObject, GetLeft(parent) - offsetX);
    SetBottom(gameObject, GetBottom(parent) + offsetY);

    return gameObject;
};

module.exports = ToLeftBottom;
