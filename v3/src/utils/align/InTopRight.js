var GetRight = require('../bounds/GetRight');
var GetTop = require('../bounds/GetTop');
var SetRight = require('../bounds/SetRight');
var SetTop = require('../bounds/SetTop');

var InTopRight = function (gameObject, container, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetRight(gameObject, GetRight(container) + offsetX);
    SetTop(gameObject, GetTop(container) - offsetY);

    return gameObject;
};

module.exports = InTopRight;
