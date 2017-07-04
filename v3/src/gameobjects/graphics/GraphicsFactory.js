var Graphics = require('./Graphics');

var GraphicsFactory = function (state, config)
{
    return new Graphics(state, config);
};

module.exports = GraphicsFactory;
