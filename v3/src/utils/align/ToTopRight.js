var GetRight = require('../bounds/GetRight');
var GetTop = require('../bounds/GetTop');
var SetRight = require('../bounds/SetRight');
var SetBottom = require('../bounds/SetBottom');

var ToTopRight = function (gameObject, parent, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetRight(gameObject, GetRight(parent) + offsetX);
    SetBottom(gameObject, GetTop(parent) - offsetY);

    return gameObject;
};

module.exports = ToTopRight;
