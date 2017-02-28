var GetLeft = require('../bounds/GetLeft');
var GetTop = require('../bounds/GetTop');
var SetLeft = require('../bounds/SetLeft');
var SetTop = require('../bounds/SetTop');

var InTopLeft = function (gameObject, container, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    SetLeft(gameObject, GetLeft(container) - offsetX);
    SetTop(gameObject, GetTop(container) - offsetY);

    return gameObject;
};

module.exports = InTopLeft;
