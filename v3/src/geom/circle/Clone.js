var Circle = require('./Circle');

var Clone = function (source)
{
    return new Circle(source.x, source.y, source.radius);
};

module.exports = Clone;
