var Rectangle = require('./Rectangle');

var Clone = function (source)
{
    return new Rectangle(source.x, source.y, source.width, source.height);
};

module.exports = Clone;
