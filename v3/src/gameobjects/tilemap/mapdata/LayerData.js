var Class = require('../../../utils/Class');
var GetFastValue = require('../../../utils/object/GetFastValue');

var LayerData = new Class({

    initialize:

    function MapLayerData (config)
    {
        if (config === undefined) { config = {}; }

        this.name = GetFastValue(config, 'name', 'layer');
        this.x = GetFastValue(config, 'x', 0);
        this.y = GetFastValue(config, 'y', 0);
        this.width = GetFastValue(config, 'width', 0);
        this.height = GetFastValue(config, 'height', 0);
        this.tileWidth = GetFastValue(config, 'tileWidth', 0);
        this.tileHeight = GetFastValue(config, 'tileHeight', 0);
        this.widthInPixels = GetFastValue(config, 'widthInPixels', this.width * this.tileWidth);
        this.heightInPixels = GetFastValue(config, 'heightInPixels', this.height * this.tileHeight);
        this.alpha = GetFastValue(config, 'alpha', 1);
        this.visible = GetFastValue(config, 'visible', true);
        this.properties = GetFastValue(config, 'properties', {});
        this.indexes = GetFastValue(config, 'indexes', []);
        this.collideIndexes = GetFastValue(config, 'collideIndexes', []);
        this.callbacks = GetFastValue(config, 'callbacks', []);
        this.bodies = GetFastValue(config, 'bodies', []);
        this.data = GetFastValue(config, 'data', []);
        this.tilemapLayer = GetFastValue(config, 'tilemapLayer', null);
    }

});

module.exports = LayerData;
