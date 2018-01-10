var Class = require('../../../utils/Class');
var GetFastValue = require('../../../utils/object/GetFastValue');

var MapData = new Class({

    initialize:

    /**
     * A class for representing data about a map. Maps are parsed from CSV, Tiled, etc. into this
     * format. A Tilemap object get a copy of this data and then unpacks the needed properties into
     * itself.
     *
     * @class MapData
     * @constructor
     *
     * @param {object} [config] - [description]
     */
    function MapData (config)
    {
        if (config === undefined) { config = {}; }

        this.name = GetFastValue(config, 'name', 'map');
        this.width = GetFastValue(config, 'width', 0);
        this.height = GetFastValue(config, 'height', 0);
        this.tileWidth = GetFastValue(config, 'tileWidth', 0);
        this.tileHeight = GetFastValue(config, 'tileHeight', 0);
        this.widthInPixels = GetFastValue(config, 'widthInPixels', this.width * this.tileWidth);
        this.heightInPixels = GetFastValue(config, 'heightInPixels', this.height * this.tileHeight);
        this.format = GetFastValue(config, 'format', null);
        this.orientation = GetFastValue(config, 'orientation', 'orthogonal');
        this.version = GetFastValue(config, 'version', '1');
        this.properties = GetFastValue(config, 'properties', {});
        this.layers = GetFastValue(config, 'layers', []);
        this.images = GetFastValue(config, 'images', []);
        this.objects = GetFastValue(config, 'objects', {});
        this.collision = GetFastValue(config, 'collision', {});
        this.tilesets = GetFastValue(config, 'tilesets', []);
        this.imageCollections = GetFastValue(config, 'imageCollections', []);
        this.tiles = GetFastValue(config, 'tiles', []);
    }

});

module.exports = MapData;
