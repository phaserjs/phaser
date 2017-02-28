var GetLeft = require('../bounds/GetLeft');
var GetBottom = require('../bounds/GetBottom');
var SetLeft = require('../bounds/SetLeft');
var SetBottom = require('../bounds/SetBottom');

var InBottomLeft = function (gameObject, container, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetLeft(gameObject, GetLeft(container) - offsetX);
    SetBottom(gameObject, GetBottom(container) + offsetY);

    return gameObject;
};

module.exports = InBottomLeft;
