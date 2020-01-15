/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var DegToRad = require('../math/DegToRad');
var DynamicTilemapLayer = require('./dynamiclayer/DynamicTilemapLayer');
var Extend = require('../utils/object/Extend');
var Formats = require('./Formats');
var LayerData = require('./mapdata/LayerData');
var Rotate = require('../math/Rotate');
var SpliceOne = require('../utils/array/SpliceOne');
var StaticTilemapLayer = require('./staticlayer/StaticTilemapLayer');
var Tile = require('./Tile');
var TilemapComponents = require('./components');
var Tileset = require('./Tileset');

/**
 * @callback TilemapFilterCallback
 *
 * @param {Phaser.GameObjects.GameObject} value - An object found in the filtered area.
 * @param {number} index - The index of the object within the array.
 * @param {Phaser.GameObjects.GameObject[]} array - An array of all the objects found.
 *
 * @return {Phaser.GameObjects.GameObject} The object.
 */

/**
 * @callback TilemapFindCallback
 *
 * @param {Phaser.GameObjects.GameObject} value - An object found.
 * @param {number} index - The index of the object within the array.
 * @param {Phaser.GameObjects.GameObject[]} array - An array of all the objects found.
 *
 * @return {boolean} `true` if the callback should be invoked, otherwise `false`.
 */

/**
 * @classdesc
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
 * As of Phaser 3.21.0, if your tilemap includes layer groups (a feature of Tiled 1.2.0+) these
 * will be traversed and the following properties will affect children:
 * - opacity (blended with parent) and visibility (parent overrides child)
 * - Vertical and horizontal offset
 * The grouping hierarchy is not preserved and all layers will be flattened into a single array.
 * Group layers are parsed during Tilemap construction but are discarded after parsing so dynamic
 * layers will NOT continue to be affected by a parent.
 *
 * To avoid duplicate layer names, a layer that is a child of a group layer will have its parent
 * group name prepended with a '/'.  For example, consider a group called 'ParentGroup' with a
 * child called 'Layer 1'. In the Tilemap object, 'Layer 1' will have the name
 * 'ParentGroup/Layer 1'.
 *
 * @class Tilemap
 * @memberof Phaser.Tilemaps
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Tilemap belongs.
 * @param {Phaser.Tilemaps.MapData} mapData - A MapData instance containing Tilemap data.
 */
var Tilemap = new Class({

    initialize:

    function Tilemap (scene, mapData)
    {
        /**
         * @name Phaser.Tilemaps.Tilemap#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * The base width of a tile in pixels. Note that individual layers may have a different tile
         * width.
         *
         * @name Phaser.Tilemaps.Tilemap#tileWidth
         * @type {integer}
         * @since 3.0.0
         */
        this.tileWidth = mapData.tileWidth;

        /**
         * The base height of a tile in pixels. Note that individual layers may have a different
         * tile height.
         *
         * @name Phaser.Tilemaps.Tilemap#tileHeight
         * @type {integer}
         * @since 3.0.0
         */
        this.tileHeight = mapData.tileHeight;

        /**
         * The width of the map (in tiles).
         *
         * @name Phaser.Tilemaps.Tilemap#width
         * @type {number}
         * @since 3.0.0
         */
        this.width = mapData.width;

        /**
         * The height of the map (in tiles).
         *
         * @name Phaser.Tilemaps.Tilemap#height
         * @type {number}
         * @since 3.0.0
         */
        this.height = mapData.height;

        /**
         * The orientation of the map data (as specified in Tiled), usually 'orthogonal'.
         *
         * @name Phaser.Tilemaps.Tilemap#orientation
         * @type {string}
         * @since 3.0.0
         */
        this.orientation = mapData.orientation;

        /**
         * The render (draw) order of the map data (as specified in Tiled), usually 'right-down'.
         *
         * The draw orders are:
         *
         * right-down
         * left-down
         * right-up
         * left-up
         *
         * This can be changed via the `setRenderOrder` method.
         *
         * @name Phaser.Tilemaps.Tilemap#renderOrder
         * @type {string}
         * @since 3.12.0
         */
        this.renderOrder = mapData.renderOrder;

        /**
         * The format of the map data.
         *
         * @name Phaser.Tilemaps.Tilemap#format
         * @type {number}
         * @since 3.0.0
         */
        this.format = mapData.format;

        /**
         * The version of the map data (as specified in Tiled, usually 1).
         *
         * @name Phaser.Tilemaps.Tilemap#version
         * @type {number}
         * @since 3.0.0
         */
        this.version = mapData.version;

        /**
         * Map specific properties as specified in Tiled.
         *
         * @name Phaser.Tilemaps.Tilemap#properties
         * @type {object}
         * @since 3.0.0
         */
        this.properties = mapData.properties;

        /**
         * The width of the map in pixels based on width * tileWidth.
         *
         * @name Phaser.Tilemaps.Tilemap#widthInPixels
         * @type {number}
         * @since 3.0.0
         */
        this.widthInPixels = mapData.widthInPixels;

        /**
         * The height of the map in pixels based on height * tileHeight.
         *
         * @name Phaser.Tilemaps.Tilemap#heightInPixels
         * @type {number}
         * @since 3.0.0
         */
        this.heightInPixels = mapData.heightInPixels;

        /**
         *
         * @name Phaser.Tilemaps.Tilemap#imageCollections
         * @type {Phaser.Tilemaps.ImageCollection[]}
         * @since 3.0.0
         */
        this.imageCollections = mapData.imageCollections;

        /**
         * An array of Tiled Image Layers.
         *
         * @name Phaser.Tilemaps.Tilemap#images
         * @type {array}
         * @since 3.0.0
         */
        this.images = mapData.images;

        /**
         * An array of Tilemap layer data.
         *
         * @name Phaser.Tilemaps.Tilemap#layers
         * @type {Phaser.Tilemaps.LayerData[]}
         * @since 3.0.0
         */
        this.layers = mapData.layers;

        /**
         * An array of Tilesets used in the map.
         *
         * @name Phaser.Tilemaps.Tilemap#tilesets
         * @type {Phaser.Tilemaps.Tileset[]}
         * @since 3.0.0
         */
        this.tilesets = mapData.tilesets;

        /**
         * An array of ObjectLayer instances parsed from Tiled object layers.
         *
         * @name Phaser.Tilemaps.Tilemap#objects
         * @type {Phaser.Tilemaps.ObjectLayer[]}
         * @since 3.0.0
         */
        this.objects = mapData.objects;

        /**
         * The index of the currently selected LayerData object.
         *
         * @name Phaser.Tilemaps.Tilemap#currentLayerIndex
         * @type {integer}
         * @since 3.0.0
         */
        this.currentLayerIndex = 0;
    },

    /**
     * Sets the rendering (draw) order of the tiles in this map.
     *
     * The default is 'right-down', meaning it will order the tiles starting from the top-left,
     * drawing to the right and then moving down to the next row.
     *
     * The draw orders are:
     *
     * 0 = right-down
     * 1 = left-down
     * 2 = right-up
     * 3 = left-up
     *
     * Setting the render order does not change the tiles or how they are stored in the layer,
     * it purely impacts the order in which they are rendered.
     *
     * You can provide either an integer (0 to 3), or the string version of the order.
     *
     * Calling this method _after_ creating Static or Dynamic Tilemap Layers will **not** automatically
     * update them to use the new render order. If you call this method after creating layers, use their
     * own `setRenderOrder` methods to change them as needed.
     *
     * @method Phaser.Tilemaps.Tilemap#setRenderOrder
     * @since 3.12.0
     *
     * @param {(integer|string)} renderOrder - The render (draw) order value. Either an integer between 0 and 3, or a string: 'right-down', 'left-down', 'right-up' or 'left-up'.
     *
     * @return {this} This Tilemap object.
     */
    setRenderOrder: function (renderOrder)
    {
        var orders = [ 'right-down', 'left-down', 'right-up', 'left-up' ];

        if (typeof renderOrder === 'number')
        {
            renderOrder = orders[renderOrder];
        }

        if (orders.indexOf(renderOrder) > -1)
        {
            this.renderOrder = renderOrder;
        }

        return this;
    },

    /**
     * Adds an image to the map to be used as a tileset. A single map may use multiple tilesets.
     * Note that the tileset name can be found in the JSON file exported from Tiled, or in the Tiled
     * editor.
     *
     * @method Phaser.Tilemaps.Tilemap#addTilesetImage
     * @since 3.0.0
     *
     * @param {string} tilesetName - The name of the tileset as specified in the map data.
     * @param {string} [key] - The key of the Phaser.Cache image used for this tileset. If
     * `undefined` or `null` it will look for an image with a key matching the tilesetName parameter.
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
     *
     * @return {?Phaser.Tilemaps.Tileset} Returns the Tileset object that was created or updated, or null if it
     * failed.
     */
    addTilesetImage: function (tilesetName, key, tileWidth, tileHeight, tileMargin, tileSpacing, gid)
    {
        if (tilesetName === undefined) { return null; }
        if (key === undefined || key === null) { key = tilesetName; }

        if (!this.scene.sys.textures.exists(key))
        {
            console.warn('Invalid Tileset Image: ' + key);
            return null;
        }

        var texture = this.scene.sys.textures.get(key);

        var index = this.getTilesetIndex(tilesetName);

        if (index === null && this.format === Formats.TILED_JSON)
        {
            console.warn('No data found for Tileset: ' + tilesetName);
            return null;
        }

        var tileset = this.tilesets[index];

        if (tileset)
        {
            tileset.setTileSize(tileWidth, tileHeight);
            tileset.setSpacing(tileMargin, tileSpacing);
            tileset.setImage(texture);

            return tileset;
        }

        if (tileWidth === undefined) { tileWidth = this.tileWidth; }
        if (tileHeight === undefined) { tileHeight = this.tileHeight; }
        if (tileMargin === undefined) { tileMargin = 0; }
        if (tileSpacing === undefined) { tileSpacing = 0; }
        if (gid === undefined) { gid = 0; }

        tileset = new Tileset(tilesetName, gid, tileWidth, tileHeight, tileMargin, tileSpacing);

        tileset.setImage(texture);

        this.tilesets.push(tileset);

        return tileset;
    },

    /**
     * Turns the DynamicTilemapLayer associated with the given layer into a StaticTilemapLayer. If
     * no layer specified, the map's current layer is used. This is useful if you want to manipulate
     * a map at the start of a scene, but then make it non-manipulable and optimize it for speed.
     * Note: the DynamicTilemapLayer passed in is destroyed, so make sure to store the value
     * returned from this method if you want to manipulate the new StaticTilemapLayer.
     *
     * @method Phaser.Tilemaps.Tilemap#convertLayerToStatic
     * @since 3.0.0
     *
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer)} [layer] - The name of the layer from Tiled, the
     * index of the layer in the map, or a DynamicTilemapLayer.
     *
     * @return {?Phaser.Tilemaps.StaticTilemapLayer} Returns the new layer that was created, or null if it
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

        var staticLayer = new StaticTilemapLayer(
            dynamicLayer.scene,
            dynamicLayer.tilemap,
            dynamicLayer.layerIndex,
            dynamicLayer.tileset,
            dynamicLayer.x,
            dynamicLayer.y
        );

        this.scene.sys.displayList.add(staticLayer);

        dynamicLayer.destroy();

        return staticLayer;
    },

    /**
     * Copies the tiles in the source rectangular area to a new destination (all specified in tile
     * coordinates) within the layer. This copies all tile properties & recalculates collision
     * information in the destination region.
     *
     * If no layer specified, the map's current layer is used. This cannot be applied to StaticTilemapLayers.
     *
     * @method Phaser.Tilemaps.Tilemap#copy
     * @since 3.0.0
     *
     * @param {integer} srcTileX - The x coordinate of the area to copy from, in tiles, not pixels.
     * @param {integer} srcTileY - The y coordinate of the area to copy from, in tiles, not pixels.
     * @param {integer} width - The width of the area to copy, in tiles, not pixels.
     * @param {integer} height - The height of the area to copy, in tiles, not pixels.
     * @param {integer} destTileX - The x coordinate of the area to copy to, in tiles, not pixels.
     * @param {integer} destTileY - The y coordinate of the area to copy to, in tiles, not pixels.
     * @param {boolean} [recalculateFaces=true] - `true` if the faces data should be recalculated.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tilemap} Returns this, or null if the layer given was invalid.
     */
    copy: function (srcTileX, srcTileY, width, height, destTileX, destTileY, recalculateFaces, layer)
    {
        layer = this.getLayer(layer);

        if (this._isStaticCall(layer, 'copy')) { return this; }

        if (layer !== null)
        {
            TilemapComponents.Copy(
                srcTileX, srcTileY,
                width, height,
                destTileX, destTileY,
                recalculateFaces, layer
            );

            return this;
        }
        else
        {
            return null;
        }
    },

    /**
     * Creates a new and empty DynamicTilemapLayer. The currently selected layer in the map is set to this new layer.
     *
     * @method Phaser.Tilemaps.Tilemap#createBlankDynamicLayer
     * @since 3.0.0
     *
     * @param {string} name - The name of this layer. Must be unique within the map.
     * @param {(string|string[]|Phaser.Tilemaps.Tileset|Phaser.Tilemaps.Tileset[])} tileset - The tileset, or an array of tilesets, used to render this layer. Can be a string or a Tileset object.
     * @param {number} [x=0] - The world x position where the top left of this layer will be placed.
     * @param {number} [y=0] - The world y position where the top left of this layer will be placed.
     * @param {integer} [width] - The width of the layer in tiles. If not specified, it will default to the map's width.
     * @param {integer} [height] - The height of the layer in tiles. If not specified, it will default to the map's height.
     * @param {integer} [tileWidth] - The width of the tiles the layer uses for calculations. If not specified, it will default to the map's tileWidth.
     * @param {integer} [tileHeight] - The height of the tiles the layer uses for calculations. If not specified, it will default to the map's tileHeight.
     *
     * @return {?Phaser.Tilemaps.DynamicTilemapLayer} Returns the new layer that was created, or `null` if it failed.
     */
    createBlankDynamicLayer: function (name, tileset, x, y, width, height, tileWidth, tileHeight)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = this.width; }
        if (height === undefined) { height = this.height; }
        if (tileWidth === undefined) { tileWidth = this.tileWidth; }
        if (tileHeight === undefined) { tileHeight = this.tileHeight; }

        var index = this.getLayerIndex(name);

        if (index !== null)
        {
            console.warn('Invalid Tilemap Layer ID: ' + name);
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
                row.push(new Tile(layerData, -1, tileX, tileY, tileWidth, tileHeight, this.tileWidth, this.tileHeight));
            }

            layerData.data.push(row);
        }

        this.layers.push(layerData);

        this.currentLayerIndex = this.layers.length - 1;

        var dynamicLayer = new DynamicTilemapLayer(this.scene, this, this.currentLayerIndex, tileset, x, y);

        dynamicLayer.setRenderOrder(this.renderOrder);

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
     * @method Phaser.Tilemaps.Tilemap#createDynamicLayer
     * @since 3.0.0
     *
     * @param {(integer|string)} layerID - The layer array index value, or if a string is given, the layer name from Tiled.
     * @param {(string|string[]|Phaser.Tilemaps.Tileset|Phaser.Tilemaps.Tileset[])} tileset - The tileset, or an array of tilesets, used to render this layer. Can be a string or a Tileset object.
     * @param {number} [x=0] - The x position to place the layer in the world. If not specified, it will default to the layer offset from Tiled or 0.
     * @param {number} [y=0] - The y position to place the layer in the world. If not specified, it will default to the layer offset from Tiled or 0.
     *
     * @return {?Phaser.Tilemaps.DynamicTilemapLayer} Returns the new layer was created, or null if it failed.
     */
    createDynamicLayer: function (layerID, tileset, x, y)
    {
        var index = this.getLayerIndex(layerID);

        if (index === null)
        {
            console.warn('Invalid Tilemap Layer ID: ' + layerID);

            if (typeof layerID === 'string')
            {
                console.warn('Valid tilelayer names:\n\t' + this.getTileLayerNames().join(',\n\t'));
            }

            return null;
        }

        var layerData = this.layers[index];

        // Check for an associated static or dynamic tilemap layer
        if (layerData.tilemapLayer)
        {
            console.warn('Tilemap Layer ID already exists:' + layerID);
            return null;
        }

        this.currentLayerIndex = index;

        //  Default the x/y position to match Tiled layer offset, if it exists.

        if (x === undefined)
        {
            x = layerData.x;
        }

        if (y === undefined)
        {
            y = layerData.y;
        }

        var layer = new DynamicTilemapLayer(this.scene, this, index, tileset, x, y);

        layer.setRenderOrder(this.renderOrder);

        this.scene.sys.displayList.add(layer);

        return layer;
    },

    /**
     * Creates a Sprite for every object matching the given gid in the map data. All properties from
     * the map data objectgroup are copied into the `spriteConfig`, so you can use this as an easy
     * way to configure Sprite properties from within the map editor. For example giving an object a
     * property of alpha: 0.5 in the map editor will duplicate that when the Sprite is created.
     *
     * Custom object properties not sharing names with the Sprite's own properties are copied to the
     * Sprite's {@link Phaser.GameObjects.Sprite#data data store}.
     *
     * @method Phaser.Tilemaps.Tilemap#createFromObjects
     * @since 3.0.0
     *
     * @param {string} name - The name of the object layer (from Tiled) to create Sprites from.
     * @param {(integer|string)} id - Either the id (object), gid (tile object) or name (object or
     * tile object) from Tiled. Ids are unique in Tiled, but a gid is shared by all tile objects
     * with the same graphic. The same name can be used on multiple objects.
     * @param {Phaser.Types.GameObjects.Sprite.SpriteConfig} spriteConfig - The config object to pass into the Sprite creator (i.e.
     * scene.make.sprite).
     * @param {Phaser.Scene} [scene=the scene the map is within] - The Scene to create the Sprites within.
     *
     * @return {Phaser.GameObjects.Sprite[]} An array of the Sprites that were created.
     */
    createFromObjects: function (name, id, spriteConfig, scene)
    {
        if (spriteConfig === undefined) { spriteConfig = {}; }
        if (scene === undefined) { scene = this.scene; }

        var objectLayer = this.getObjectLayer(name);

        if (!objectLayer)
        {
            console.warn('Cannot create from object. Invalid objectgroup name given: ' + name);

            if (typeof layerID === 'string')
            {
                console.warn('Valid objectgroup names:\n\t' + this.getObjectLayerNames().join(',\n\t'));
            }

            return null;
        }

        var objects = objectLayer.objects;
        var sprites = [];

        for (var i = 0; i < objects.length; i++)
        {
            var found = false;
            var obj = objects[i];

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

                var sprite = scene.make.sprite(config);

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

                for (var key in obj.properties)
                {
                    if (sprite.hasOwnProperty(key))
                    {
                        continue;
                    }

                    sprite.setData(key, obj.properties[key]);
                }

                sprites.push(sprite);
            }
        }

        return sprites;
    },

    /**
     * Creates a Sprite for every object matching the given tile indexes in the layer. You can
     * optionally specify if each tile will be replaced with a new tile after the Sprite has been
     * created. This is useful if you want to lay down special tiles in a level that are converted to
     * Sprites, but want to replace the tile itself with a floor tile or similar once converted.
     *
     * @method Phaser.Tilemaps.Tilemap#createFromTiles
     * @since 3.0.0
     *
     * @param {(integer|array)} indexes - The tile index, or array of indexes, to create Sprites from.
     * @param {(integer|array)} replacements - The tile index, or array of indexes, to change a converted
     * tile to. Set to `null` to leave the tiles unchanged. If an array is given, it is assumed to be a
     * one-to-one mapping with the indexes array.
     * @param {Phaser.Types.GameObjects.Sprite.SpriteConfig} spriteConfig - The config object to pass into the Sprite creator (i.e. scene.make.sprite).
     * @param {Phaser.Scene} [scene=scene the map is within] - The Scene to create the Sprites within.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.GameObjects.Sprite[]} Returns an array of Tiles, or null if the layer given was invalid.
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
     * @method Phaser.Tilemaps.Tilemap#createStaticLayer
     * @since 3.0.0
     *
     * @param {(integer|string)} layerID - The layer array index value, or if a string is given, the layer name from Tiled.
     * @param {(string|string[]|Phaser.Tilemaps.Tileset|Phaser.Tilemaps.Tileset[])} tileset - The tileset, or an array of tilesets, used to render this layer. Can be a string or a Tileset object.
     * @param {number} [x=0] - The x position to place the layer in the world. If not specified, it will default to the layer offset from Tiled or 0.
     * @param {number} [y=0] - The y position to place the layer in the world. If not specified, it will default to the layer offset from Tiled or 0.
     *
     * @return {?Phaser.Tilemaps.StaticTilemapLayer} Returns the new layer was created, or null if it failed.
     */
    createStaticLayer: function (layerID, tileset, x, y)
    {
        var index = this.getLayerIndex(layerID);

        if (index === null)
        {
            console.warn('Invalid Tilemap Layer ID: ' + layerID);
            if (typeof layerID === 'string')
            {
                console.warn('Valid tilelayer names:\n\t' + this.getTileLayerNames().join(',\n\t'));
            }
            return null;
        }

        var layerData = this.layers[index];

        //  Check for an associated static or dynamic tilemap layer
        if (layerData.tilemapLayer)
        {
            console.warn('Tilemap Layer ID already exists:' + layerID);
            return null;
        }

        this.currentLayerIndex = index;

        //  Default the x/y position to match Tiled layer offset, if it exists.
        if (x === undefined && this.layers[index].x) { x = this.layers[index].x; }
        if (y === undefined && this.layers[index].y) { y = this.layers[index].y; }

        var layer = new StaticTilemapLayer(this.scene, this, index, tileset, x, y);

        layer.setRenderOrder(this.renderOrder);

        this.scene.sys.displayList.add(layer);

        return layer;
    },

    /**
     * Removes all layer data from this Tilemap and nulls the scene reference. This will destroy any
     * StaticTilemapLayers or DynamicTilemapLayers that have been linked to LayerData.
     *
     * @method Phaser.Tilemaps.Tilemap#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.removeAllLayers();
        this.tilesets.length = 0;
        this.objects.length = 0;
        this.scene = undefined;
    },

    /**
     * Sets the tiles in the given rectangular area (in tile coordinates) of the layer with the
     * specified index. Tiles will be set to collide if the given index is a colliding index.
     * Collision information in the region will be recalculated.
     *
     * If no layer specified, the map's current layer is used.
     * This cannot be applied to StaticTilemapLayers.
     *
     * @method Phaser.Tilemaps.Tilemap#fill
     * @since 3.0.0
     *
     * @param {integer} index - The tile index to fill the area with.
     * @param {integer} [tileX=0] - The left most tile index (in tile coordinates) to use as the origin of the area.
     * @param {integer} [tileY=0] - The top most tile index (in tile coordinates) to use as the origin of the area.
     * @param {integer} [width=max width based on tileX] - How many tiles wide from the `tileX` index the area will be.
     * @param {integer} [height=max height based on tileY] - How many tiles tall from the `tileY` index the area will be.
     * @param {boolean} [recalculateFaces=true] - `true` if the faces data should be recalculated.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tilemap} Returns this, or null if the layer given was invalid.
     */
    fill: function (index, tileX, tileY, width, height, recalculateFaces, layer)
    {
        layer = this.getLayer(layer);

        if (layer === null) { return null; }

        if (this._isStaticCall(layer, 'fill')) { return this; }

        TilemapComponents.Fill(index, tileX, tileY, width, height, recalculateFaces, layer);

        return this;
    },

    /**
     * For each object in the given object layer, run the given filter callback function. Any
     * objects that pass the filter test (i.e. where the callback returns true) will returned as a
     * new array. Similar to Array.prototype.Filter in vanilla JS.
     *
     * @method Phaser.Tilemaps.Tilemap#filterObjects
     * @since 3.0.0
     *
     * @param {(Phaser.Tilemaps.ObjectLayer|string)} objectLayer - The name of an object layer (from Tiled) or an ObjectLayer instance.
     * @param {TilemapFilterCallback} callback - The callback. Each object in the given area will be passed to this callback as the first and only parameter.
     * @param {object} [context] - The context under which the callback should be run.
     *
     * @return {?Phaser.GameObjects.GameObject[]} An array of object that match the search, or null if the objectLayer given was invalid.
     */
    filterObjects: function (objectLayer, callback, context)
    {
        if (typeof objectLayer === 'string')
        {
            var name = objectLayer;

            objectLayer = this.getObjectLayer(objectLayer);

            if (!objectLayer)
            {
                console.warn('No object layer found with the name: ' + name);
                return null;
            }
        }

        return objectLayer.objects.filter(callback, context);
    },

    /**
     * For each tile in the given rectangular area (in tile coordinates) of the layer, run the given
     * filter callback function. Any tiles that pass the filter test (i.e. where the callback returns
     * true) will returned as a new array. Similar to Array.prototype.Filter in vanilla JS.
     * If no layer specified, the map's current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#filterTiles
     * @since 3.0.0
     *
     * @param {function} callback - The callback. Each tile in the given area will be passed to this
     * callback as the first and only parameter. The callback should return true for tiles that pass the
     * filter.
     * @param {object} [context] - The context under which the callback should be run.
     * @param {integer} [tileX=0] - The left most tile index (in tile coordinates) to use as the origin of the area to filter.
     * @param {integer} [tileY=0] - The top most tile index (in tile coordinates) to use as the origin of the area to filter.
     * @param {integer} [width=max width based on tileX] - How many tiles wide from the `tileX` index the area will be.
     * @param {integer} [height=max height based on tileY] - How many tiles tall from the `tileY` index the area will be.
     * @param {Phaser.Types.Tilemaps.FilteringOptions} [filteringOptions] - Optional filters to apply when getting the tiles.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tile[]} Returns an array of Tiles, or null if the layer given was invalid.
     */
    filterTiles: function (callback, context, tileX, tileY, width, height, filteringOptions, layer)
    {
        layer = this.getLayer(layer);

        if (layer === null) { return null; }

        return TilemapComponents.FilterTiles(callback, context, tileX, tileY, width, height, filteringOptions, layer);
    },

    /**
     * Searches the entire map layer for the first tile matching the given index, then returns that Tile
     * object. If no match is found, it returns null. The search starts from the top-left tile and
     * continues horizontally until it hits the end of the row, then it drops down to the next column.
     * If the reverse boolean is true, it scans starting from the bottom-right corner traveling up to
     * the top-left.
     * If no layer specified, the map's current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#findByIndex
     * @since 3.0.0
     *
     * @param {integer} index - The tile index value to search for.
     * @param {integer} [skip=0] - The number of times to skip a matching tile before returning.
     * @param {boolean} [reverse=false] - If true it will scan the layer in reverse, starting at the bottom-right. Otherwise it scans from the top-left.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tile} Returns a Tiles, or null if the layer given was invalid.
     */
    findByIndex: function (findIndex, skip, reverse, layer)
    {
        layer = this.getLayer(layer);

        if (layer === null) { return null; }

        return TilemapComponents.FindByIndex(findIndex, skip, reverse, layer);
    },

    /**
     * Find the first object in the given object layer that satisfies the provided testing function.
     * I.e. finds the first object for which `callback` returns true. Similar to
     * Array.prototype.find in vanilla JS.
     *
     * @method Phaser.Tilemaps.Tilemap#findObject
     * @since 3.0.0
     *
     * @param {(Phaser.Tilemaps.ObjectLayer|string)} objectLayer - The name of an object layer (from Tiled) or an ObjectLayer instance.
     * @param {TilemapFindCallback} callback - The callback. Each object in the given area will be passed to this callback as the first and only parameter.
     * @param {object} [context] - The context under which the callback should be run.
     *
     * @return {?Phaser.GameObjects.GameObject} An object that matches the search, or null if no object found.
     */
    findObject: function (objectLayer, callback, context)
    {
        if (typeof objectLayer === 'string')
        {
            var name = objectLayer;

            objectLayer = this.getObjectLayer(objectLayer);

            if (!objectLayer)
            {
                console.warn('No object layer found with the name: ' + name);
                return null;
            }
        }

        return objectLayer.objects.find(callback, context) || null;
    },

    /**
     * Find the first tile in the given rectangular area (in tile coordinates) of the layer that
     * satisfies the provided testing function. I.e. finds the first tile for which `callback` returns
     * true. Similar to Array.prototype.find in vanilla JS.
     * If no layer specified, the maps current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#findTile
     * @since 3.0.0
     *
     * @param {FindTileCallback} callback - The callback. Each tile in the given area will be passed to this callback as the first and only parameter.
     * @param {object} [context] - The context under which the callback should be run.
     * @param {integer} [tileX=0] - The left most tile index (in tile coordinates) to use as the origin of the area to search.
     * @param {integer} [tileY=0] - The top most tile index (in tile coordinates) to use as the origin of the area to search.
     * @param {integer} [width=max width based on tileX] - How many tiles wide from the `tileX` index the area will be.
     * @param {integer} [height=max height based on tileY] - How many tiles tall from the `tileY` index the area will be.
     * @param {Phaser.Types.Tilemaps.FilteringOptions} [filteringOptions] - Optional filters to apply when getting the tiles.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The Tile layer to run the search on. If not provided will use the current layer.
     *
     * @return {?Phaser.Tilemaps.Tile} Returns a Tiles, or null if the layer given was invalid.
     */
    findTile: function (callback, context, tileX, tileY, width, height, filteringOptions, layer)
    {
        layer = this.getLayer(layer);

        if (layer === null) { return null; }

        return TilemapComponents.FindTile(callback, context, tileX, tileY, width, height, filteringOptions, layer);
    },

    /**
     * For each tile in the given rectangular area (in tile coordinates) of the layer, run the given
     * callback. Similar to Array.prototype.forEach in vanilla JS.
     *
     * If no layer specified, the map's current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#forEachTile
     * @since 3.0.0
     *
     * @param {EachTileCallback} callback - The callback. Each tile in the given area will be passed to this callback as the first and only parameter.
     * @param {object} [context] - The context under which the callback should be run.
     * @param {integer} [tileX=0] - The left most tile index (in tile coordinates) to use as the origin of the area to search.
     * @param {integer} [tileY=0] - The top most tile index (in tile coordinates) to use as the origin of the area to search.
     * @param {integer} [width=max width based on tileX] - How many tiles wide from the `tileX` index the area will be.
     * @param {integer} [height=max height based on tileY] - How many tiles tall from the `tileY` index the area will be.
     * @param {Phaser.Types.Tilemaps.FilteringOptions} [filteringOptions] - Optional filters to apply when getting the tiles.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The Tile layer to run the search on. If not provided will use the current layer.
     *
     * @return {?Phaser.Tilemaps.Tilemap} Returns this, or null if the layer given was invalid.
     */
    forEachTile: function (callback, context, tileX, tileY, width, height, filteringOptions, layer)
    {
        layer = this.getLayer(layer);

        if (layer === null) { return null; }

        TilemapComponents.ForEachTile(callback, context, tileX, tileY, width, height, filteringOptions, layer);

        return this;
    },

    /**
     * Gets the image layer index based on its name.
     *
     * @method Phaser.Tilemaps.Tilemap#getImageIndex
     * @since 3.0.0
     *
     * @param {string} name - The name of the image to get.
     *
     * @return {integer} The index of the image in this tilemap, or null if not found.
     */
    getImageIndex: function (name)
    {
        return this.getIndex(this.images, name);
    },

    /**
     * Return a list of all valid imagelayer names loaded in this Tilemap.
     *
     * @method Phaser.Tilemaps.Tilemap#getImageLayerNames
     * @since 3.21.0
     *
     * @return {string[]} Array of valid imagelayer names / IDs loaded into this Tilemap.
     */
    getImageLayerNames: function ()
    {
        if (!this.images || !Array.isArray(this.images))
        {
            return [];
        }

        return this.images.map(function (image)
        {
            return image.name;
        });
    },

    /**
     * Internally used. Returns the index of the object in one of the Tilemaps arrays whose name
     * property matches the given `name`.
     *
     * @method Phaser.Tilemaps.Tilemap#getIndex
     * @since 3.0.0
     *
     * @param {array} location - The Tilemap array to search.
     * @param {string} name - The name of the array element to get.
     *
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
     * @method Phaser.Tilemaps.Tilemap#getLayer
     * @since 3.0.0
     *
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The name of the
     * layer from Tiled, the index of the layer in the map, a DynamicTilemapLayer or a
     * StaticTilemapLayer. If not given will default to the maps current layer index.
     *
     * @return {Phaser.Tilemaps.LayerData} The corresponding LayerData within this.layers.
     */
    getLayer: function (layer)
    {
        var index = this.getLayerIndex(layer);

        return (index !== null) ? this.layers[index] : null;
    },

    /**
     * Gets the ObjectLayer from this.objects that has the given `name`, or null if no ObjectLayer
     * is found with that name.
     *
     * @method Phaser.Tilemaps.Tilemap#getObjectLayer
     * @since 3.0.0
     *
     * @param {string} [name] - The name of the object layer from Tiled.
     *
     * @return {?Phaser.Tilemaps.ObjectLayer} The corresponding ObjectLayer within this.objects or null.
     */
    getObjectLayer: function (name)
    {
        var index = this.getIndex(this.objects, name);

        return (index !== null) ? this.objects[index] : null;
    },

    /**
     * Return a list of all valid objectgroup names loaded in this Tilemap.
     *
     * @method Phaser.Tilemaps.Tilemap#getObjectLayerNames
     * @since 3.21.0
     *
     * @return {string[]} Array of valid objectgroup names / IDs loaded into this Tilemap.
     */
    getObjectLayerNames: function ()
    {
        if (!this.objects || !Array.isArray(this.objects))
        {
            return [];
        }

        return this.objects.map(function (object)
        {
            return object.name;
        });
    },

    /**
     * Gets the LayerData index of the given `layer` within this.layers, or null if an invalid
     * `layer` is given.
     *
     * @method Phaser.Tilemaps.Tilemap#getLayerIndex
     * @since 3.0.0
     *
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The name of the
     * layer from Tiled, the index of the layer in the map, a DynamicTilemapLayer or a
     * StaticTilemapLayer. If not given will default to the map's current layer index.
     *
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
     * @method Phaser.Tilemaps.Tilemap#getLayerIndexByName
     * @since 3.0.0
     *
     * @param {string} name - The name of the layer to get.
     *
     * @return {integer} The LayerData index within this.layers.
     */
    getLayerIndexByName: function (name)
    {
        return this.getIndex(this.layers, name);
    },

    /**
     * Gets a tile at the given tile coordinates from the given layer.
     * If no layer specified, the map's current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#getTileAt
     * @since 3.0.0
     *
     * @param {integer} tileX - X position to get the tile from (given in tile units, not pixels).
     * @param {integer} tileY - Y position to get the tile from (given in tile units, not pixels).
     * @param {boolean} [nonNull=false] - If true getTile won't return null for empty tiles, but a Tile object with an index of -1.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tile} Returns a Tile, or null if the layer given was invalid.
     */
    getTileAt: function (tileX, tileY, nonNull, layer)
    {
        layer = this.getLayer(layer);

        if (layer === null) { return null; }

        return TilemapComponents.GetTileAt(tileX, tileY, nonNull, layer);
    },

    /**
     * Gets a tile at the given world coordinates from the given layer.
     * If no layer specified, the map's current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#getTileAtWorldXY
     * @since 3.0.0
     *
     * @param {number} worldX - X position to get the tile from (given in pixels)
     * @param {number} worldY - Y position to get the tile from (given in pixels)
     * @param {boolean} [nonNull=false] - If true, function won't return null for empty tiles, but a Tile object with an index of -1.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tile} Returns a Tile, or null if the layer given was invalid.
     */
    getTileAtWorldXY: function (worldX, worldY, nonNull, camera, layer)
    {
        layer = this.getLayer(layer);

        if (layer === null) { return null; }

        return TilemapComponents.GetTileAtWorldXY(worldX, worldY, nonNull, camera, layer);
    },

    /**
     * Return a list of all valid tilelayer names loaded in this Tilemap.
     *
     * @method Phaser.Tilemaps.Tilemap#getTileLayerNames
     * @since 3.21.0
     *
     * @return {string[]} Array of valid tilelayer names / IDs loaded into this Tilemap.
     */
    getTileLayerNames: function ()
    {
        if (!this.layers || !Array.isArray(this.layers))
        {
            return [];
        }

        return this.layers.map(function (layer)
        {
            return layer.name;
        });
    },

    /**
     * Gets the tiles in the given rectangular area (in tile coordinates) of the layer.
     * If no layer specified, the maps current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#getTilesWithin
     * @since 3.0.0
     *
     * @param {integer} [tileX=0] - The left most tile index (in tile coordinates) to use as the origin of the area.
     * @param {integer} [tileY=0] - The top most tile index (in tile coordinates) to use as the origin of the area.
     * @param {integer} [width=max width based on tileX] - How many tiles wide from the `tileX` index the area will be.
     * @param {integer} [height=max height based on tileY] - How many tiles tall from the `tileY` index the area will be.
     * @param {Phaser.Types.Tilemaps.FilteringOptions} [filteringOptions] - Optional filters to apply when getting the tiles.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tile[]} Returns an array of Tiles, or null if the layer given was invalid.
     */
    getTilesWithin: function (tileX, tileY, width, height, filteringOptions, layer)
    {
        layer = this.getLayer(layer);

        if (layer === null) { return null; }

        return TilemapComponents.GetTilesWithin(tileX, tileY, width, height, filteringOptions, layer);
    },

    /**
     * Gets the tiles that overlap with the given shape in the given layer. The shape must be a Circle,
     * Line, Rectangle or Triangle. The shape should be in world coordinates.
     * If no layer specified, the maps current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#getTilesWithinShape
     * @since 3.0.0
     *
     * @param {(Phaser.Geom.Circle|Phaser.Geom.Line|Phaser.Geom.Rectangle|Phaser.Geom.Triangle)} shape - A shape in world (pixel) coordinates
     * @param {Phaser.Types.Tilemaps.FilteringOptions} [filteringOptions] - Optional filters to apply when getting the tiles.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when factoring in which tiles to return.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tile[]} Returns an array of Tiles, or null if the layer given was invalid.
     */
    getTilesWithinShape: function (shape, filteringOptions, camera, layer)
    {
        layer = this.getLayer(layer);

        if (layer === null) { return null; }

        return TilemapComponents.GetTilesWithinShape(shape, filteringOptions, camera, layer);
    },

    /**
     * Gets the tiles in the given rectangular area (in world coordinates) of the layer.
     * If no layer specified, the maps current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#getTilesWithinWorldXY
     * @since 3.0.0
     *
     * @param {number} worldX - The world x coordinate for the top-left of the area.
     * @param {number} worldY - The world y coordinate for the top-left of the area.
     * @param {number} width - The width of the area.
     * @param {number} height - The height of the area.
     * @param {Phaser.Types.Tilemaps.FilteringOptions} [filteringOptions] - Optional filters to apply when getting the tiles.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when factoring in which tiles to return.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tile[]} Returns an array of Tiles, or null if the layer given was invalid.
     */
    getTilesWithinWorldXY: function (worldX, worldY, width, height, filteringOptions, camera, layer)
    {
        layer = this.getLayer(layer);

        if (layer === null) { return null; }

        return TilemapComponents.GetTilesWithinWorldXY(worldX, worldY, width, height, filteringOptions, camera, layer);
    },

    /**
     * Gets the Tileset that has the given `name`, or null if an invalid `name` is given.
     *
     * @method Phaser.Tilemaps.Tilemap#getTileset
     * @since 3.14.0
     *
     * @param {string} name - The name of the Tileset to get.
     *
     * @return {?Phaser.Tilemaps.Tileset} The Tileset, or `null` if no matching named tileset was found.
     */
    getTileset: function (name)
    {
        var index = this.getIndex(this.tilesets, name);

        return (index !== null) ? this.tilesets[index] : null;
    },

    /**
     * Gets the index of the Tileset within this.tilesets that has the given `name`, or null if an
     * invalid `name` is given.
     *
     * @method Phaser.Tilemaps.Tilemap#getTilesetIndex
     * @since 3.0.0
     *
     * @param {string} name - The name of the Tileset to get.
     *
     * @return {integer} The Tileset index within this.tilesets.
     */
    getTilesetIndex: function (name)
    {
        return this.getIndex(this.tilesets, name);
    },

    /**
     * Checks if there is a tile at the given location (in tile coordinates) in the given layer. Returns
     * false if there is no tile or if the tile at that location has an index of -1.
     *
     * If no layer specified, the map's current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#hasTileAt
     * @since 3.0.0
     *
     * @param {integer} tileX - The x coordinate, in tiles, not pixels.
     * @param {integer} tileY - The y coordinate, in tiles, not pixels.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?boolean} Returns a boolean, or null if the layer given was invalid.
     */
    hasTileAt: function (tileX, tileY, layer)
    {
        layer = this.getLayer(layer);

        if (layer === null) { return null; }

        return TilemapComponents.HasTileAt(tileX, tileY, layer);
    },

    /**
     * Checks if there is a tile at the given location (in world coordinates) in the given layer. Returns
     * false if there is no tile or if the tile at that location has an index of -1.
     *
     * If no layer specified, the maps current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#hasTileAtWorldXY
     * @since 3.0.0
     *
     * @param {number} worldX - The x coordinate, in pixels.
     * @param {number} worldY - The y coordinate, in pixels.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when factoring in which tiles to return.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?boolean} Returns a boolean, or null if the layer given was invalid.
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
     *
     * @name Phaser.Tilemaps.Tilemap#layer
     * @type {Phaser.Tilemaps.LayerData}
     * @since 3.0.0
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
     * Puts a tile at the given tile coordinates in the specified layer. You can pass in either an index
     * or a Tile object. If you pass in a Tile, all attributes will be copied over to the specified
     * location. If you pass in an index, only the index at the specified location will be changed.
     * Collision information will be recalculated at the specified location.
     *
     * If no layer specified, the maps current layer is used.
     *
     * This cannot be applied to StaticTilemapLayers.
     *
     * @method Phaser.Tilemaps.Tilemap#putTileAt
     * @since 3.0.0
     *
     * @param {(integer|Phaser.Tilemaps.Tile)} tile - The index of this tile to set or a Tile object.
     * @param {integer} tileX - The x coordinate, in tiles, not pixels.
     * @param {integer} tileY - The y coordinate, in tiles, not pixels.
     * @param {boolean} [recalculateFaces=true] - `true` if the faces data should be recalculated.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tile} Returns a Tile, or null if the layer given was invalid or the coordinates were out of bounds.
     */
    putTileAt: function (tile, tileX, tileY, recalculateFaces, layer)
    {
        layer = this.getLayer(layer);

        if (this._isStaticCall(layer, 'putTileAt')) { return null; }

        if (layer === null) { return null; }

        return TilemapComponents.PutTileAt(tile, tileX, tileY, recalculateFaces, layer);
    },

    /**
     * Puts a tile at the given world coordinates (pixels) in the specified layer. You can pass in either
     * an index or a Tile object. If you pass in a Tile, all attributes will be copied over to the
     * specified location. If you pass in an index, only the index at the specified location will be
     * changed. Collision information will be recalculated at the specified location.
     *
     * If no layer specified, the maps current layer is used. This
     * cannot be applied to StaticTilemapLayers.
     *
     * @method Phaser.Tilemaps.Tilemap#putTileAtWorldXY
     * @since 3.0.0
     *
     * @param {(integer|Phaser.Tilemaps.Tile)} tile - The index of this tile to set or a Tile object.
     * @param {number} worldX - The x coordinate, in pixels.
     * @param {number} worldY - The y coordinate, in pixels.
     * @param {boolean} [recalculateFaces=true] - `true` if the faces data should be recalculated.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tile} Returns a Tile, or null if the layer given was invalid.
     */
    putTileAtWorldXY: function (tile, worldX, worldY, recalculateFaces, camera, layer)
    {
        layer = this.getLayer(layer);

        if (this._isStaticCall(layer, 'putTileAtWorldXY')) { return null; }

        if (layer === null) { return null; }

        return TilemapComponents.PutTileAtWorldXY(tile, worldX, worldY, recalculateFaces, camera, layer);
    },

    /**
     * Puts an array of tiles or a 2D array of tiles at the given tile coordinates in the specified
     * layer. The array can be composed of either tile indexes or Tile objects. If you pass in a Tile,
     * all attributes will be copied over to the specified location. If you pass in an index, only the
     * index at the specified location will be changed. Collision information will be recalculated
     * within the region tiles were changed.
     *
     * If no layer specified, the maps current layer is used.
     * This cannot be applied to StaticTilemapLayers.
     *
     * @method Phaser.Tilemaps.Tilemap#putTilesAt
     * @since 3.0.0
     *
     * @param {(integer[]|integer[][]|Phaser.Tilemaps.Tile[]|Phaser.Tilemaps.Tile[][])} tile - A row (array) or grid (2D array) of Tiles or tile indexes to place.
     * @param {integer} tileX - The x coordinate, in tiles, not pixels.
     * @param {integer} tileY - The y coordinate, in tiles, not pixels.
     * @param {boolean} [recalculateFaces=true] - `true` if the faces data should be recalculated.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tilemap} Returns this, or null if the layer given was invalid.
     */
    putTilesAt: function (tilesArray, tileX, tileY, recalculateFaces, layer)
    {
        layer = this.getLayer(layer);

        if (this._isStaticCall(layer, 'putTilesAt')) { return this; }

        if (layer === null) { return null; }

        TilemapComponents.PutTilesAt(tilesArray, tileX, tileY, recalculateFaces, layer);

        return this;
    },

    /**
     * Randomizes the indexes of a rectangular region of tiles (in tile coordinates) within the
     * specified layer. Each tile will receive a new index. If an array of indexes is passed in, then
     * those will be used for randomly assigning new tile indexes. If an array is not provided, the
     * indexes found within the region (excluding -1) will be used for randomly assigning new tile
     * indexes. This method only modifies tile indexes and does not change collision information.
     *
     * If no layer specified, the maps current layer is used.
     * This cannot be applied to StaticTilemapLayers.
     *
     * @method Phaser.Tilemaps.Tilemap#randomize
     * @since 3.0.0
     *
     * @param {integer} [tileX=0] - The left most tile index (in tile coordinates) to use as the origin of the area.
     * @param {integer} [tileY=0] - The top most tile index (in tile coordinates) to use as the origin of the area.
     * @param {integer} [width=max width based on tileX] - How many tiles wide from the `tileX` index the area will be.
     * @param {integer} [height=max height based on tileY] - How many tiles tall from the `tileY` index the area will be.
     * @param {integer[]} [indexes] - An array of indexes to randomly draw from during randomization.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tilemap} Returns this, or null if the layer given was invalid.
     */
    randomize: function (tileX, tileY, width, height, indexes, layer)
    {
        layer = this.getLayer(layer);

        if (this._isStaticCall(layer, 'randomize')) { return this; }

        if (layer === null) { return null; }

        TilemapComponents.Randomize(tileX, tileY, width, height, indexes, layer);

        return this;
    },

    /**
     * Calculates interesting faces at the given tile coordinates of the specified layer. Interesting
     * faces are used internally for optimizing collisions against tiles. This method is mostly used
     * internally to optimize recalculating faces when only one tile has been changed.
     *
     * If no layer specified, the maps current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#calculateFacesAt
     * @since 3.0.0
     *
     * @param {integer} tileX - The x coordinate, in tiles, not pixels.
     * @param {integer} tileY - The y coordinate, in tiles, not pixels.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tilemap} Returns this, or null if the layer given was invalid.
     */
    calculateFacesAt: function (tileX, tileY, layer)
    {
        layer = this.getLayer(layer);

        if (layer === null) { return null; }

        TilemapComponents.CalculateFacesAt(tileX, tileY, layer);

        return this;
    },

    /**
     * Calculates interesting faces within the rectangular area specified (in tile coordinates) of the
     * layer. Interesting faces are used internally for optimizing collisions against tiles. This method
     * is mostly used internally.
     *
     * If no layer specified, the map's current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#calculateFacesWithin
     * @since 3.0.0
     *
     * @param {integer} [tileX=0] - The left most tile index (in tile coordinates) to use as the origin of the area.
     * @param {integer} [tileY=0] - The top most tile index (in tile coordinates) to use as the origin of the area.
     * @param {integer} [width=max width based on tileX] - How many tiles wide from the `tileX` index the area will be.
     * @param {integer} [height=max height based on tileY] - How many tiles tall from the `tileY` index the area will be.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tilemap} Returns this, or null if the layer given was invalid.
     */
    calculateFacesWithin: function (tileX, tileY, width, height, layer)
    {
        layer = this.getLayer(layer);

        if (layer === null) { return null; }

        TilemapComponents.CalculateFacesWithin(tileX, tileY, width, height, layer);

        return this;
    },

    /**
     * Removes the given TilemapLayer from this Tilemap without destroying it.
     *
     * If no layer specified, the map's current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#removeLayer
     * @since 3.17.0
     *
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to be removed.
     *
     * @return {?Phaser.Tilemaps.Tilemap} Returns this, or null if the layer given was invalid.
     */
    removeLayer: function (layer)
    {
        var index = this.getLayerIndex(layer);

        if (index !== null)
        {
            SpliceOne(this.layers, index);
            for (var i = index; i < this.layers.length; i++)
            {
                if (this.layers[i].tilemapLayer)
                {
                    this.layers[i].tilemapLayer.layerIndex--;
                }
            }

            if (this.currentLayerIndex === index)
            {
                this.currentLayerIndex = 0;
            }

            return this;
        }
        else
        {
            return null;
        }
    },

    /**
     * Destroys the given TilemapLayer and removes it from this Tilemap.
     *
     * If no layer specified, the map's current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#destroyLayer
     * @since 3.17.0
     *
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to be destroyed.
     *
     * @return {?Phaser.Tilemaps.Tilemap} Returns this, or null if the layer given was invalid.
     */
    destroyLayer: function (layer)
    {
        var index = this.getLayerIndex(layer);

        if (index !== null)
        {
            layer = this.layers[index];

            layer.destroy();

            SpliceOne(this.layers, index);

            if (this.currentLayerIndex === index)
            {
                this.currentLayerIndex = 0;
            }

            return this;
        }
        else
        {
            return null;
        }
    },

    /**
     * Removes all layers from this Tilemap and destroys any associated StaticTilemapLayers or
     * DynamicTilemapLayers.
     *
     * @method Phaser.Tilemaps.Tilemap#removeAllLayers
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.Tilemap} This Tilemap object.
     */
    removeAllLayers: function ()
    {
        var layers = this.layers;

        // Destroy any StaticTilemapLayers or DynamicTilemapLayers that are stored in LayerData
        for (var i = 0; i < layers.length; i++)
        {
            if (layers[i].tilemapLayer)
            {
                layers[i].tilemapLayer.destroy(false);
            }
        }

        layers.length = 0;

        this.currentLayerIndex = 0;

        return this;
    },

    /**
     * Removes the given Tile, or an array of Tiles, from the layer to which they belong,
     * and optionally recalculates the collision information.
     *
     * This cannot be applied to Tiles that belong to Static Tilemap Layers.
     *
     * @method Phaser.Tilemaps.Tilemap#removeTile
     * @since 3.17.0
     *
     * @param {(Phaser.Tilemaps.Tile|Phaser.Tilemaps.Tile[])} tiles - The Tile to remove, or an array of Tiles.
     * @param {integer} [replaceIndex=-1] - After removing the Tile, insert a brand new Tile into its location with the given index. Leave as -1 to just remove the tile.
     * @param {boolean} [recalculateFaces=true] - `true` if the faces data should be recalculated.
     *
     * @return {Phaser.Tilemaps.Tile[]} Returns an array of Tiles that were removed.
     */
    removeTile: function (tiles, replaceIndex, recalculateFaces)
    {
        if (replaceIndex === undefined) { replaceIndex = -1; }
        if (recalculateFaces === undefined) { recalculateFaces = true; }

        var removed = [];

        if (!Array.isArray(tiles))
        {
            tiles = [ tiles ];
        }

        for (var i = 0; i < tiles.length; i++)
        {
            var tile = tiles[i];

            removed.push(this.removeTileAt(tile.x, tile.y, true, recalculateFaces, tile.tilemapLayer));

            if (replaceIndex > -1)
            {
                this.putTileAt(replaceIndex, tile.x, tile.y, recalculateFaces, tile.tilemapLayer);
            }
        }

        return removed;
    },

    /**
     * Removes the tile at the given tile coordinates in the specified layer and updates the layer's
     * collision information.
     *
     * If no layer specified, the maps current layer is used.
     * This cannot be applied to StaticTilemapLayers.
     *
     * @method Phaser.Tilemaps.Tilemap#removeTileAt
     * @since 3.0.0
     *
     * @param {integer} tileX - The x coordinate, in tiles, not pixels.
     * @param {integer} tileY - The y coordinate, in tiles, not pixels.
     * @param {boolean} [replaceWithNull=true] - If true, this will replace the tile at the specified location with null instead of a Tile with an index of -1.
     * @param {boolean} [recalculateFaces=true] - `true` if the faces data should be recalculated.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tile} Returns the Tile that was removed, or null if the layer given was invalid.
     */
    removeTileAt: function (tileX, tileY, replaceWithNull, recalculateFaces, layer)
    {
        layer = this.getLayer(layer);

        if (this._isStaticCall(layer, 'removeTileAt')) { return null; }

        if (layer === null) { return null; }

        return TilemapComponents.RemoveTileAt(tileX, tileY, replaceWithNull, recalculateFaces, layer);
    },

    /**
     * Removes the tile at the given world coordinates in the specified layer and updates the layer's
     * collision information.
     *
     * If no layer specified, the maps current layer is used.
     * This cannot be applied to StaticTilemapLayers.
     *
     * @method Phaser.Tilemaps.Tilemap#removeTileAtWorldXY
     * @since 3.0.0
     *
     * @param {number} worldX - The x coordinate, in pixels.
     * @param {number} worldY - The y coordinate, in pixels.
     * @param {boolean} [replaceWithNull=true] - If true, this will replace the tile at the specified location with null instead of a Tile with an index of -1.
     * @param {boolean} [recalculateFaces=true] - `true` if the faces data should be recalculated.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tile} Returns a Tile, or null if the layer given was invalid.
     */
    removeTileAtWorldXY: function (worldX, worldY, replaceWithNull, recalculateFaces, camera, layer)
    {
        layer = this.getLayer(layer);

        if (this._isStaticCall(layer, 'removeTileAtWorldXY')) { return null; }

        if (layer === null) { return null; }

        return TilemapComponents.RemoveTileAtWorldXY(worldX, worldY, replaceWithNull, recalculateFaces, camera, layer);
    },

    /**
     * Draws a debug representation of the layer to the given Graphics. This is helpful when you want to
     * get a quick idea of which of your tiles are colliding and which have interesting faces. The tiles
     * are drawn starting at (0, 0) in the Graphics, allowing you to place the debug representation
     * wherever you want on the screen.
     *
     * If no layer specified, the maps current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#renderDebug
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Graphics} graphics - The target Graphics object to draw upon.
     * @param {Phaser.Types.Tilemaps.StyleConfig} styleConfig - An object specifying the colors to use for the debug drawing.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tilemap} Return this Tilemap object, or null if the layer given was invalid.
     */
    renderDebug: function (graphics, styleConfig, layer)
    {
        layer = this.getLayer(layer);

        if (layer === null) { return null; }

        TilemapComponents.RenderDebug(graphics, styleConfig, layer);

        return this;
    },

    /**
     * Draws a debug representation of all layers within this Tilemap to the given Graphics object.
     *
     * This is helpful when you want to get a quick idea of which of your tiles are colliding and which
     * have interesting faces. The tiles are drawn starting at (0, 0) in the Graphics, allowing you to
     * place the debug representation wherever you want on the screen.
     *
     * @method Phaser.Tilemaps.Tilemap#renderDebugFull
     * @since 3.17.0
     *
     * @param {Phaser.GameObjects.Graphics} graphics - The target Graphics object to draw upon.
     * @param {Phaser.Types.Tilemaps.StyleConfig} styleConfig - An object specifying the colors to use for the debug drawing.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tilemap} Return this Tilemap object, or null if the layer given was invalid.
     */
    renderDebugFull: function (graphics, styleConfig)
    {
        var layers = this.layers;

        // Destroy any StaticTilemapLayers or DynamicTilemapLayers that are stored in LayerData
        for (var i = 0; i < layers.length; i++)
        {
            TilemapComponents.RenderDebug(graphics, styleConfig, layers[i]);
        }

        return this;
    },

    /**
     * Scans the given rectangular area (given in tile coordinates) for tiles with an index matching
     * `findIndex` and updates their index to match `newIndex`. This only modifies the index and does
     * not change collision information.
     *
     * If no layer specified, the maps current layer is used.
     * This cannot be applied to StaticTilemapLayers.
     *
     * @method Phaser.Tilemaps.Tilemap#replaceByIndex
     * @since 3.0.0
     *
     * @param {integer} findIndex - The index of the tile to search for.
     * @param {integer} newIndex - The index of the tile to replace it with.
     * @param {integer} [tileX=0] - The left most tile index (in tile coordinates) to use as the origin of the area.
     * @param {integer} [tileY=0] - The top most tile index (in tile coordinates) to use as the origin of the area.
     * @param {integer} [width=max width based on tileX] - How many tiles wide from the `tileX` index the area will be.
     * @param {integer} [height=max height based on tileY] - How many tiles tall from the `tileY` index the area will be.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tilemap} Return this Tilemap object, or null if the layer given was invalid.
     */
    replaceByIndex: function (findIndex, newIndex, tileX, tileY, width, height, layer)
    {
        layer = this.getLayer(layer);

        if (this._isStaticCall(layer, 'replaceByIndex')) { return this; }

        if (layer === null) { return null; }

        TilemapComponents.ReplaceByIndex(findIndex, newIndex, tileX, tileY, width, height, layer);

        return this;
    },

    /**
     * Sets collision on the given tile or tiles within a layer by index. You can pass in either a
     * single numeric index or an array of indexes: [2, 3, 15, 20]. The `collides` parameter controls if
     * collision will be enabled (true) or disabled (false).
     *
     * If no layer specified, the map's current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#setCollision
     * @since 3.0.0
     *
     * @param {(integer|array)} indexes - Either a single tile index, or an array of tile indexes.
     * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear collision.
     * @param {boolean} [recalculateFaces=true] - Whether or not to recalculate the tile faces after the update.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     * @param {boolean} [updateLayer=true] - If true, updates the current tiles on the layer. Set to false if no tiles have been placed for significant performance boost.
     *
     * @return {?Phaser.Tilemaps.Tilemap} Return this Tilemap object, or null if the layer given was invalid.
     */
    setCollision: function (indexes, collides, recalculateFaces, layer, updateLayer)
    {
        layer = this.getLayer(layer);

        if (layer === null) { return null; }

        TilemapComponents.SetCollision(indexes, collides, recalculateFaces, layer, updateLayer);

        return this;
    },

    /**
     * Sets collision on a range of tiles in a layer whose index is between the specified `start` and
     * `stop` (inclusive). Calling this with a start value of 10 and a stop value of 14 would set
     * collision for tiles 10, 11, 12, 13 and 14. The `collides` parameter controls if collision will be
     * enabled (true) or disabled (false).
     *
     * If no layer specified, the map's current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#setCollisionBetween
     * @since 3.0.0
     *
     * @param {integer} start - The first index of the tile to be set for collision.
     * @param {integer} stop - The last index of the tile to be set for collision.
     * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear collision.
     * @param {boolean} [recalculateFaces=true] - Whether or not to recalculate the tile faces after the update.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tilemap} Return this Tilemap object, or null if the layer given was invalid.
     */
    setCollisionBetween: function (start, stop, collides, recalculateFaces, layer)
    {
        layer = this.getLayer(layer);

        if (layer === null) { return null; }

        TilemapComponents.SetCollisionBetween(start, stop, collides, recalculateFaces, layer);

        return this;
    },

    /**
     * Sets collision on the tiles within a layer by checking tile properties. If a tile has a property
     * that matches the given properties object, its collision flag will be set. The `collides`
     * parameter controls if collision will be enabled (true) or disabled (false). Passing in
     * `{ collides: true }` would update the collision flag on any tiles with a "collides" property that
     * has a value of true. Any tile that doesn't have "collides" set to true will be ignored. You can
     * also use an array of values, e.g. `{ types: ["stone", "lava", "sand" ] }`. If a tile has a
     * "types" property that matches any of those values, its collision flag will be updated.
     *
     * If no layer specified, the map's current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#setCollisionByProperty
     * @since 3.0.0
     *
     * @param {object} properties - An object with tile properties and corresponding values that should be checked.
     * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear collision.
     * @param {boolean} [recalculateFaces=true] - Whether or not to recalculate the tile faces after the update.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tilemap} Return this Tilemap object, or null if the layer given was invalid.
     */
    setCollisionByProperty: function (properties, collides, recalculateFaces, layer)
    {
        layer = this.getLayer(layer);

        if (layer === null) { return null; }

        TilemapComponents.SetCollisionByProperty(properties, collides, recalculateFaces, layer);

        return this;
    },

    /**
     * Sets collision on all tiles in the given layer, except for tiles that have an index specified in
     * the given array. The `collides` parameter controls if collision will be enabled (true) or
     * disabled (false).
     *
     * If no layer specified, the map's current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#setCollisionByExclusion
     * @since 3.0.0
     *
     * @param {integer[]} indexes - An array of the tile indexes to not be counted for collision.
     * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear collision.
     * @param {boolean} [recalculateFaces=true] - Whether or not to recalculate the tile faces after the update.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tilemap} Return this Tilemap object, or null if the layer given was invalid.
     */
    setCollisionByExclusion: function (indexes, collides, recalculateFaces, layer)
    {
        layer = this.getLayer(layer);

        if (layer === null) { return null; }

        TilemapComponents.SetCollisionByExclusion(indexes, collides, recalculateFaces, layer);

        return this;
    },

    /**
     * Sets collision on the tiles within a layer by checking each tile's collision group data
     * (typically defined in Tiled within the tileset collision editor). If any objects are found within
     * a tile's collision group, the tile's colliding information will be set. The `collides` parameter
     * controls if collision will be enabled (true) or disabled (false).
     *
     * If no layer specified, the map's current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#setCollisionFromCollisionGroup
     * @since 3.0.0
     *
     * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear collision.
     * @param {boolean} [recalculateFaces=true] - Whether or not to recalculate the tile faces after the update.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tilemap} Return this Tilemap object, or null if the layer given was invalid.
     */
    setCollisionFromCollisionGroup: function (collides, recalculateFaces, layer)
    {
        layer = this.getLayer(layer);

        if (layer === null) { return null; }

        TilemapComponents.SetCollisionFromCollisionGroup(collides, recalculateFaces, layer);

        return this;
    },

    /**
     * Sets a global collision callback for the given tile index within the layer. This will affect all
     * tiles on this layer that have the same index. If a callback is already set for the tile index it
     * will be replaced. Set the callback to null to remove it. If you want to set a callback for a tile
     * at a specific location on the map then see setTileLocationCallback.
     *
     * If no layer specified, the map's current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#setTileIndexCallback
     * @since 3.0.0
     *
     * @param {(integer|array)} indexes - Either a single tile index, or an array of tile indexes to have a collision callback set for.
     * @param {function} callback - The callback that will be invoked when the tile is collided with.
     * @param {object} callbackContext - The context under which the callback is called.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tilemap} Return this Tilemap object, or null if the layer given was invalid.
     */
    setTileIndexCallback: function (indexes, callback, callbackContext, layer)
    {
        layer = this.getLayer(layer);

        if (layer === null) { return null; }

        TilemapComponents.SetTileIndexCallback(indexes, callback, callbackContext, layer);

        return this;
    },

    /**
     * Sets a collision callback for the given rectangular area (in tile coordinates) within the layer.
     * If a callback is already set for the tile index it will be replaced. Set the callback to null to
     * remove it.
     *
     * If no layer specified, the map's current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#setTileLocationCallback
     * @since 3.0.0
     *
     * @param {integer} tileX - The left most tile index (in tile coordinates) to use as the origin of the area.
     * @param {integer} tileY - The top most tile index (in tile coordinates) to use as the origin of the area.
     * @param {integer} width - How many tiles wide from the `tileX` index the area will be.
     * @param {integer} height - How many tiles tall from the `tileY` index the area will be.
     * @param {function} callback - The callback that will be invoked when the tile is collided with.
     * @param {object} [callbackContext] - The context under which the callback is called.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tilemap} Return this Tilemap object, or null if the layer given was invalid.
     */
    setTileLocationCallback: function (tileX, tileY, width, height, callback, callbackContext, layer)
    {
        layer = this.getLayer(layer);

        if (layer === null) { return null; }

        TilemapComponents.SetTileLocationCallback(tileX, tileY, width, height, callback, callbackContext, layer);

        return this;
    },

    /**
     * Sets the current layer to the LayerData associated with `layer`.
     *
     * @method Phaser.Tilemaps.Tilemap#setLayer
     * @since 3.0.0
     *
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The name of the
     * layer from Tiled, the index of the layer in the map, a DynamicTilemapLayer or a
     * StaticTilemapLayer. If not given will default to the map's current layer index.
     *
     * @return {Phaser.Tilemaps.Tilemap} This Tilemap object.
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
     * @method Phaser.Tilemaps.Tilemap#setBaseTileSize
     * @since 3.0.0
     *
     * @param {integer} tileWidth - The width of the tiles the map uses for calculations.
     * @param {integer} tileHeight - The height of the tiles the map uses for calculations.
     *
     * @return {Phaser.Tilemaps.Tilemap} This Tilemap object.
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
            this.layers[i].baseTileWidth = tileWidth;
            this.layers[i].baseTileHeight = tileHeight;

            var mapData = this.layers[i].data;
            var mapWidth = this.layers[i].width;
            var mapHeight = this.layers[i].height;

            for (var row = 0; row < mapHeight; row++)
            {
                for (var col = 0; col < mapWidth; col++)
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
     * @method Phaser.Tilemaps.Tilemap#setLayerTileSize
     * @since 3.0.0
     *
     * @param {integer} tileWidth - The width of the tiles (in pixels) in the layer.
     * @param {integer} tileHeight - The height of the tiles (in pixels) in the layer.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The name of the
     * layer from Tiled, the index of the layer in the map, a DynamicTilemapLayer or a
     * StaticTilemapLayer. If not given will default to the map's current layer index.
     *
     * @return {Phaser.Tilemaps.Tilemap} This Tilemap object.
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

        for (var row = 0; row < mapHeight; row++)
        {
            for (var col = 0; col < mapWidth; col++)
            {
                var tile = mapData[row][col];

                if (tile !== null)
                {
                    tile.setSize(tileWidth, tileHeight);
                }
            }
        }

        return this;
    },

    /**
     * Shuffles the tiles in a rectangular region (specified in tile coordinates) within the given
     * layer. It will only randomize the tiles in that area, so if they're all the same nothing will
     * appear to have changed! This method only modifies tile indexes and does not change collision
     * information.
     *
     * If no layer specified, the maps current layer is used.
     * This cannot be applied to StaticTilemapLayers.
     *
     * @method Phaser.Tilemaps.Tilemap#shuffle
     * @since 3.0.0
     *
     * @param {integer} [tileX=0] - The left most tile index (in tile coordinates) to use as the origin of the area.
     * @param {integer} [tileY=0] - The top most tile index (in tile coordinates) to use as the origin of the area.
     * @param {integer} [width=max width based on tileX] - How many tiles wide from the `tileX` index the area will be.
     * @param {integer} [height=max height based on tileY] - How many tiles tall from the `tileY` index the area will be.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tilemap} Return this Tilemap object, or null if the layer given was invalid.
     */
    shuffle: function (tileX, tileY, width, height, layer)
    {
        layer = this.getLayer(layer);

        if (this._isStaticCall(layer, 'shuffle')) { return this; }

        if (layer === null) { return null; }

        TilemapComponents.Shuffle(tileX, tileY, width, height, layer);

        return this;
    },

    /**
     * Scans the given rectangular area (given in tile coordinates) for tiles with an index matching
     * `indexA` and swaps then with `indexB`. This only modifies the index and does not change collision
     * information.
     *
     * If no layer specified, the maps current layer is used.
     * This cannot be applied to StaticTilemapLayers.
     *
     * @method Phaser.Tilemaps.Tilemap#swapByIndex
     * @since 3.0.0
     *
     * @param {integer} tileA - First tile index.
     * @param {integer} tileB - Second tile index.
     * @param {integer} [tileX=0] - The left most tile index (in tile coordinates) to use as the origin of the area.
     * @param {integer} [tileY=0] - The top most tile index (in tile coordinates) to use as the origin of the area.
     * @param {integer} [width=max width based on tileX] - How many tiles wide from the `tileX` index the area will be.
     * @param {integer} [height=max height based on tileY] - How many tiles tall from the `tileY` index the area will be.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tilemap} Return this Tilemap object, or null if the layer given was invalid.
     */
    swapByIndex: function (indexA, indexB, tileX, tileY, width, height, layer)
    {
        layer = this.getLayer(layer);

        if (this._isStaticCall(layer, 'swapByIndex')) { return this; }

        if (layer === null) { return null; }

        TilemapComponents.SwapByIndex(indexA, indexB, tileX, tileY, width, height, layer);

        return this;
    },

    /**
     * Converts from tile X coordinates (tile units) to world X coordinates (pixels), factoring in the
     * layers position, scale and scroll.
     *
     * If no layer specified, the maps current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#tileToWorldX
     * @since 3.0.0
     *
     * @param {integer} tileX - The x coordinate, in tiles, not pixels.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?number} Returns a number, or null if the layer given was invalid.
     */
    tileToWorldX: function (tileX, camera, layer)
    {
        layer = this.getLayer(layer);

        if (layer === null) { return null; }

        return TilemapComponents.TileToWorldX(tileX, camera, layer);
    },

    /**
     * Converts from tile Y coordinates (tile units) to world Y coordinates (pixels), factoring in the
     * layers position, scale and scroll.
     *
     * If no layer specified, the maps current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#tileToWorldY
     * @since 3.0.0
     *
     * @param {integer} tileY - The y coordinate, in tiles, not pixels.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer
     * to use. If not given the current layer is used.
     *
     * @return {?number} Returns a number, or null if the layer given was invalid.
     */
    tileToWorldY: function (tileX, camera, layer)
    {
        layer = this.getLayer(layer);

        if (layer === null) { return null; }

        return TilemapComponents.TileToWorldY(tileX, camera, layer);
    },

    /**
     * Converts from tile XY coordinates (tile units) to world XY coordinates (pixels), factoring in the
     * layers position, scale and scroll. This will return a new Vector2 object or update the given
     * `point` object.
     *
     * If no layer specified, the maps current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#tileToWorldXY
     * @since 3.0.0
     *
     * @param {integer} tileX - The x coordinate, in tiles, not pixels.
     * @param {integer} tileY - The y coordinate, in tiles, not pixels.
     * @param {Phaser.Math.Vector2} [point] - A Vector2 to store the coordinates in. If not given a new Vector2 is created.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Math.Vector2} Returns a point, or null if the layer given was invalid.
     */
    tileToWorldXY: function (tileX, tileY, point, camera, layer)
    {
        layer = this.getLayer(layer);

        if (layer === null) { return null; }

        return TilemapComponents.TileToWorldXY(tileX, tileY, point, camera, layer);
    },

    /**
     * Randomizes the indexes of a rectangular region of tiles (in tile coordinates) within the
     * specified layer. Each tile will receive a new index. New indexes are drawn from the given
     * weightedIndexes array. An example weighted array:
     *
     * [
     *  { index: 6, weight: 4 },    // Probability of index 6 is 4 / 8
     *  { index: 7, weight: 2 },    // Probability of index 7 would be 2 / 8
     *  { index: 8, weight: 1.5 },  // Probability of index 8 would be 1.5 / 8
     *  { index: 26, weight: 0.5 }  // Probability of index 27 would be 0.5 / 8
     * ]
     *
     * The probability of any index being choose is (the index's weight) / (sum of all weights). This
     * method only modifies tile indexes and does not change collision information.
     *
     * If no layer specified, the map's current layer is used. This
     * cannot be applied to StaticTilemapLayers.
     *
     * @method Phaser.Tilemaps.Tilemap#weightedRandomize
     * @since 3.0.0
     *
     * @param {integer} [tileX=0] - The left most tile index (in tile coordinates) to use as the origin of the area.
     * @param {integer} [tileY=0] - The top most tile index (in tile coordinates) to use as the origin of the area.
     * @param {integer} [width=max width based on tileX] - How many tiles wide from the `tileX` index the area will be.
     * @param {integer} [height=max height based on tileY] - How many tiles tall from the `tileY` index the area will be.
     * @param {object[]} [weightedIndexes] - An array of objects to randomly draw from during
     * randomization. They should be in the form: { index: 0, weight: 4 } or
     * { index: [0, 1], weight: 4 } if you wish to draw from multiple tile indexes.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Tilemaps.Tilemap} Return this Tilemap object, or null if the layer given was invalid.
     */
    weightedRandomize: function (tileX, tileY, width, height, weightedIndexes, layer)
    {
        layer = this.getLayer(layer);

        if (this._isStaticCall(layer, 'weightedRandomize')) { return this; }

        if (layer === null) { return null; }

        TilemapComponents.WeightedRandomize(tileX, tileY, width, height, weightedIndexes, layer);

        return this;
    },

    /**
     * Converts from world X coordinates (pixels) to tile X coordinates (tile units), factoring in the
     * layers position, scale and scroll.
     *
     * If no layer specified, the maps current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#worldToTileX
     * @since 3.0.0
     *
     * @param {number} worldX - The x coordinate to be converted, in pixels, not tiles.
     * @param {boolean} [snapToFloor=true] - Whether or not to round the tile coordinate down to the nearest integer.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer
     * to use. If not given the current layer is used.
     *
     * @return {?number} Returns a number, or null if the layer given was invalid.
     */
    worldToTileX: function (worldX, snapToFloor, camera, layer)
    {
        layer = this.getLayer(layer);

        if (layer === null) { return null; }

        return TilemapComponents.WorldToTileX(worldX, snapToFloor, camera, layer);
    },

    /**
     * Converts from world Y coordinates (pixels) to tile Y coordinates (tile units), factoring in the
     * layers position, scale and scroll.
     *
     * If no layer specified, the maps current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#worldToTileY
     * @since 3.0.0
     *
     * @param {number} worldY - The y coordinate to be converted, in pixels, not tiles.
     * @param {boolean} [snapToFloor=true] - Whether or not to round the tile coordinate down to the nearest integer.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?number} Returns a number, or null if the layer given was invalid.
     */
    worldToTileY: function (worldY, snapToFloor, camera, layer)
    {
        layer = this.getLayer(layer);

        if (layer === null) { return null; }

        return TilemapComponents.WorldToTileY(worldY, snapToFloor, camera, layer);
    },

    /**
     * Converts from world XY coordinates (pixels) to tile XY coordinates (tile units), factoring in the
     * layers position, scale and scroll. This will return a new Vector2 object or update the given
     * `point` object.
     *
     * If no layer specified, the maps current layer is used.
     *
     * @method Phaser.Tilemaps.Tilemap#worldToTileXY
     * @since 3.0.0
     *
     * @param {number} worldX - The x coordinate to be converted, in pixels, not tiles.
     * @param {number} worldY - The y coordinate to be converted, in pixels, not tiles.
     * @param {boolean} [snapToFloor=true] - Whether or not to round the tile coordinate down to the nearest integer.
     * @param {Phaser.Math.Vector2} [point] - A Vector2 to store the coordinates in. If not given a new Vector2 is created.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
     * @param {(string|integer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} [layer] - The tile layer to use. If not given the current layer is used.
     *
     * @return {?Phaser.Math.Vector2} Returns a point, or null if the layer given was invalid.
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
     * @method Phaser.Tilemaps.Tilemap#_isStaticCall
     * @private
     * @since 3.0.0
     *
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
