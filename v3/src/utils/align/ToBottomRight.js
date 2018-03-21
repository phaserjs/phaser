var GetRight = require('../bounds/GetRight');
var GetBottom = require('../bounds/GetBottom');
var SetRight = require('../bounds/SetRight');
var SetTop = require('../bounds/SetTop');

var ToBottomRight = function (gameObject, parent, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetRight(gameObject, GetRight(parent) + offsetX);
    SetTop(gameObject, GetBottom(parent) + offsetY);

    return gameObject;
};

module.exports = ToBottomRight;
