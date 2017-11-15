var Class = require('../../utils/Class');
var GenerateEmptyMapData = require('./GenerateEmptyMapData');
var StaticTilemapLayer = require('./staticlayer/StaticTilemapLayer.js');
var DynamicTilemapLayer = require('./dynamiclayer/DynamicTilemapLayer.js');
var Tileset = require('./Tileset');
var Formats = require('./Formats');
var TilemapComponents = require('./components');

var Tilemap = new Class({

    initialize:

    function Tilemap (scene, mapData, tileWidth, tileHeight, width, height)
    {
        this.scene = scene;

        if (mapData === null)
        {
            mapData = GenerateEmptyMapData(tileWidth, tileHeight, width, height);
        }

        this.tilesets = [];
        this.tileWidth = mapData.tileWidth;
        this.tileHeight = mapData.tileHeight;

        this.width = mapData.width;
        this.height = mapData.height;
        this.orientation = mapData.orientation;
        this.format = mapData.format;
        this.version = mapData.version;
        this.properties = mapData.properties;
        this.widthInPixels = mapData.widthInPixels;
        this.heightInPixels = mapData.heightInPixels;
        this.layers = mapData.layers;
        this.tilesets = mapData.tilesets;
        this.tiles = mapData.tiles;
        this.objects = mapData.objects;
        this.currentLayerIndex = 0;

        // TODO: collision, collideIndexes, imagecollections, images
        // TODO: debugging methods
    },

    addTilesetImage: function (tilesetName, key, tileWidth, tileHeight, tileMargin, tileSpacing, gid)
    {
        if (tilesetName === undefined) { return null; }
        if (key === undefined || key === null) { key = tilesetName; }
        if (tileWidth === undefined) { tileWidth = this.tileWidth; }
        if (tileHeight === undefined) { tileHeight = this.tileHeight; }
        if (tileMargin === undefined) { tileMargin = 0; }
        if (tileSpacing === undefined) { tileSpacing = 0; }
        if (gid === undefined) { gid = 0; }

        //  In-case we're working from a blank map
        if (tileWidth === 0) { tileWidth = 32; }
        if (tileHeight === 0) { tileHeight = 32; }

        if (!this.scene.sys.textures.exists(key))
        {
            console.warn('Invalid image key given for tileset: "' + key + '"');
            return null;
        }

        var texture = this.scene.sys.textures.get(key);

        // TODO: potentially add in v2 support for bitmap data

        var index = this.getTilesetIndex(tilesetName);

        if (index === null && this.format === Formats.TILED_JSON)
        {
            console.warn('No data found in the JSON tilemap from Tiled matching the tileset name: "' + tilesetName + '"');
            return null;
        }

        if (this.tilesets[index])
        {
            this.tilesets[index].setImage(texture);
            return this.tilesets[index];
        }
        else
        {
            var tileset = new Tileset(tilesetName, gid, tileWidth, tileHeight, tileMargin, tileSpacing, {});
            tileset.setImage(texture);

            this.tilesets.push(tileset);

            // TODO: add in GID & master list of tiles
        }

        return tileset;
    },

    createStaticLayer: function (layerID, tileset, x, y)
    {
        var index = this.getLayerIndex(layerID);

        if (index === null)
        {
            console.warn('Cannot create tilemap layer: invalid layer ID given: ' + index);
            return;
        }

        // TODO: new feature, allow multiple CSV layers
        // TODO: display dimension

        var layer = new StaticTilemapLayer(this.scene, this, index, tileset, x, y);
        this.scene.sys.displayList.add(layer);
        return layer;
    },

    createDynamicLayer: function (layerID, tileset, x, y)
    {
        var index = this.getLayerIndex(layerID);

        if (index === null)
        {
            console.warn('Cannot create tilemap layer: invalid layer ID given: ' + index);
            return;
        }

        // TODO: new feature, allow multiple CSV layers
        // TODO: display dimension

        var layer = new DynamicTilemapLayer(this.scene, this, index, tileset, x, y);
        this.scene.sys.displayList.add(layer);
        return layer;
    },

    getIndex: function (location, name)
    {
        for (var i = 0; i < location.length; i++)
        {
            if (location[i].name === name)
            {
                return i;
            }
        }
        return null;
    },

    getLayer: function (layer)
    {
        var index = this.getLayerIndex(layer);
        return index !== null ? this.layers[index] : null;
    },

    getLayerIndex: function (layer)
    {
        if (layer === undefined)
        {
            return this.currentLayerIndex;
        }
        else if (typeof layer === 'string')
        {
            return this.getLayerIndexByName(layer);
        }
        else if (typeof layer === 'number' && layer < this.layers.length)
        {
            return layer;
        }
        else if (layer instanceof StaticTilemapLayer || layer instanceof DynamicTilemapLayer)
        {
            return layer.layerIndex;
        }
        else
        {
            return null;
        }
    },

    getLayerIndexByName: function (name)
    {
        return this.getIndex(this.layers, name);
    },

    getTileAt: function (tileX, tileY, layer, nonNull)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return null; }

        return TilemapComponents.GetTileAt(tileX, tileY, layer, nonNull);
    },

    getTilesetIndex: function (name)
    {
        return this.getIndex(this.tilesets, name);
    },

    hasTileAt: function (tileX, tileY, layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return null; }

        return TilemapComponents.HasTileAt(tileX, tileY, layer);
    },

    layer: {
        get: function ()
        {
            return this.layers[this.currentLayerIndex];
        },

        set: function (layer)
        {
            this.setLayer(layer);
        }
    },

    setLayer: function (layer)
    {
        var index = this.getLayerIndex(layer);
        if (index !== null)
        {
            this.currentLayerIndex = index;
        }
        return this;
    }

});

module.exports = Tilemap;
