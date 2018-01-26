var Class = require('../../utils/Class');
var Extend = require('../../utils/object/Extend');
var LayerData = require('./mapdata/LayerData');
var StaticTilemapLayer = require('./staticlayer/StaticTilemapLayer.js');
var DynamicTilemapLayer = require('./dynamiclayer/DynamicTilemapLayer.js');
var Tileset = require('./Tileset');
var Formats = require('./Formats');
var TilemapComponents = require('./components');
var Tile = require('./Tile');
var Rotate = require('../../math/Rotate');
var DegToRad = require('../../math/DegToRad');

var Tilemap = new Class({

    initialize:

    /**
     * A Tilemap is a container for Tilemap data. This isn't a display object, rather, it holds data
     * about the map and allows you to add tilesets and tilemap layers to it. A map can have one or
     * more tilemap layers (StaticTilemapLayer or DynamicTilemapLayer), which are the display
     * objects that actually render tiles.
     *
     * The Tilemap data be parsed from a Tiled JSON file, a CSV file or a 2D array. Tiled is a free
     * software package specifically for creating tile maps, and is available from:
     * http://www.mapeditor.org
     *
     * A Tilemap has handy methods for getting & manipulating the tiles within a layer. You can only
     * use the methods that change tiles (e.g. removeTileAt) on a DynamicTilemapLayer.
     *
     * Note that all Tilemaps use a base tile size to calculate dimensions from, but that a
     * StaticTilemapLayer or DynamicTilemapLayer may have its own unique tile size that overrides
     * it.
     *
     * @class Tilemap
     * @constructor
     *
     * @param {Scene} scene - [description]
     * @param {MapData} mapData - A MapData instance containing Tilemap data.
     */
    function Tilemap (scene, mapData)
    {
        /**
         * @property {Scene} Scene
         */
        this.scene = scene;

        /**
         * The base width of a tile in pixels. Note that individual layers may have a different tile
         * width.
         * @property {integer} tileWidth
         */
        this.tileWidth = mapData.tileWidth;

        /**
         * The base height of a tile in pixels. Note that individual layers may have a different
         * tile height.
         * @property {integer} tileHeight
         */
        this.tileHeight = mapData.tileHeight;

        /**
         * The width of the map (in tiles).
         * @property {number} width
         */
        this.width = mapData.width;

        /**
         * The height of the map (in tiles).
         * @property {number} width
         */
        this.height = mapData.height;

        /**
         * The orientation of the map data (as specified in Tiled), usually 'orthogonal'.
         * @property {string} orientation
         */
        this.orientation = mapData.orientation;

        /**
         * @property {number} format - The format of the map data.
         */
        this.format = mapData.format;

        /**
         * The version of the map data (as specified in Tiled, usually 1).
         * @property {number} version
         */
        this.version = mapData.version;

        /**
         * Map specific properties as specified in Tiled.
         * @property {object} properties
         */
        this.properties = mapData.properties;

        /**
         * The width of the map in pixels based on width * tileWidth.
         * @property {number} widthInPixels
         */
        this.widthInPixels = mapData.widthInPixels;

        /**
         * The height of the map in pixels based on height * tileHeight.
         * @property {number} heightInPixels
         */
        this.heightInPixels = mapData.heightInPixels;

        /**
         * @property {ImageCollection[]} imagecollections
         */
        this.imageCollections = mapData.imageCollections;

        /**
         * An array of Tiled Image Layers.
         * @property {array} images
         */
        this.images = mapData.images;

        /**
         * An array of collision data. Specifically, any polyline objects defined in object layers.
         * @property {array} collision
         */
        this.collision = mapData.collision; // Note: this probably isn't useful anymore

        /**
         * @property {LayerData[]} layers - An array of Tilemap layer data.
         */
        this.layers = mapData.layers;

        /**
         * An array of Tilesets used in the map.
         * @property {Tileset[]} tilesets
         */
        this.tilesets = mapData.tilesets;

        /**
         * An array of Tiled Object Layers.
         * @property {array} objects
         */
        this.objects = mapData.objects;

        /**
         * The index of the currently selected LayerData object.
         * @property {integer} currentLayerIndex
         */
        this.currentLayerIndex = 0;
    },

    /**
     * Adds an image to the map to be used as a tileset. A single map may use multiple tilesets.
     * Note that the tileset name can be found in the JSON file exported from Tiled, or in the Tiled
     * editor.
     *
     * @param {string} tilesetName - The name of the tileset as specified in the map data.
     * @param {string} [key] - The key of the Phaser.Cache image used for this tileset. If
     * `undefined` or `null` it will look for an image with a key matching the tileset parameter.
     * @param {integer} [tileWidth] - The width of the tile (in pixels) in the Tileset Image. If not
     * given it will default to the map's tileWidth value, or the tileWidth specified in the Tiled
     * JSON file.
     * @param {integer} [tileHeight] - The height of the tiles (in pixels) in the Tileset Image. If
     * not given it will default to the map's tileHeight value, or the tileHeight specified in the
     * Tiled JSON file.
     * @param {integer} [tileMargin] - The margin around the tiles in the sheet (in pixels). If not
     * specified, it will default to 0 or the value specified in the Tiled JSON file.
     * @param {integer} [tileSpacing] - The spacing between each the tile in the sheet (in pixels).
     * If not specified, it will default to 0 or the value specified in the Tiled JSON file.
     * @param {integer} [gid=0] - If adding multiple tilesets to a blank map, specify the starting
     * GID this set will use here.
     * @return {Tileset|null} Returns the Tileset object that was created or updated, or null if it
     * failed.
     */
    addTilesetImage: function (tilesetName, key, tileWidth, tileHeight, tileMargin, tileSpacing, gid)
    {
        if (tilesetName === undefined) { return null; }
        if (key === undefined || key === null) { key = tilesetName; }

        if (!this.scene.sys.textures.exists(key))
        {
            console.warn('Invalid image key given for tileset: "' + key + '"');
            return null;
        }

        var texture = this.scene.sys.textures.get(key);

        var index = this.getTilesetIndex(tilesetName);

        if (index === null && this.format === Formats.TILED_JSON)
        {
            console.warn('No data found in the JSON tilemap from Tiled matching the tileset name: "' + tilesetName + '"');
            return null;
        }

        if (this.tilesets[index])
        {
            this.tilesets[index].setTileSize(tileWidth, tileHeight);
            this.tilesets[index].setSpacing(tileMargin, tileSpacing);
            this.tilesets[index].setImage(texture);
            return this.tilesets[index];
        }

        if (tileWidth === undefined) { tileWidth = this.tileWidth; }
        if (tileHeight === undefined) { tileHeight = this.tileHeight; }
        if (tileMargin === undefined) { tileMargin = 0; }
        if (tileSpacing === undefined) { tileSpacing = 0; }
        if (gid === undefined) { gid = 0; }

        var tileset = new Tileset(tilesetName, gid, tileWidth, tileHeight, tileMargin, tileSpacing);
        tileset.setImage(texture);
        this.tilesets.push(tileset);
        return tileset;
    },

    /**
     * Turns the StaticTilemapLayer associated with the given layer into a DynamicTilemapLayer. If
     * no layer specified, the map's current layer is used. This is useful if you want to manipulate
     * a map at the start of a scene, but then make it non-manipulable and optimize it for speed.
     * Note: the DynamicTilemapLayer passed in is destroyed, so make sure to store the value
     * returned from this method if you want to manipulate the new StaticTilemapLayer.
     *
     * @param {string|integer|DynamicTilemapLayer} [layer] - The name of the layer from Tiled, the
     * index of the layer in the map, or a StaticTilemapLayer.
     * @return {StaticTilemapLayer|null} Returns the new layer that was created, or null if it
     * failed.
     */
    convertLayerToStatic: function (layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return null; }

        var dynamicLayer = layer.tilemapLayer;

        if (!dynamicLayer || !(dynamicLayer instanceof DynamicTilemapLayer))
        {
            return null;
        }

        var staticLayer = new StaticTilemapLayer(dynamicLayer.scene, dynamicLayer.tilemap,
            dynamicLayer.layerIndex, dynamicLayer.tileset, dynamicLayer.x, dynamicLayer.y);
        this.scene.sys.displayList.add(staticLayer);

        dynamicLayer.destroy();

        return staticLayer;
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used. This
     * cannot be applied to StaticTilemapLayers.
     *
     * @return {this|null} Returns this, or null if the layer given was invalid.
     */
    copy: function (srcTileX, srcTileY, width, height, destTileX, destTileY, recalculateFaces, layer)
    {
        layer = this.getLayer(layer);
        if (this._isStaticCall(layer, 'copy')) { return this; }
        if (layer !== null)
        {
            TilemapComponents.Copy(srcTileX, srcTileY, width, height, destTileX, destTileY,
                recalculateFaces, layer);
        }
        return this;
    },

    /**
     * Creates a new and empty DynamicTilemapLayer. The currently selected layer in the map is set
     * to this new layer.
     *
     * @param {string} name - The name of this layer. Must be unique within the map.
     * @param {Tileset} tileset - The tileset the new layer will use.
     * @param {integer} width - The width of the layer in tiles. If not specified, it will default
     * to the map's width.
     * @param {integer} height - The height of the layer in tiles. If not specified, it will default
     * to the map's height.
     * @param {integer} tileWidth - The width of the tiles the layer uses for calculations. If not
     * specified, it will default to the map's tileWidth.
     * @param {integer} tileHeight - The height of the tiles the layer uses for calculations. If not
     * specified, it will default to the map's tileHeight.
     * @return {DynamicTilemapLayer|null} Returns the new layer was created, or null if it failed.
     */
    createBlankDynamicLayer: function (name, tileset, x, y, width, height, tileWidth, tileHeight)
    {
        if (tileWidth === undefined) { tileWidth = tileset.tileWidth; }
        if (tileHeight === undefined) { tileHeight = tileset.tileHeight; }
        if (width === undefined) { width = this.width; }
        if (height === undefined) { height = this.height; }
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        var index = this.getLayerIndex(name);

        if (index !== null)
        {
            console.warn('Cannot create blank layer: layer with matching name already exists ' + name);
            return null;
        }

        var layerData = new LayerData({
            name: name,
            tileWidth: tileWidth,
            tileHeight: tileHeight,
            width: width,
            height: height
        });

        var row;
        for (var tileY = 0; tileY < height; tileY++)
        {
            row = [];
            for (var tileX = 0; tileX < width; tileX++)
            {
                row.push(new Tile(layerData, -1, tileX, tileY, tileWidth, tileHeight,
                    this.tileWidth, this.tileHeight));
            }
            layerData.data.push(row);
        }

        this.layers.push(layerData);
        this.currentLayerIndex = this.layers.length - 1;

        var dynamicLayer = new DynamicTilemapLayer(this.scene, this, this.currentLayerIndex, tileset, x, y);
        this.scene.sys.displayList.add(dynamicLayer);

        return dynamicLayer;
    },

    /**
     * Creates a new DynamicTilemapLayer that renders the LayerData associated with the given
     * `layerID`. The currently selected layer in the map is set to this new layer.
     *
     * The `layerID` is important. If you've created your map in Tiled then you can get this by
     * looking in Tiled and looking at the layer name. Or you can open the JSON file it exports and
     * look at the layers[].name value. Either way it must match.
     *
     * Unlike a static layer, a dynamic layer can be modified. See DynamicTilemapLayer for more
     * information.
     *
     * @param {integer|string} layerID - The layer array index value, or if a string is given, the
     * layer name from Tiled.
     * @param {Tileset} tileset - The tileset the new layer will use.
     * @param {number} x - The x position to place the layer in the world. If not specified, it will
     * default to the layer offset from Tiled or 0.
     * @param {number} y - The y position to place the layer in the world. If not specified, it will
     * default to the layer offset from Tiled or 0.
     * @return {DynamicTilemapLayer|null} Returns the new layer was created, or null if it failed.
     */
    createDynamicLayer: function (layerID, tileset, x, y)
    {
        var index = this.getLayerIndex(layerID);

        if (index === null)
        {
            console.warn('Cannot create tilemap layer, invalid layer ID given: ' + layerID);
            return null;
        }

        var layerData = this.layers[index];

        // Check for an associated static or dynamic tilemap layer
        if (layerData.tilemapLayer)
        {
            console.warn('Cannot create dynamic tilemap layer since a static or dynamic tilemap layer exists for layer ID:' + layerID);
            return null;
        }

        this.currentLayerIndex = index;

        // Make sure that all the LayerData & the tiles have the correct tile size. They usually
        // are, but wouldn't match if you try to load a 2x or 4x res tileset when the map was made
        // with a 1x res tileset.
        if (layerData.tileWidth !== tileset.tileWidth || layerData.tileHeight !== tileset.tileHeight)
        {
            this.setLayerTileSize(tileset.tileWidth, tileset.tileHeight, index);
        }

        // Default the x/y position to match Tiled layer offset, if it exists.
        if (x === undefined && this.layers[index].x) { x = this.layers[index].x; }
        if (y === undefined && this.layers[index].y) { y = this.layers[index].y; }

        var layer = new DynamicTilemapLayer(this.scene, this, index, tileset, x, y);
        this.scene.sys.displayList.add(layer);

        return layer;
    },

    /**
     * Creates a Sprite for every object matching the given gid in the map data. All properties from
     * the map data objectgroup are copied into the `spriteConfig`, so you can use this as an easy
     * way to configure Sprite properties from within the map editor. For example giving an object a
     * property of alpha: 0.5 in the map editor will duplicate that when the Sprite is created.
     *
     * @param {string} name - The name of the object layer (from Tiled) to create Sprites from.
     * @param {integer|string} id - Either the id (object), gid (tile object) or name (object or
     * tile object) from Tiled. Ids are unique in Tiled, but a gid is shared by all tile objects
     * with the same graphic. The same name can be used on multiple objects.
     * @param {object} spriteConfig - The config object to pass into the Sprite creator (i.e.
     * scene.make.sprite).
     * @param {Scene} [scene=the scene the map is within] - The Scene to create the Sprites within.
     * @return {Sprite[]} An array of the Sprites that were created.
     */
    createFromObjects: function (name, id, spriteConfig, scene)
    {
        if (spriteConfig === undefined) { spriteConfig = {}; }
        if (scene === undefined) { scene = this.scene; }

        if (!this.objects[name])
        {
            console.warn('Cannot create from object. Invalid objectgroup name given: ' + name);
            return;
        }

        var sprites = [];

        for (var i = 0; i < this.objects[name].length; i++)
        {
            var found = false;
            var obj = this.objects[name][i];

            if (obj.gid !== undefined && typeof id === 'number' && obj.gid === id ||
                obj.id !== undefined && typeof id === 'number' && obj.id === id ||
                obj.name !== undefined && typeof id === 'string' && obj.name === id)
            {
                found = true;
            }

            if (found)
            {
                var config = Extend({}, spriteConfig, obj.properties);

                config.x = obj.x;
                config.y = obj.y;

                var sprite = this.scene.make.sprite(config);

                sprite.name = obj.name;

                if (obj.width) { sprite.displayWidth = obj.width; }
                if (obj.height) { sprite.displayHeight = obj.height; }

                // Origin is (0, 1) in Tiled, so find the offset that matches the Sprite's origin.
                var offset = {
                    x: sprite.originX * sprite.displayWidth,
                    y: (sprite.originY - 1) * sprite.displayHeight
                };

                // If the object is rotated, then the origin offset also needs to be rotated.
                if (obj.rotation)
                {
                    var angle = DegToRad(obj.rotation);
                    Rotate(offset, angle);
                    sprite.rotation = angle;
                }

                sprite.x += offset.x;
                sprite.y += offset.y;

                if (obj.flippedHorizontal !== undefined || obj.flippedVertical !== undefined)
                {
                    sprite.setFlip(obj.flippedHorizontal, obj.flippedVertical);
                }

                if (!obj.visible) { sprite.visible = false; }

                sprites.push(sprite);
            }
        }

        return sprites;
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used.
     *
     * @return {Sprite[]|null} Returns an array of Tiles, or null if the layer given was invalid.
     */
    createFromTiles: function (indexes, replacements, spriteConfig, scene, camera, layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return null; }
        return TilemapComponents.CreateFromTiles(indexes, replacements, spriteConfig, scene, camera, layer);
    },

    /**
     * Creates a new StaticTilemapLayer that renders the LayerData associated with the given
     * `layerID`. The currently selected layer in the map is set to this new layer.
     *
     * The `layerID` is important. If you've created your map in Tiled then you can get this by
     * looking in Tiled and looking at the layer name. Or you can open the JSON file it exports and
     * look at the layers[].name value. Either way it must match.
     *
     * It's important to remember that a static layer cannot be modified. See StaticTilemapLayer for
     * more information.
     *
     * @param {integer|string} layerID - The layer array index value, or if a string is given, the
     * layer name from Tiled.
     * @param {Tileset} tileset - The tileset the new layer will use.
     * @param {number} x - The x position to place the layer in the world. If not specified, it will
     * default to the layer offset from Tiled or 0.
     * @param {number} y - The y position to place the layer in the world. If not specified, it will
     * default to the layer offset from Tiled or 0.
     * @return {StaticTilemapLayer|null} Returns the new layer was created, or null if it failed.
     */
    createStaticLayer: function (layerID, tileset, x, y)
    {
        var index = this.getLayerIndex(layerID);

        if (index === null)
        {
            console.warn('Cannot create tilemap layer, invalid layer ID given: ' + layerID);
            return null;
        }

        var layerData = this.layers[index];

        // Check for an associated static or dynamic tilemap layer
        if (layerData.tilemapLayer)
        {
            console.warn('Cannot create static tilemap layer since a static or dynamic tilemap layer exists for layer ID:' + layerID);
            return null;
        }

        this.currentLayerIndex = index;

        // Make sure that all the LayerData & the tiles have the correct tile size. They usually
        // are, but wouldn't match if you try to load a 2x or 4x res tileset when the map was made
        // with a 1x res tileset.
        if (layerData.tileWidth !== tileset.tileWidth || layerData.tileHeight !== tileset.tileHeight)
        {
            this.setLayerTileSize(tileset.tileWidth, tileset.tileHeight, index);
        }

        // Default the x/y position to match Tiled layer offset, if it exists.
        if (x === undefined && this.layers[index].x) { x = this.layers[index].x; }
        if (y === undefined && this.layers[index].y) { y = this.layers[index].y; }

        var layer = new StaticTilemapLayer(this.scene, this, index, tileset, x, y);
        this.scene.sys.displayList.add(layer);

        return layer;
    },

    /**
     * Removes all layer data from this Tilemap and nulls the scene reference. This will destroy any
     * StaticTilemapLayers or DynamicTilemapLayers that have been linked to LayerData.
     */
    destroy: function ()
    {
        this.removeAllLayers();
        this.tilesets.length = 0;
        this.objects.length = 0;
        this.scene = undefined;
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used. This
     * cannot be applied to StaticTilemapLayers.
     *
     * @return {this|null} Returns this, or null if the layer given was invalid.
     */
    fill: function (index, tileX, tileY, width, height, recalculateFaces, layer)
    {
        layer = this.getLayer(layer);
        if (this._isStaticCall(layer, 'fill')) { return this; }
        if (layer !== null)
        {
            TilemapComponents.Fill(index, tileX, tileY, width, height, recalculateFaces, layer);
        }
        return this;
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used.
     *
     * @return {Tile[]|null} Returns an array of Tiles, or null if the layer given was invalid.
     */
    filterTiles: function (callback, context, tileX, tileY, width, height, filteringOptions, layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return null; }
        return TilemapComponents.FilterTiles(callback, context, tileX, tileY, width, height, filteringOptions, layer);
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used.
     *
     * @return {Tile|null} Returns a Tiles, or null if the layer given was invalid.
     */
    findByIndex: function (findIndex, skip, reverse, layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return null; }
        return TilemapComponents.FindByIndex(findIndex, skip, reverse, layer);
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used.
     *
     * @return {Tile|null} Returns a Tiles, or null if the layer given was invalid.
     */
    findTile: function (callback, context, tileX, tileY, width, height, filteringOptions, layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return null; }
        return TilemapComponents.FindTile(callback, context, tileX, tileY, width, height, filteringOptions, layer);
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used.
     *
     * @return {this|null} Returns this, or null if the layer given was invalid.
     */
    forEachTile: function (callback, context, tileX, tileY, width, height, filteringOptions, layer)
    {
        layer = this.getLayer(layer);
        if (layer !== null)
        {
            TilemapComponents.ForEachTile(callback, context, tileX, tileY, width, height, filteringOptions, layer);
        }
        return this;
    },

    /**
     * Gets the image layer index based on its name.
     *
     * @method Phaser.Tilemap#getImageIndex
     * @param {string} name - The name of the image to get.
     * @return {integer} The index of the image in this tilemap, or null if not found.
     */
    getImageIndex: function (name)
    {
        return this.getIndex(this.images, name);
    },

    /**
     * Internally used. Returns the index of the object in one of the Tilemap's arrays whose name
     * property matches the given `name`.
     *
     * @param {array} location - The Tilemap array to search.
     * @param {string} name - The name of the array element to get.
     * @return {number} The index of the element in the array, or null if not found.
     */
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

    /**
     * Gets the LayerData from this.layers that is associated with `layer`, or null if an invalid
     * `layer` is given.
     *
     * @param {string|integer|DynamicTilemapLayer|StaticTilemapLayer} [layer] - The name of the
     * layer from Tiled, the index of the layer in the map, a DynamicTilemapLayer or a
     * StaticTilemapLayer. If not given will default to the map's current layer index.
     * @return {LayerData} The corresponding LayerData within this.layers.
     */
    getLayer: function (layer)
    {
        var index = this.getLayerIndex(layer);
        return index !== null ? this.layers[index] : null;
    },

    /**
     * Gets the LayerData index of the given `layer` within this.layers, or null if an invalid
     * `layer` is given.
     *
     * @param {string|integer|DynamicTilemapLayer|StaticTilemapLayer} [layer] - The name of the
     * layer from Tiled, the index of the layer in the map, a DynamicTilemapLayer or a
     * StaticTilemapLayer. If not given will default to the map's current layer index.
     * @return {integer} The LayerData index within this.layers.
     */
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

    /**
     * Gets the index of the LayerData within this.layers that has the given `name`, or null if an
     * invalid `name` is given.
     *
     * @param {string} name - The name of the layer to get.
     * @return {integer} The LayerData index within this.layers.
     */
    getLayerIndexByName: function (name)
    {
        return this.getIndex(this.layers, name);
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used.
     *
     * @return {Tile|null} Returns a Tile, or null if the layer given was invalid.
     */
    getTileAt: function (tileX, tileY, nonNull, layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return null; }
        return TilemapComponents.GetTileAt(tileX, tileY, nonNull, layer);
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used.
     *
     * @return {Tile|null} Returns a Tile, or null if the layer given was invalid.
     */
    getTileAtWorldXY: function (worldX, worldY, nonNull, camera, layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return null; }
        return TilemapComponents.GetTileAtWorldXY(worldX, worldY, nonNull, camera, layer);
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used.
     *
     * @return {Tile[]|null} Returns an array of Tiles, or null if the layer given was invalid.
     */
    getTilesWithin: function (tileX, tileY, width, height, filteringOptions, layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return null; }
        return TilemapComponents.GetTilesWithin(tileX, tileY, width, height, filteringOptions, layer);
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used.
     *
     * @return {Tile[]|null} Returns an array of Tiles, or null if the layer given was invalid.
     */
    getTilesWithinShape: function (shape, filteringOptions, camera, layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return null; }
        return TilemapComponents.GetTilesWithinShape(shape, filteringOptions, camera, layer);
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used.
     *
     * @return {Tile[]|null} Returns an array of Tiles, or null if the layer given was invalid.
     */
    getTilesWithinWorldXY: function (worldX, worldY, width, height, filteringOptions, camera, layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return null; }
        return TilemapComponents.GetTilesWithinWorldXY(worldX, worldY, width, height, filteringOptions, camera, layer);
    },

    /**
     * Gets the index of the Tileset within this.tilesets that has the given `name`, or null if an
     * invalid `name` is given.
     *
     * @param {string} name - The name of the Tileset to get.
     * @return {integer} The Tileset index within this.tilesets.
     */
    getTilesetIndex: function (name)
    {
        return this.getIndex(this.tilesets, name);
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used.
     *
     * @return {boolean|null} Returns a boolean, or null if the layer given was invalid.
     */
    hasTileAt: function (tileX, tileY, layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return null; }
        return TilemapComponents.HasTileAt(tileX, tileY, layer);
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used.
     *
     * @return {boolean|null} Returns a boolean, or null if the layer given was invalid.
     */
    hasTileAtWorldXY: function (worldX, worldY, camera, layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return null; }
        return TilemapComponents.HasTileAtWorldXY(worldX, worldY, camera, layer);
    },

    /**
     * The LayerData object that is currently selected in the map. You can set this property using
     * any type supported by setLayer.
     * @property {LayerData} layer
     */
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

    /**
     * See component documentation. If no layer specified, the map's current layer is used. This
     * cannot be applied to StaticTilemapLayers.
     *
     * @return {Tile|null} Returns a Tile, or null if the layer given was invalid.
     */
    putTileAt: function (tile, tileX, tileY, recalculateFaces, layer)
    {
        layer = this.getLayer(layer);
        if (this._isStaticCall(layer, 'putTileAt')) { return null; }
        if (layer === null) { return null; }
        return TilemapComponents.PutTileAt(tile, tileX, tileY, recalculateFaces, layer);
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used. This
     * cannot be applied to StaticTilemapLayers.
     *
     * @return {Tile|null} Returns a Tile, or null if the layer given was invalid.
     */
    putTileAtWorldXY: function (tile, worldX, worldY, recalculateFaces, camera, layer)
    {
        layer = this.getLayer(layer);
        if (this._isStaticCall(layer, 'putTileAtWorldXY')) { return null; }
        if (layer === null) { return null; }
        return TilemapComponents.PutTileAtWorldXY(tile, worldX, worldY, recalculateFaces, camera, layer);
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used. This
     * cannot be applied to StaticTilemapLayers.
     *
     * @return {this|null} Returns this, or null if the layer given was invalid.
     */
    putTilesAt: function (tilesArray, tileX, tileY, recalculateFaces, layer)
    {
        layer = this.getLayer(layer);
        if (this._isStaticCall(layer, 'putTilesAt')) { return this; }
        if (layer !== null)
        {
            TilemapComponents.PutTilesAt(tilesArray, tileX, tileY, recalculateFaces, layer);
        }
        return this;
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used. This
     * cannot be applied to StaticTilemapLayers.
     *
     * @return {this|null} Returns this, or null if the layer given was invalid.
     */
    randomize: function (tileX, tileY, width, height, indexes, layer)
    {
        layer = this.getLayer(layer);
        if (this._isStaticCall(layer, 'randomize')) { return this; }
        if (layer !== null)
        {
            TilemapComponents.Randomize(tileX, tileY, width, height, indexes, layer);
        }
        return this;
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used.
     *
     * @return {this|null} Returns this, or null if the layer given was invalid.
     */
    calculateFacesWithin: function (tileX, tileY, width, height, layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return this; }
        TilemapComponents.CalculateFacesWithin(tileX, tileY, width, height, layer);
        return this;
    },

    /**
     * Removes all layers from this Tilemap and destroys any associated StaticTilemapLayers or
     * DynamicTilemapLayers.
     *
     * @return {this}
     */
    removeAllLayers: function ()
    {
        // Destroy any StaticTilemapLayers or DynamicTilemapLayers that are stored in LayerData
        for (var i = 0; i < this.layers.length; i++)
        {
            if (this.layers[i].tilemapLayer)
            {
                this.layers[i].tilemapLayer.destroy();
            }
        }
        this.layers.length = 0;
        this.currentLayerIndex = 0;
        return this;
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used. This
     * cannot be applied to StaticTilemapLayers.
     *
     * @return {Tile|null} Returns a Tile, or null if the layer given was invalid.
     */
    removeTileAt: function (tileX, tileY, replaceWithNull, recalculateFaces, layer)
    {
        layer = this.getLayer(layer);
        if (this._isStaticCall(layer, 'removeTileAt')) { return null; }
        if (layer === null) { return null; }
        return TilemapComponents.RemoveTileAt(tileX, tileY, replaceWithNull, recalculateFaces, layer);
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used. This
     * cannot be applied to StaticTilemapLayers.
     *
     * @return {Tile|null} Returns a Tile, or null if the layer given was invalid.
     */
    removeTileAtWorldXY: function (worldX, worldY, replaceWithNull, recalculateFaces, camera, layer)
    {
        layer = this.getLayer(layer);
        if (this._isStaticCall(layer, 'removeTileAtWorldXY')) { return null; }
        if (layer === null) { return null; }
        return TilemapComponents.RemoveTileAtWorldXY(worldX, worldY, replaceWithNull, recalculateFaces, camera, layer);
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used.
     *
     * @return {this|null} Returns this, or null if the layer given was invalid.
     */
    renderDebug: function (graphics, styleConfig, layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return this; }
        TilemapComponents.RenderDebug(graphics, styleConfig, layer);
        return this;
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used. This
     * cannot be applied to StaticTilemapLayers.
     *
     * @return {this|null} Returns this, or null if the layer given was invalid.
     */
    replaceByIndex: function (findIndex, newIndex, tileX, tileY, width, height, layer)
    {
        layer = this.getLayer(layer);
        if (this._isStaticCall(layer, 'replaceByIndex')) { return this; }
        if (layer !== null)
        {
            TilemapComponents.ReplaceByIndex(findIndex, newIndex, tileX, tileY, width, height, layer);
        }
        return this;
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used.
     *
     * @return {this|null} Returns this, or null if the layer given was invalid.
     */
    setCollision: function (indexes, collides, recalculateFaces, layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return this; }
        TilemapComponents.SetCollision(indexes, collides, recalculateFaces, layer);
        return this;
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used.
     *
     * @return {this|null} Returns this, or null if the layer given was invalid.
     */
    setCollisionBetween: function (start, stop, collides, recalculateFaces, layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return this; }
        TilemapComponents.SetCollisionBetween(start, stop, collides, recalculateFaces, layer);
        return this;
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used.
     *
     * @return {this|null} Returns this, or null if the layer given was invalid.
     */
    setCollisionByProperty: function (properties, collides, recalculateFaces, layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return this; }
        TilemapComponents.SetCollisionByProperty(properties, collides, recalculateFaces, layer);
        return this;
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used.
     *
     * @return {this|null} Returns this, or null if the layer given was invalid.
     */
    setCollisionByExclusion: function (indexes, collides, recalculateFaces, layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return this; }
        TilemapComponents.SetCollisionByExclusion(indexes, collides, recalculateFaces, layer);
        return this;
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used.
     *
     * @return {this|null} Returns this, or null if the layer given was invalid.
     */
    setCollisionFromCollisionGroup: function (collides, recalculateFaces, layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return this; }
        TilemapComponents.SetCollisionFromCollisionGroup(collides, recalculateFaces, layer);
        return this;
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used.
     *
     * @return {this|null} Returns this, or null if the layer given was invalid.
     */
    setTileIndexCallback: function (indexes, callback, callbackContext, layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return this; }
        TilemapComponents.SetTileIndexCallback(indexes, callback, callbackContext, layer);
        return this;
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used.
     *
     * @return {this|null} Returns this, or null if the layer given was invalid.
     */
    setTileLocationCallback: function (tileX, tileY, width, height, callback, callbackContext, layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return this; }
        TilemapComponents.SetTileLocationCallback(tileX, tileY, width, height, callback, callbackContext, layer);
        return this;
    },

    /**
     * Sets the current layer to the LayerData associated with `layer`.
     *
     * @param {string|integer|DynamicTilemapLayer|StaticTilemapLayer} [layer] - The name of the
     * layer from Tiled, the index of the layer in the map, a DynamicTilemapLayer or a
     * StaticTilemapLayer. If not given will default to the map's current layer index.
     * @return {this}
     */
    setLayer: function (layer)
    {
        var index = this.getLayerIndex(layer);
        if (index !== null)
        {
            this.currentLayerIndex = index;
        }
        return this;
    },

    /**
     * Sets the base tile size for the map. Note: this does not necessarily match the tileWidth and
     * tileHeight for all layers. This also updates the base size on all tiles across all layers.
     *
     * @param {integer} tileWidth - The width of the tiles the map uses for calculations.
     * @param {integer} tileHeight - The height of the tiles the map uses for calculations.
     * @return {this}
     */
    setBaseTileSize: function (tileWidth, tileHeight)
    {
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.widthInPixels = this.width * tileWidth;
        this.heightInPixels = this.height * tileHeight;

        // Update the base tile size on all layers & tiles
        for (var i = 0; i < this.layers.length; i++)
        {
            this.layers[i].baseWidth = tileWidth;
            this.layers[i].baseHeight = tileHeight;

            var mapData = this.layers[i].data;
            var mapWidth = this.layers[i].width;
            var mapHeight = this.layers[i].height;

            for (var row = 0; row < mapHeight; ++row)
            {
                for (var col = 0; col < mapWidth; ++col)
                {
                    var tile = mapData[row][col];
                    if (tile !== null)
                    {
                        tile.setSize(undefined, undefined, tileWidth, tileHeight);
                    }
                }
            }
        }

        return this;
    },

    /**
     * Sets the tile size for a specific `layer`. Note: this does not necessarily match the map's
     * tileWidth and tileHeight for all layers. This will set the tile size for the layer and any
     * tiles the layer has.
     *
     * @param {integer} tileWidth - The width of the tiles (in pixels) in the layer.
     * @param {integer} tileHeight - The height of the tiles (in pixels) in the layer.
     * @param {string|integer|DynamicTilemapLayer|StaticTilemapLayer} [layer] - The name of the
     * layer from Tiled, the index of the layer in the map, a DynamicTilemapLayer or a
     * StaticTilemapLayer. If not given will default to the map's current layer index.
     * @return {this}
     */
    setLayerTileSize: function (tileWidth, tileHeight, layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return this; }

        layer.tileWidth = tileWidth;
        layer.tileHeight = tileHeight;

        var mapData = layer.data;
        var mapWidth = layer.width;
        var mapHeight = layer.height;

        for (var row = 0; row < mapHeight; ++row)
        {
            for (var col = 0; col < mapWidth; ++col)
            {
                var tile = mapData[row][col];
                if (tile !== null) { tile.setSize(tileWidth, tileHeight); }
            }
        }

        return this;
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used. This
     * cannot be applied to StaticTilemapLayers.
     *
     * @return {this|null} Returns this, or null if the layer given was invalid.
     */
    shuffle: function (tileX, tileY, width, height, layer)
    {
        layer = this.getLayer(layer);
        if (this._isStaticCall(layer, 'shuffle')) { return this; }
        if (layer !== null)
        {
            TilemapComponents.Shuffle(tileX, tileY, width, height, layer);
        }
        return this;
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used. This
     * cannot be applied to StaticTilemapLayers.
     *
     * @return {this|null} Returns this, or null if the layer given was invalid.
     */
    swapByIndex: function (indexA, indexB, tileX, tileY, width, height, layer)
    {
        layer = this.getLayer(layer);
        if (this._isStaticCall(layer, 'swapByIndex')) { return this; }
        if (layer !== null)
        {
            TilemapComponents.SwapByIndex(indexA, indexB, tileX, tileY, width, height, layer);
        }
        return this;
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used.
     *
     * @return {number|null} Returns a number, or null if the layer given was invalid.
     */
    tileToWorldX: function (tileX, camera, layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return null; }
        return TilemapComponents.TileToWorldX(tileX, camera, layer);
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used.
     *
     * @return {number|null} Returns a number, or null if the layer given was invalid.
     */
    tileToWorldY: function (tileX, camera, layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return null; }
        return TilemapComponents.TileToWorldY(tileX, camera, layer);
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used.
     *
     * @return {Vector2|null} Returns a point, or null if the layer given was invalid.
     */
    tileToWorldXY: function (tileX, tileY, point, camera, layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return null; }
        return TilemapComponents.TileToWorldXY(tileX, tileY, point, camera, layer);
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used. This
     * cannot be applied to StaticTilemapLayers.
     *
     * @return {this|null} Returns this, or null if the layer given was invalid.
     */
    weightedRandomize: function (tileX, tileY, width, height, weightedIndexes, layer)
    {
        layer = this.getLayer(layer);
        if (this._isStaticCall(layer, 'weightedRandomize')) { return this; }
        if (layer !== null)
        {
            TilemapComponents.WeightedRandomize(tileX, tileY, width, height, weightedIndexes, layer);
        }
        return this;
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used.
     *
     * @return {number|null} Returns a number, or null if the layer given was invalid.
     */
    worldToTileX: function (worldX, snapToFloor, camera, layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return null; }
        return TilemapComponents.WorldToTileX(worldX, snapToFloor, camera, layer);
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used.
     *
     * @return {number|null} Returns a number, or null if the layer given was invalid.
     */
    worldToTileY: function (worldY, snapToFloor, camera, layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return null; }
        return TilemapComponents.WorldToTileY(worldY, snapToFloor, camera, layer);
    },

    /**
     * See component documentation. If no layer specified, the map's current layer is used.
     *
     * @return {Vector2|null} Returns a point, or null if the layer given was invalid.
     */
    worldToTileXY: function (worldX, worldY, snapToFloor, point, camera, layer)
    {
        layer = this.getLayer(layer);
        if (layer === null) { return null; }
        return TilemapComponents.WorldToTileXY(worldX, worldY, snapToFloor, point, camera, layer);
    },

    /**
     * Used internally to check if a layer is static and prints out a warning.
     *
     * @private
     * @return {boolean}
     */
    _isStaticCall: function (layer, functionName)
    {
        if (layer.tilemapLayer instanceof StaticTilemapLayer)
        {
            console.warn(functionName + ': You cannot change the tiles in a static tilemap layer');
            return true;
        }
        else
        {
            return false;
        }
    }

});

module.exports = Tilemap;
