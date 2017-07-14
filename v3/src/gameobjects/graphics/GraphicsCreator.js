var Graphics = require('./Graphics');

var GraphicsCreator = function (scene, config)
{
    return new Graphics(scene, config);
};

module.exports = GraphicsCreator;
