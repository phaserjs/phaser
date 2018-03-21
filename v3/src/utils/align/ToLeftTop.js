var GetLeft = require('../bounds/GetLeft');
var GetTop = require('../bounds/GetTop');
var SetRight = require('../bounds/SetRight');
var SetTop = require('../bounds/SetTop');

var ToLeftTop = function (gameObject, parent, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetRight(gameObject, GetLeft(parent) - offsetX);
    SetTop(gameObject, GetTop(parent) - offsetY);

    return gameObject;
};

module.exports = ToLeftTop;
