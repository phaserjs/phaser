var Graphics = require('./Graphics');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var BuildGameObject = require('../BuildGameObject');

var GraphicsCreator = function (state, config)
{
    return new Graphics(state, config);
};

module.exports = GraphicsCreator;
