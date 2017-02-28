var GetCenterX = require('../bounds/GetCenterX');
var GetCenterY = require('../bounds/GetCenterY');
var CenterOn = require('../bounds/CenterOn');

var InCenter = function (gameObject, container, offsetX, offsetY)
{
    if (offsetX === undefined) { offsetX = 0; }
    if (offsetY === undefined) { offsetY = 0; }

    CenterOn(gameObject, GetCenterX(container) + offsetX, GetCenterY(container) + offsetY);

    return gameObject;
};

module.exports = InCenter;
