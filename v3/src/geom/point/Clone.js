var Point = require('./Point');

var Clone = function (source)
{
    return new Point(source.x, source.y);
};

module.exports = Clone;
