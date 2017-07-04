var TileSprite = require('./TileSprite');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var BuildGameObject = require('../BuildGameObject');

var TileSpriteCreator = function (state, config)
{
    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var width = GetAdvancedValue(config, 'width', 512);
    var height = GetAdvancedValue(config, 'height', 512);
    var key = GetAdvancedValue(config, 'key', '');
    var frame = GetAdvancedValue(config, 'frame', '');

    var tile = new TileSprite(state, x, y, width, height, key, frame);

    BuildGameObject(state, tile, config);

    return tile;
};

module.exports = TileSpriteCreator;
