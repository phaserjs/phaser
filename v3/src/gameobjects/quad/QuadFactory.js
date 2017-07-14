var Quad = require('./Quad');

var QuadFactory = function (scene, x, y, key, frame)
{
    return new Quad(scene, x, y, key, frame);
};

module.exports = QuadFactory;
