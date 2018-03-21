var GetRight = require('../bounds/GetRight');
var GetBottom = require('../bounds/GetBottom');
var SetRight = require('../bounds/SetRight');
var SetBottom = require('../bounds/SetBottom');

var InBottomRight = function (gameObject, container, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetRight(gameObject, GetRight(container) + offsetX);
    SetBottom(gameObject, GetBottom(container) + offsetY);

    return gameObject;
};

module.exports = InBottomRight;
