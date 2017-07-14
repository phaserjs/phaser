var Graphics = require('./Graphics');

var GraphicsFactory = function (scene, config)
{
    return new Graphics(scene, config);
};

module.exports = GraphicsFactory;
