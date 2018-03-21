var Ellipse = require('./Ellipse');

var Clone = function (source)
{
    return new Ellipse(source.x, source.y, source.width, source.height);
};

module.exports = Clone;
