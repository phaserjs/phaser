var Polygon = require('./Polygon');

var Clone = function (polygon)
{
    return new Polygon(polygon.points);
};

module.exports = Clone;
