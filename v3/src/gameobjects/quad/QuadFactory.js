var Quad = require('./Quad');

var QuadFactory = function (state, x, y, key, frame)
{
    return new Quad(state, x, y, key, frame);
};

module.exports = QuadFactory;
