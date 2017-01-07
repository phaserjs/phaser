var Polygon = require('./Polygon');

var Clone = function (polygon)
{
    return new Polygon(polygon._points);
};

module.exports = Clone;
