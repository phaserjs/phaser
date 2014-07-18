/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Creates a new Phaser.Tilemap object. The map can either be populated with data from a Tiled JSON file or from a CSV file.
* To do this pass the Cache key as the first parameter. When using Tiled data you need only provide the key.
* When using CSV data you must provide the key and the tileWidth and tileHeight parameters.
* If creating a blank tilemap to be populated later, you can either specify no parameters at all and then use `Tilemap.create` or pass the map and tile dimensions here.
* Note that all Tilemaps use a base tile size to calculate dimensions from, but that a TilemapLayer may have its own unique tile size that overrides it.
* A Tile map is rendered to the display using a TilemapLayer. It is not added to the display list directly itself.
* A map may have multiple layers. You can perform operations on the map data such as copying, pasting, filling and shuffling the tiles around.
*
* @class Phaser.Tilemap
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
* @param {string} [key] - The key of the tilemap data as stored in the Cache. If you're creating a blank map either leave this parameter out or pass `null`.
* @param {number} [tileWidth=32] - The pixel width of a single map tile. If using CSV data you must specify this. Not required if using Tiled map data.
* @param {number} [tileHeight=32] - The pixel height of a single map tile. If using CSV data you must specify this. Not required if using Tiled map data.
* @param {number} [width=10] - The width of the map in tiles. If this map is created from Tiled or CSV data you don't need to specify this.
* @param {number} [height=10] - The height of the map in tiles. If this map is created from Tiled or CSV data you don't need to specify this.
*/
Phaser.Tilemap = function (game, key, tileWidth, tileHeight, width, height) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

    /**
    * @property {string} key - The key of this map data in the Phaser.Cache.
    */
    this.key = key;

    var data = Phaser.TilemapParser.parse(this.game, key, tileWidth, tileHeight, width, height);

    if (data === null)
    {
        return;
    }

    /**
    * @property {number} width - The width of the map (in tiles).
    */
    this.width = data.width;

    /**
    * @property {number} height - The height of the map (in tiles).
    */
    this.height = data.height;

    /**
    * @property {number} tileWidth - The base width of the tiles in the map (in pixels).
    */
    this.tileWidth = data.tileWidth;

    /**
    * @property {number} tileHeight - The base height of the tiles in the map (in pixels).
    */
    this.tileHeight = data.tileHeight;

    /**
    * @property {string} orientation - The orientation of the map data (as specified in Tiled), usually 'orthogonal'.
    */
    this.orientation = data.orientation;

    /**
    * @property {number} format - The format of the map data, either Phaser.Tilemap.CSV or Phaser.Tilemap.TILED_JSON.
    */
    this.format = data.format;

    /**
    * @property {number} version - The version of the map data (as specified in Tiled, usually 1).
    */
    this.version = data.version;

    /**
    * @property {object} properties - Map specific properties as specified in Tiled.
    */
    this.properties = data.properties;

    /**
    * @property {number} widthInPixels - The width of the map in pixels based on width * tileWidth.
    */
    this.widthInPixels = data.widthInPixels;

    /**
    * @property {number} heightInPixels - The height of the map in pixels based on height * tileHeight.
    */
    this.heightInPixels = data.heightInPixels;

    /**
    * @property {array} layers - An array of Tilemap layer data.
    */
    this.layers = data.layers;

    /**
    * @property {array} tilesets - An array of Tilesets.
    */
    this.tilesets = data.tilesets;

    /**
    * @property {array} tiles - The super array of Tiles.
    */
    this.tiles = data.tiles;

    /**
    * @property {array} objects - An array of Tiled Object Layers.
    */
    this.objects = data.objects;

    /**
    * @property {array} collideIndexes - An array of tile indexes that collide.
    */
    this.collideIndexes = [];

    /**
    * @property {array} collision - An array of collision data (polylines, etc).
    */
    this.collision = data.collision;

    /**
    * @property {array} images - An array of Tiled Image Layers.
    */
    this.images = data.images;

    /**
    * @property {number} currentLayer - The current layer.
    */
    this.currentLayer = 0;

    /**
    * @property {array} debugMap - Map data used for debug values only.
    */
    this.debugMap = [];

    /**
    * @property {array} _results - Internal var.
    * @private
    */
    this._results = [];

    /**
    * @property {number} _tempA - Internal var.
    * @private
    */
    this._tempA = 0;

    /**
    * @property {number} _tempB - Internal var.
    * @private
    */
    this._tempB = 0;

};

/**
* @constant
* @type {number}
*/
Phaser.Tilemap.CSV = 0;

/**
* @constant
* @type {number}
*/
Phaser.Tilemap.TILED_JSON = 1;

/**
* @constant
* @type {number}
*/
Phaser.Tilemap.NORTH = 0;

/**
* @constant
* @type {number}
*/
Phaser.Tilemap.EAST = 1;

/**
* @constant
* @type {number}
*/
Phaser.Tilemap.SOUTH = 2;

/**
* @constant
* @type {number}
*/
Phaser.Tilemap.WEST = 3;

Phaser.Tilemap.prototype = {

    /**
    * Creates an empty map of the given dimensions and one blank layer. If layers already exist they are erased.
    *
    * @method Phaser.Tilemap#create
    * @param {string} name - The name of the default layer of the map.
    * @param {number} width - The width of the map in tiles.
    * @param {number} height - The height of the map in tiles.
    * @param {number} tileWidth - The width of the tiles the map uses for calculations.
    * @param {number} tileHeight - The height of the tiles the map uses for calculations.
    * @param {Phaser.Group} [group] - Optional Group to add the layer to. If not specified it will be added to the World group.
    * @return {Phaser.TilemapLayer} The TilemapLayer object. This is an extension of Phaser.Image and can be moved around the display list accordingly.
    */
    create: function (name, width, height, tileWidth, tileHeight, group) {

        if (typeof group === 'undefined') { group = this.game.world; }

        this.width = width;
        this.height = height;

        this.setTileSize(tileWidth, tileHeight);

        this.layers.length = 0;

        return this.createBlankLayer(name, width, height, tileWidth, tileHeight, group);

    },

    /**
    * Sets the base tile size for the map.
    *
    * @method Phaser.Tilemap#setTileSize
    * @param {number} tileWidth - The width of the tiles the map uses for calculations.
    * @param {number} tileHeight - The height of the tiles the map uses for calculations.
    */
    setTileSize: function (tileWidth, tileHeight) {

        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.widthInPixels = this.width * tileWidth;
        this.heightInPixels = this.height * tileHeight;

    },

    /**
    * Adds an image to the map to be used as a tileset. A single map may use multiple tilesets.
    * Note that the tileset name can be found in the JSON file exported from Tiled, or in the Tiled editor.
    *
    * @method Phaser.Tilemap#addTilesetImage
    * @param {string} tileset - The name of the tileset as specified in the map data.
    * @param {string} [key] - The key of the Phaser.Cache image used for this tileset. If not specified it will look for an image with a key matching the tileset parameter.
    * @param {number} [tileWidth=32] - The width of the tiles in the Tileset Image. If not given it will default to the map.tileWidth value, if that isn't set then 32.
    * @param {number} [tileHeight=32] - The height of the tiles in the Tileset Image. If not given it will default to the map.tileHeight value, if that isn't set then 32.
    * @param {number} [tileMargin=0] - The width of the tiles in the Tileset Image. If not given it will default to the map.tileWidth value.
    * @param {number} [tileSpacing=0] - The height of the tiles in the Tileset Image. If not given it will default to the map.tileHeight value.
    * @param {number} [gid=0] - If adding multiple tilesets to a blank/dynamic map, specify the starting GID the set will use here.
    * @return {Phaser.Tileset} Returns the Tileset object that was created or updated, or null if it failed.
    */
    addTilesetImage: function (tileset, key, tileWidth, tileHeight, tileMargin, tileSpacing, gid) {

        if (typeof tileWidth === 'undefined') { tileWidth = this.tileWidth; }
        if (typeof tileHeight === 'undefined') { tileHeight = this.tileHeight; }
        if (typeof tileMargin === 'undefined') { tileMargin = 0; }
        if (typeof tileSpacing === 'undefined') { tileSpacing = 0; }
        if (typeof gid === 'undefined') { gid = 0; }

        //  In-case we're working from a blank map
        if (tileWidth === 0)
        {
            tileWidth = 32;
        }

        if (tileHeight === 0)
        {
            tileHeight = 32;
        }

        if (typeof key === 'undefined')
        {
            if (typeof tileset === 'string')
            {
                key = tileset;

                if (!this.game.cache.checkImageKey(key))
                {
                    console.warn('Phaser.Tilemap.addTilesetImage: Invalid image key given: "' + key + '"');
                    return null;
                }
            }
            else
            {
                return null;
            }
        }

        if (typeof tileset === 'string')
        {
            tileset = this.getTilesetIndex(tileset);

            if (tileset === null && this.format === Phaser.Tilemap.TILED_JSON)
            {
                console.warn('Phaser.Tilemap.addTilesetImage: No data found in the JSON matching the tileset name: "' + key + '"');
                return null;
            }
        }

        if (this.tilesets[tileset])
        {
            this.tilesets[tileset].setImage(this.game.cache.getImage(key));
            return this.tilesets[tileset];
        }
        else
        {
            var newSet = new Phaser.Tileset(key, gid, tileWidth, tileHeight, tileMargin, tileSpacing, {});

            newSet.setImage(this.game.cache.getImage(key));

            this.tilesets.push(newSet);

            var i = this.tilesets.length - 1;
            var x = tileMargin;
            var y = tileMargin;

            var count = 0;
            var countX = 0;
            var countY = 0;

            for (var t = gid; t < gid + newSet.total; t++)
            {
                this.tiles[t] = [x, y, i];

                x += tileWidth + tileSpacing;

                count++;

                if (count === newSet.total)
                {
                    break;
                }

                countX++;

                if (countX === newSet.columns)
                {
                    x = tileMargin;
                    y += tileHeight + tileSpacing;

                    countX = 0;
                    countY++;

                    if (countY === newSet.rows)
                    {
                        break;
                    }
                }
            }

            return newSet;

        }

        return null;

    },

    /**
    * Creates a Sprite for every object matching the given gid in the map data. You can optionally specify the group that the Sprite will be created in. If none is
    * given it will be created in the World. All properties from the map data objectgroup are copied across to the Sprite, so you can use this as an easy way to
    * configure Sprite properties from within the map editor. For example giving an object a property of alpha: 0.5 in the map editor will duplicate that when the
    * Sprite is created. You could also give it a value like: body.velocity.x: 100 to set it moving automatically.
    *
    * @method Phaser.Tilemap#createFromObjects
    * @param {string} name - The name of the Object Group to create Sprites from.
    * @param {number} gid - The layer array index value, or if a string is given the layer name within the map data.
    * @param {string} key - The Game.cache key of the image that this Sprite will use.
    * @param {number|string} [frame] - If the Sprite image contains multiple frames you can specify which one to use here.
    * @param {boolean} [exists=true] - The default exists state of the Sprite.
    * @param {boolean} [autoCull=false] - The default autoCull state of the Sprite. Sprites that are autoCulled are culled from the camera if out of its range.
    * @param {Phaser.Group} [group=Phaser.World] - Group to add the Sprite to. If not specified it will be added to the World group.
    * @param {object} [CustomClass=Phaser.Sprite] - If you wish to create your own class, rather than Phaser.Sprite, pass the class here. Your class must extend Phaser.Sprite and have the same constructor parameters.
    * @param {boolean} [adjustY=true] - By default the Tiled map editor uses a bottom-left coordinate system. Phaser uses top-left. So most objects will appear too low down. This parameter moves them up by their height.
    */
    createFromObjects: function (name, gid, key, frame, exists, autoCull, group, CustomClass, adjustY) {

        if (typeof exists === 'undefined') { exists = true; }
        if (typeof autoCull === 'undefined') { autoCull = false; }
        if (typeof group === 'undefined') { group = this.game.world; }
        if (typeof CustomClass === 'undefined') { CustomClass = Phaser.Sprite; }
        if (typeof adjustY === 'undefined') { adjustY = true; }

        if (!this.objects[name])
        {
            console.warn('Tilemap.createFromObjects: Invalid objectgroup name given: ' + name);
            return;
        }

        var sprite;

        for (var i = 0, len = this.objects[name].length; i < len; i++)
        {
            if (this.objects[name][i].gid === gid)
            {
                sprite = new CustomClass(this.game, this.objects[name][i].x, this.objects[name][i].y, key, frame);

                sprite.name = this.objects[name][i].name;
                sprite.visible = this.objects[name][i].visible;
                sprite.autoCull = autoCull;
                sprite.exists = exists;

                if (adjustY)
                {
                    sprite.y -= sprite.height;
                }

                group.add(sprite);

                for (var property in this.objects[name][i].properties)
                {
                    group.set(sprite, property, this.objects[name][i].properties[property], false, false, 0, true);
                }
            }
        }

    },

    /**
    * Creates a new TilemapLayer object. By default TilemapLayers are fixed to the camera.
    * The `layer` parameter is important. If you've created your map in Tiled then you can get this by looking in Tiled and looking at the Layer name.
    * Or you can open the JSON file it exports and look at the layers[].name value. Either way it must match.
    * If you wish to create a blank layer to put your own tiles on then see Tilemap.createBlankLayer.
    *
    * @method Phaser.Tilemap#createLayer
    * @param {number|string} layer - The layer array index value, or if a string is given the layer name, within the map data that this TilemapLayer represents.
    * @param {number} [width] - The rendered width of the layer, should never be wider than Game.width. If not given it will be set to Game.width.
    * @param {number} [height] - The rendered height of the layer, should never be wider than Game.height. If not given it will be set to Game.height.
    * @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
    * @return {Phaser.TilemapLayer} The TilemapLayer object. This is an extension of Phaser.Sprite and can be moved around the display list accordingly.
    */
    createLayer: function (layer, width, height, group) {

        //  Add Buffer support for the left of the canvas

        if (typeof width === 'undefined') { width = this.game.width; }
        if (typeof height === 'undefined') { height = this.game.height; }
        if (typeof group === 'undefined') { group = this.game.world; }

        var index = layer;

        if (typeof layer === 'string')
        {
            index = this.getLayerIndex(layer);
        }

        if (index === null || index > this.layers.length)
        {
            console.warn('Tilemap.createLayer: Invalid layer ID given: ' + index);
            return;
        }

        return group.add(new Phaser.TilemapLayer(this.game, this, index, width, height));

    },

    /**
    * Creates a new and empty layer on this Tilemap. By default TilemapLayers are fixed to the camera.
    *
    * @method Phaser.Tilemap#createBlankLayer
    * @param {string} name - The name of this layer. Must be unique within the map.
    * @param {number} width - The width of the layer in tiles.
    * @param {number} height - The height of the layer in tiles.
    * @param {number} tileWidth - The width of the tiles the layer uses for calculations.
    * @param {number} tileHeight - The height of the tiles the layer uses for calculations.
    * @param {Phaser.Group} [group] - Optional Group to add the layer to. If not specified it will be added to the World group.
    * @return {Phaser.TilemapLayer} The TilemapLayer object. This is an extension of Phaser.Image and can be moved around the display list accordingly.
    */
    createBlankLayer: function (name, width, height, tileWidth, tileHeight, group) {

        if (typeof group === 'undefined') { group = this.game.world; }

        if (this.getLayerIndex(name) !== null)
        {
            console.warn('Tilemap.createBlankLayer: Layer with matching name already exists');
            return;
        }

        var layer = {

            name: name,
            x: 0,
            y: 0,
            width: width,
            height: height,
            widthInPixels: width * tileWidth,
            heightInPixels: height * tileHeight,
            alpha: 1,
            visible: true,
            properties: {},
            indexes: [],
            callbacks: [],
            bodies: [],
            data: null

        };

        var row;
        var output = [];

        for (var y = 0; y < height; y++)
        {
            row = [];

            for (var x = 0; x < width; x++)
            {
                // row.push(null);
                row.push(new Phaser.Tile(layer, -1, x, y, tileWidth, tileHeight));
            }

            output.push(row);
        }

        layer.data = output;

        this.layers.push(layer);

        this.currentLayer = this.layers.length - 1;

        var w = layer.widthInPixels;
        var h = layer.heightInPixels;

        if (w > this.game.width)
        {
            w = this.game.width;
        }

        if (h > this.game.height)
        {
            h = this.game.height;
        }

        var output = new Phaser.TilemapLayer(this.game, this, this.layers.length - 1, w, h);
        output.name = name;

        return group.add(output);

    },

    /**
    * Gets the layer index based on the layers name.
    *
    * @method Phaser.Tilemap#getIndex
    * @protected
    * @param {array} location - The local array to search.
    * @param {string} name - The name of the array element to get.
    * @return {number} The index of the element in the array, or null if not found.
    */
    getIndex: function (location, name) {

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
    * Gets the layer index based on its name.
    *
    * @method Phaser.Tilemap#getLayerIndex
    * @param {string} name - The name of the layer to get.
    * @return {number} The index of the layer in this tilemap, or null if not found.
    */
    getLayerIndex: function (name) {

        return this.getIndex(this.layers, name);

    },

    /**
    * Gets the tileset index based on its name.
    *
    * @method Phaser.Tilemap#getTilesetIndex
    * @param {string} name - The name of the tileset to get.
    * @return {number} The index of the tileset in this tilemap, or null if not found.
    */
    getTilesetIndex: function (name) {

        return this.getIndex(this.tilesets, name);

    },

    /**
    * Gets the image index based on its name.
    *
    * @method Phaser.Tilemap#getImageIndex
    * @param {string} name - The name of the image to get.
    * @return {number} The index of the image in this tilemap, or null if not found.
    */
    getImageIndex: function (name) {

        return this.getIndex(this.images, name);

    },

    /**
    * Gets the object index based on its name.
    *
    * @method Phaser.Tilemap#getObjectIndex
    * @param {string} name - The name of the object to get.
    * @return {number} The index of the object in this tilemap, or null if not found.
    */
    getObjectIndex: function (name) {

        return this.getIndex(this.objects, name);

    },

    /**
    * Sets a global collision callback for the given tile index within the layer. This will affect all tiles on this layer that have the same index.
    * If a callback is already set for the tile index it will be replaced. Set the callback to null to remove it.
    * If you want to set a callback for a tile at a specific location on the map then see setTileLocationCallback.
    *
    * @method Phaser.Tilemap#setTileIndexCallback
    * @param {number|array} indexes - Either a single tile index, or an array of tile indexes to have a collision callback set for.
    * @param {function} callback - The callback that will be invoked when the tile is collided with.
    * @param {object} callbackContext - The context under which the callback is called.
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to operate on. If not given will default to this.currentLayer.
    */
    setTileIndexCallback: function (indexes, callback, callbackContext, layer) {

        layer = this.getLayer(layer);

        if (typeof indexes === 'number')
        {
            //  This may seem a bit wasteful, because it will cause empty array elements to be created, but the look-up cost is much
            //  less than having to iterate through the callbacks array hunting down tile indexes each frame, so I'll take the small memory hit.
            this.layers[layer].callbacks[indexes] = { callback: callback, callbackContext: callbackContext };
        }
        else
        {
            for (var i = 0, len = indexes.length; i < len; i++)
            {
                this.layers[layer].callbacks[indexes[i]] = { callback: callback, callbackContext: callbackContext };
            }
        }

    },

    /**
    * Sets a global collision callback for the given map location within the layer. This will affect all tiles on this layer found in the given area.
    * If a callback is already set for the tile index it will be replaced. Set the callback to null to remove it.
    * If you want to set a callback for a tile at a specific location on the map then see setTileLocationCallback.
    *
    * @method Phaser.Tilemap#setTileLocationCallback
    * @param {number} x - X position of the top left of the area to copy (given in tiles, not pixels)
    * @param {number} y - Y position of the top left of the area to copy (given in tiles, not pixels)
    * @param {number} width - The width of the area to copy (given in tiles, not pixels)
    * @param {number} height - The height of the area to copy (given in tiles, not pixels)
    * @param {function} callback - The callback that will be invoked when the tile is collided with.
    * @param {object} callbackContext - The context under which the callback is called.
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to operate on. If not given will default to this.currentLayer.
    */
    setTileLocationCallback: function (x, y, width, height, callback, callbackContext, layer) {

        layer = this.getLayer(layer);

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        for (var i = 1; i < this._results.length; i++)
        {
            this._results[i].setCollisionCallback(callback, callbackContext);
        }

    },

    /**
    * Sets collision the given tile or tiles. You can pass in either a single numeric index or an array of indexes: [ 2, 3, 15, 20].
    * The `collides` parameter controls if collision will be enabled (true) or disabled (false).
    *
    * @method Phaser.Tilemap#setCollision
    * @param {number|array} indexes - Either a single tile index, or an array of tile IDs to be checked for collision.
    * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear collision.
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to operate on. If not given will default to this.currentLayer.
    * @param {boolean} [recalculate=true] - Recalculates the tile faces after the update.
    */
    setCollision: function (indexes, collides, layer, recalculate) {

        if (typeof collides === 'undefined') { collides = true; }
        if (typeof recalculate === 'undefined') { recalculate = true; }
        
        layer = this.getLayer(layer);

        if (typeof indexes === 'number')
        {
            return this.setCollisionByIndex(indexes, collides, layer, true);
        }
        else
        {
            //  Collide all of the IDs given in the indexes array
            for (var i = 0, len = indexes.length; i < len; i++)
            {
                this.setCollisionByIndex(indexes[i], collides, layer, false);
            }

            if (recalculate)
            {
                //  Now re-calculate interesting faces
                this.calculateFaces(layer);
            }
        }

    },

    /**
    * Sets collision on a range of tiles where the tile IDs increment sequentially.
    * Calling this with a start value of 10 and a stop value of 14 would set collision for tiles 10, 11, 12, 13 and 14.
    * The `collides` parameter controls if collision will be enabled (true) or disabled (false).
    *
    * @method Phaser.Tilemap#setCollisionBetween
    * @param {number} start - The first index of the tile to be set for collision.
    * @param {number} stop - The last index of the tile to be set for collision.
    * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear collision.
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to operate on. If not given will default to this.currentLayer.
    * @param {boolean} [recalculate=true] - Recalculates the tile faces after the update.
    */
    setCollisionBetween: function (start, stop, collides, layer, recalculate) {

        if (typeof collides === 'undefined') { collides = true; }
        if (typeof recalculate === 'undefined') { recalculate = true; }
        
        layer = this.getLayer(layer);

        if (start > stop)
        {
            return;
        }

        for (var index = start; index <= stop; index++)
        {
            this.setCollisionByIndex(index, collides, layer, false);
        }

        if (recalculate)
        {
            //  Now re-calculate interesting faces
            this.calculateFaces(layer);
        }

    },

    /**
    * Sets collision on all tiles in the given layer, except for the IDs of those in the given array.
    * The `collides` parameter controls if collision will be enabled (true) or disabled (false).
    *
    * @method Phaser.Tilemap#setCollisionByExclusion
    * @param {array} indexes - An array of the tile IDs to not be counted for collision.
    * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear collision.
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to operate on. If not given will default to this.currentLayer.
    * @param {boolean} [recalculate=true] - Recalculates the tile faces after the update.
    */
    setCollisionByExclusion: function (indexes, collides, layer, recalculate) {

        if (typeof collides === 'undefined') { collides = true; }
        if (typeof recalculate === 'undefined') { recalculate = true; }
        
        layer = this.getLayer(layer);

        //  Collide everything, except the IDs given in the indexes array
        for (var i = 0, len = this.tiles.length; i < len; i++)
        {
            if (indexes.indexOf(i) === -1)
            {
                this.setCollisionByIndex(i, collides, layer, false);
            }
        }

        if (recalculate)
        {
            //  Now re-calculate interesting faces
            this.calculateFaces(layer);
        }

    },

    /**
    * Sets collision values on a tile in the set.
    * You shouldn't usually call this method directly, instead use setCollision, setCollisionBetween or setCollisionByExclusion.
    *
    * @method Phaser.Tilemap#setCollisionByIndex
    * @protected
    * @param {number} index - The index of the tile on the layer.
    * @param {boolean} [collides=true] - If true it will enable collision on the tile. If false it will clear collision values from the tile.
    * @param {number} [layer] - The layer to operate on. If not given will default to this.currentLayer.
    * @param {boolean} [recalculate=true] - Recalculates the tile faces after the update.
    */
    setCollisionByIndex: function (index, collides, layer, recalculate) {

        if (typeof collides === 'undefined') { collides = true; }
        if (typeof layer === 'undefined') { layer = this.currentLayer; }
        if (typeof recalculate === 'undefined') { recalculate = true; }

        if (collides)
        {
            this.collideIndexes.push(index);
        }
        else
        {
            var i = this.collideIndexes.indexOf(index);

            if (i > -1)
            {
                this.collideIndexes.splice(i, 1);
            }
        }

        for (var y = 0; y < this.layers[layer].height; y++)
        {
            for (var x = 0; x < this.layers[layer].width; x++)
            {
                var tile = this.layers[layer].data[y][x];

                if (tile && tile.index === index)
                {
                    if (collides)
                    {
                        tile.setCollision(true, true, true, true);
                    }
                    else
                    {
                        tile.resetCollision();
                    }

                    tile.faceTop = collides;
                    tile.faceBottom = collides;
                    tile.faceLeft = collides;
                    tile.faceRight = collides;
                }
            }
        }

        if (recalculate)
        {
            //  Now re-calculate interesting faces
            this.calculateFaces(layer);
        }

        return layer;

    },

    /**
    * Gets the TilemapLayer index as used in the setCollision calls.
    *
    * @method Phaser.Tilemap#getLayer
    * @protected
    * @param {number|string|Phaser.TilemapLayer} layer - The layer to operate on. If not given will default to this.currentLayer.
    * @return {number} The TilemapLayer index.
    */
    getLayer: function (layer) {

        if (typeof layer === 'undefined')
        {
            layer = this.currentLayer;
        }
        // else if (typeof layer === 'number')
        // {
        //     layer = layer;
        // }
        else if (typeof layer === 'string')
        {
            layer = this.getLayerIndex(layer);
        }
        else if (layer instanceof Phaser.TilemapLayer)
        {
            layer = layer.index;
        }

        return layer;

    },

    /**
    * Turn off/on the recalculation of faces for tile or collission updates. 
    * setPreventRecalculate(true) puts recalculation on hold while
    * setPreventRecalculate(false) recalculates all the changed layers.
    *
    * @method Phaser.Tilemap#setPreventRecalculate
    * @param {boolean} if true it will put the recalculation on hold.
    */
    setPreventRecalculate: function (value) {
        if((value===true)&&(this.preventingRecalculate!==true)){
            this.preventingRecalculate = true;
            this.needToRecalculate = {};
        }
        if((value===false)&&(this.preventingRecalculate===true)){
            this.preventingRecalculate = false;
            for(var i in this.needToRecalculate){
                this.calculateFaces(i);
            }
            this.needToRecalculate = false;
        }
    },

    /**
    * Internal function.
    *
    * @method Phaser.Tilemap#calculateFaces
    * @protected
    * @param {number} layer - The index of the TilemapLayer to operate on.
    */
    calculateFaces: function (layer) {

        if(this.preventingRecalculate===true){
            this.needToRecalculate[layer] = true;
            return;
        }
        
        var above = null;
        var below = null;
        var left = null;
        var right = null;

        for (var y = 0, h = this.layers[layer].height; y < h; y++)
        {
            for (var x = 0, w = this.layers[layer].width; x < w; x++)
            {
                var tile = this.layers[layer].data[y][x];

                if (tile)
                {
                    above = this.getTileAbove(layer, x, y);
                    below = this.getTileBelow(layer, x, y);
                    left = this.getTileLeft(layer, x, y);
                    right = this.getTileRight(layer, x, y);

                    if (tile.collides)
                    {
                        tile.faceTop = true;
                        tile.faceBottom = true;
                        tile.faceLeft = true;
                        tile.faceRight = true;
                    }

                    if (above && above.collides)
                    {
                        //  There is a tile above this one that also collides, so the top of this tile is no longer interesting
                        tile.faceTop = false;
                    }

                    if (below && below.collides)
                    {
                        //  There is a tile below this one that also collides, so the bottom of this tile is no longer interesting
                        tile.faceBottom = false;
                    }

                    if (left && left.collides)
                    {
                        //  There is a tile left this one that also collides, so the left of this tile is no longer interesting
                        tile.faceLeft = false;
                    }

                    if (right && right.collides)
                    {
                        //  There is a tile right this one that also collides, so the right of this tile is no longer interesting
                        tile.faceRight = false;
                    }
                }
            }
        }

    },

    /**
    * Gets the tile above the tile coordinates given.
    * Mostly used as an internal function by calculateFaces.
    *
    * @method Phaser.Tilemap#getTileAbove
    * @param {number} layer - The local layer index to get the tile from. Can be determined by Tilemap.getLayer().
    * @param {number} x - The x coordinate to get the tile from. In tiles, not pixels.
    * @param {number} y - The y coordinate to get the tile from. In tiles, not pixels.
    */
    getTileAbove: function (layer, x, y) {

        if (y > 0)
        {
            return this.layers[layer].data[y - 1][x];
        }

        return null;

    },

    /**
    * Gets the tile below the tile coordinates given.
    * Mostly used as an internal function by calculateFaces.
    *
    * @method Phaser.Tilemap#getTileBelow
    * @param {number} layer - The local layer index to get the tile from. Can be determined by Tilemap.getLayer().
    * @param {number} x - The x coordinate to get the tile from. In tiles, not pixels.
    * @param {number} y - The y coordinate to get the tile from. In tiles, not pixels.
    */
    getTileBelow: function (layer, x, y) {

        if (y < this.layers[layer].height - 1)
        {
            return this.layers[layer].data[y + 1][x];
        }

        return null;

    },

    /**
    * Gets the tile to the left of the tile coordinates given.
    * Mostly used as an internal function by calculateFaces.
    *
    * @method Phaser.Tilemap#getTileLeft
    * @param {number} layer - The local layer index to get the tile from. Can be determined by Tilemap.getLayer().
    * @param {number} x - The x coordinate to get the tile from. In tiles, not pixels.
    * @param {number} y - The y coordinate to get the tile from. In tiles, not pixels.
    */
    getTileLeft: function (layer, x, y) {

        if (x > 0)
        {
            return this.layers[layer].data[y][x - 1];
        }

        return null;

    },

    /**
    * Gets the tile to the right of the tile coordinates given.
    * Mostly used as an internal function by calculateFaces.
    *
    * @method Phaser.Tilemap#getTileRight
    * @param {number} layer - The local layer index to get the tile from. Can be determined by Tilemap.getLayer().
    * @param {number} x - The x coordinate to get the tile from. In tiles, not pixels.
    * @param {number} y - The y coordinate to get the tile from. In tiles, not pixels.
    */
    getTileRight: function (layer, x, y) {

        if (x < this.layers[layer].width - 1)
        {
            return this.layers[layer].data[y][x + 1];
        }

        return null;

    },

    /**
    * Sets the current layer to the given index.
    *
    * @method Phaser.Tilemap#setLayer
    * @param {number|string|Phaser.TilemapLayer} layer - The layer to set as current.
    */
    setLayer: function (layer) {

        layer = this.getLayer(layer);

        if (this.layers[layer])
        {
            this.currentLayer = layer;
        }

    },

    /**
    * Checks if there is a tile at the given location.
    *
    * @method Phaser.Tilemap#hasTile
    * @param {number} x - X position to check if a tile exists at (given in tile units, not pixels)
    * @param {number} y - Y position to check if a tile exists at (given in tile units, not pixels)
    * @param {number|string|Phaser.TilemapLayer} layer - The layer to set as current.
    * @return {boolean} True if there is a tile at the given location, otherwise false.
    */
    hasTile: function (x, y, layer) {

        layer = this.getLayer(layer);

        return (this.layers[layer].data[y] !== null && this.layers[layer].data[y][x] !== null);

    },

    /**
    * Removes the tile located at the given coordinates and updates the collision data.
    *
    * @method Phaser.Tilemap#removeTile
    * @param {number} x - X position to place the tile (given in tile units, not pixels)
    * @param {number} y - Y position to place the tile (given in tile units, not pixels)
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to modify.
    * @return {Phaser.Tile} The Tile object that was removed from this map.
    */
    removeTile: function (x, y, layer) {

        layer = this.getLayer(layer);

        if (x >= 0 && x < this.layers[layer].width && y >= 0 && y < this.layers[layer].height)
        {
            if (this.hasTile(x, y, layer))
            {
                var tile = this.layers[layer].data[y][x];

                this.layers[layer].data[y][x] = new Phaser.Tile(this.layers[layer], -1, x, y, this.tileWidth, this.tileHeight);

                this.layers[layer].dirty = true;

                this.calculateFaces(layer);

                return tile;
            }
        }

    },

    /**
    * Removes the tile located at the given coordinates and updates the collision data. The coordinates are given in pixel values.
    *
    * @method Phaser.Tilemap#removeTileWorldXY
    * @param {number} x - X position to insert the tile (given in pixels)
    * @param {number} y - Y position to insert the tile (given in pixels)
    * @param {number} tileWidth - The width of the tile in pixels.
    * @param {number} tileHeight - The height of the tile in pixels.
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to modify.
    * @return {Phaser.Tile} The Tile object that was removed from this map.
    */
    removeTileWorldXY: function (x, y, tileWidth, tileHeight, layer) {

        layer = this.getLayer(layer);

        x = this.game.math.snapToFloor(x, tileWidth) / tileWidth;
        y = this.game.math.snapToFloor(y, tileHeight) / tileHeight;

        return this.removeTile(x, y, layer);

    },

    /**
    * Puts a tile of the given index value at the coordinate specified.
    * If you pass `null` as the tile it will pass your call over to Tilemap.removeTile instead.
    *
    * @method Phaser.Tilemap#putTile
    * @param {Phaser.Tile|number|null} tile - The index of this tile to set or a Phaser.Tile object. If null the tile is removed from the map.
    * @param {number} x - X position to place the tile (given in tile units, not pixels)
    * @param {number} y - Y position to place the tile (given in tile units, not pixels)
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to modify.
    * @return {Phaser.Tile} The Tile object that was created or added to this map.
    */
    putTile: function (tile, x, y, layer) {

        if (tile === null)
        {
            return this.removeTile(x, y, layer);
        }

        layer = this.getLayer(layer);

        if (x >= 0 && x < this.layers[layer].width && y >= 0 && y < this.layers[layer].height)
        {
            var index;

            if (tile instanceof Phaser.Tile)
            {
                index = tile.index;

                if (this.hasTile(x, y, layer))
                {
                    this.layers[layer].data[y][x].copy(tile);
                }
                else
                {
                    this.layers[layer].data[y][x] = new Phaser.Tile(layer, index, x, y, tile.width, tile.height);
                }
            }
            else
            {
                index = tile;

                if (this.hasTile(x, y, layer))
                {
                    this.layers[layer].data[y][x].index = index;
                }
                else
                {
                    this.layers[layer].data[y][x] = new Phaser.Tile(this.layers[layer], index, x, y, this.tileWidth, this.tileHeight);
                }
            }

            if (this.collideIndexes.indexOf(index) > -1)
            {
                this.layers[layer].data[y][x].setCollision(true, true, true, true);
            }
            else
            {
                this.layers[layer].data[y][x].resetCollision();
            }

            this.layers[layer].dirty = true;

            this.calculateFaces(layer);

            return this.layers[layer].data[y][x];
        }

        return null;

    },

    /**
    * Puts a tile into the Tilemap layer. The coordinates are given in pixel values.
    *
    * @method Phaser.Tilemap#putTileWorldXY
    * @param {Phaser.Tile|number} tile - The index of this tile to set or a Phaser.Tile object.
    * @param {number} x - X position to insert the tile (given in pixels)
    * @param {number} y - Y position to insert the tile (given in pixels)
    * @param {number} tileWidth - The width of the tile in pixels.
    * @param {number} tileHeight - The height of the tile in pixels.
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to modify.
    * @return {Phaser.Tile} The Tile object that was created or added to this map.
    */
    putTileWorldXY: function (tile, x, y, tileWidth, tileHeight, layer) {

        layer = this.getLayer(layer);

        x = this.game.math.snapToFloor(x, tileWidth) / tileWidth;
        y = this.game.math.snapToFloor(y, tileHeight) / tileHeight;

        return this.putTile(tile, x, y, layer);

    },

    /**
    * Searches the entire map layer for the first tile matching the given index, then returns that Phaser.Tile object.
    * If no match is found it returns null.
    * The search starts from the top-left tile and continues horizontally until it hits the end of the row, then it drops down to the next column.
    * If the reverse boolean is true, it scans starting from the bottom-right corner travelling up to the top-left.
    *
    * @method Phaser.Tilemap#searchTileIndex
    * @param {number} index - The tile index value to search for.
    * @param {number} [skip=0] - The number of times to skip a matching tile before returning.
    * @param {number} [reverse=false] - If true it will scan the layer in reverse, starting at the bottom-right. Otherwise it scans from the top-left.
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to get the tile from.
    * @return {Phaser.Tile} The first (or n skipped) tile with the matching index.
    */
    searchTileIndex: function (index, skip, reverse, layer) {

        if (typeof skip === 'undefined') { skip = 0; }
        if (typeof reverse === 'undefined') { reverse = false; }

        layer = this.getLayer(layer);

        var c = 0;

        if (reverse)
        {
            for (var y = this.layers[layer].height - 1; y >= 0; y--)
            {
                for (var x = this.layers[layer].width - 1; x >= 0; x--)
                {
                    if (this.layers[layer].data[y][x].index === index)
                    {
                        if (c === skip)
                        {
                            return this.layers[layer].data[y][x];
                        }
                        else
                        {
                            c++;
                        }
                    }
                }
            }
        }
        else
        {
            for (var y = 0; y < this.layers[layer].height; y++)
            {
                for (var x = 0; x < this.layers[layer].width; x++)
                {
                    if (this.layers[layer].data[y][x].index === index)
                    {
                        if (c === skip)
                        {
                            return this.layers[layer].data[y][x];
                        }
                        else
                        {
                            c++;
                        }
                    }
                }
            }
        }

        return null;

    },

    /**
    * Gets a tile from the Tilemap Layer. The coordinates are given in tile values.
    *
    * @method Phaser.Tilemap#getTile
    * @param {number} x - X position to get the tile from (given in tile units, not pixels)
    * @param {number} y - Y position to get the tile from (given in tile units, not pixels)
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to get the tile from.
    * @param {boolean} [nonNull=false] - If true getTile won't return null for empty tiles, but a Tile object with an index of -1.
    * @return {Phaser.Tile} The tile at the given coordinates or null if no tile was found or the coordinates were invalid.
    */
    getTile: function (x, y, layer, nonNull) {

        if (typeof nonNull === 'undefined') { nonNull = false; }

        layer = this.getLayer(layer);

        if (x >= 0 && x < this.layers[layer].width && y >= 0 && y < this.layers[layer].height)
        {
            if (this.layers[layer].data[y][x].index === -1)
            {
                if (nonNull)
                {
                    return this.layers[layer].data[y][x];
                }
                else
                {
                    return null;
                }
            }
            else
            {
                return this.layers[layer].data[y][x];
            }
        }
        else
        {
            return null;
        }

    },

    /**
    * Gets a tile from the Tilemap layer. The coordinates are given in pixel values.
    *
    * @method Phaser.Tilemap#getTileWorldXY
    * @param {number} x - X position to get the tile from (given in pixels)
    * @param {number} y - Y position to get the tile from (given in pixels)
    * @param {number} [tileWidth] - The width of the tiles. If not given the map default is used.
    * @param {number} [tileHeight] - The height of the tiles. If not given the map default is used.
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to get the tile from.
    * @return {Phaser.Tile} The tile at the given coordinates.
    */
    getTileWorldXY: function (x, y, tileWidth, tileHeight, layer) {

        if (typeof tileWidth === 'undefined') { tileWidth = this.tileWidth; }
        if (typeof tileHeight === 'undefined') { tileHeight = this.tileHeight; }

        layer = this.getLayer(layer);

        x = this.game.math.snapToFloor(x, tileWidth) / tileWidth;
        y = this.game.math.snapToFloor(y, tileHeight) / tileHeight;

        return this.getTile(x, y, layer);

    },

    /**
    * Copies all of the tiles in the given rectangular block into the tilemap data buffer.
    *
    * @method Phaser.Tilemap#copy
    * @param {number} x - X position of the top left of the area to copy (given in tiles, not pixels)
    * @param {number} y - Y position of the top left of the area to copy (given in tiles, not pixels)
    * @param {number} width - The width of the area to copy (given in tiles, not pixels)
    * @param {number} height - The height of the area to copy (given in tiles, not pixels)
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to copy the tiles from.
    * @return {array} An array of the tiles that were copied.
    */
    copy: function (x, y, width, height, layer) {

        layer = this.getLayer(layer);

        if (!this.layers[layer])
        {
            this._results.length = 0;
            return;
        }

        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        if (typeof width === "undefined") { width = this.layers[layer].width; }
        if (typeof height === "undefined") { height = this.layers[layer].height; }

        if (x < 0)
        {
            x = 0;
        }

        if (y < 0)
        {
            y = 0;
        }

        if (width > this.layers[layer].width)
        {
            width = this.layers[layer].width;
        }

        if (height > this.layers[layer].height)
        {
            height = this.layers[layer].height;
        }

        this._results.length = 0;

        this._results.push({ x: x, y: y, width: width, height: height, layer: layer });

        for (var ty = y; ty < y + height; ty++)
        {
            for (var tx = x; tx < x + width; tx++)
            {
                this._results.push(this.layers[layer].data[ty][tx]);
            }
        }

        return this._results;

    },

    /**
    * Pastes a previously copied block of tile data into the given x/y coordinates. Data should have been prepared with Tilemap.copy.
    *
    * @method Phaser.Tilemap#paste
    * @param {number} x - X position of the top left of the area to paste to (given in tiles, not pixels)
    * @param {number} y - Y position of the top left of the area to paste to (given in tiles, not pixels)
    * @param {array} tileblock - The block of tiles to paste.
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to paste the tiles into.
    */
    paste: function (x, y, tileblock, layer) {

        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }

        layer = this.getLayer(layer);

        if (!tileblock || tileblock.length < 2)
        {
            return;
        }

        //  Find out the difference between tileblock[1].x/y and x/y and use it as an offset, as it's the top left of the block to paste
        var diffX = tileblock[1].x - x;
        var diffY = tileblock[1].y - y;

        for (var i = 1; i < tileblock.length; i++)
        {
            this.layers[layer].data[ diffY + tileblock[i].y ][ diffX + tileblock[i].x ].copy(tileblock[i]);
        }

		this.layers[layer].dirty = true;
        this.calculateFaces(layer);

    },

    /**
    * Scans the given area for tiles with an index matching tileA and swaps them with tileB.
    *
    * @method Phaser.Tilemap#swap
    * @param {number} tileA - First tile index.
    * @param {number} tileB - Second tile index.
    * @param {number} x - X position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} y - Y position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} width - The width in tiles of the area to operate on.
    * @param {number} height - The height in tiles of the area to operate on.
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to operate on.
    */
    swap: function (tileA, tileB, x, y, width, height, layer) {

        layer = this.getLayer(layer);

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        this._tempA = tileA;
        this._tempB = tileB;

        this._results.forEach(this.swapHandler, this);

        this.paste(x, y, this._results, layer);

    },

    /**
    * Internal function that handles the swapping of tiles.
    *
    * @method Phaser.Tilemap#swapHandler
    * @private
    * @param {number} value
    */
    swapHandler: function (value) {

        if (value.index === this._tempA)
        {
            //  Swap A with B
            value.index = this._tempB;
        }
        else if (value.index === this._tempB)
        {
            //  Swap B with A
            value.index = this._tempA;
        }

    },

    /**
    * For each tile in the given area defined by x/y and width/height run the given callback.
    *
    * @method Phaser.Tilemap#forEach
    * @param {number} callback - The callback. Each tile in the given area will be passed to this callback as the first and only parameter.
    * @param {number} context - The context under which the callback should be run.
    * @param {number} x - X position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} y - Y position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} width - The width in tiles of the area to operate on.
    * @param {number} height - The height in tiles of the area to operate on.
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to operate on.
    */
    forEach: function (callback, context, x, y, width, height, layer) {

        layer = this.getLayer(layer);

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        this._results.forEach(callback, context);

        this.paste(x, y, this._results, layer);

    },

    /**
    * Scans the given area for tiles with an index matching `source` and updates their index to match `dest`.
    *
    * @method Phaser.Tilemap#replace
    * @param {number} source - The tile index value to scan for.
    * @param {number} dest - The tile index value to replace found tiles with.
    * @param {number} x - X position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} y - Y position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} width - The width in tiles of the area to operate on.
    * @param {number} height - The height in tiles of the area to operate on.
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to operate on.
    */
    replace: function (source, dest, x, y, width, height, layer) {

        layer = this.getLayer(layer);

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        for (var i = 1; i < this._results.length; i++)
        {
            if (this._results[i].index === source)
            {
                this._results[i].index = dest;
            }
        }

        this.paste(x, y, this._results, layer);

    },

    /**
    * Randomises a set of tiles in a given area.
    *
    * @method Phaser.Tilemap#random
    * @param {number} x - X position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} y - Y position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} width - The width in tiles of the area to operate on.
    * @param {number} height - The height in tiles of the area to operate on.
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to operate on.
    */
    random: function (x, y, width, height, layer) {

        layer = this.getLayer(layer);

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        var indexes = [];

        for (var t = 1; t < this._results.length; t++)
        {
            if (this._results[t].index)
            {
                var idx = this._results[t].index;

                if (indexes.indexOf(idx) === -1)
                {
                    indexes.push(idx);
                }
            }
        }

        for (var i = 1; i < this._results.length; i++)
        {
            this._results[i].index = this.game.rnd.pick(indexes);
        }

        this.paste(x, y, this._results, layer);

    },

    /**
    * Shuffles a set of tiles in a given area. It will only randomise the tiles in that area, so if they're all the same nothing will appear to have changed!
    *
    * @method Phaser.Tilemap#shuffle
    * @param {number} x - X position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} y - Y position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} width - The width in tiles of the area to operate on.
    * @param {number} height - The height in tiles of the area to operate on.
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to operate on.
    */
    shuffle: function (x, y, width, height, layer) {

        layer = this.getLayer(layer);

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        var indexes = [];

        for (var t = 1; t < this._results.length; t++)
        {
            if (this._results[t].index)
            {
                indexes.push(this._results[t].index);
            }
        }

        Phaser.Utils.shuffle(indexes);

        for (var i = 1; i < this._results.length; i++)
        {
            this._results[i].index = indexes[i - 1];
        }

        this.paste(x, y, this._results, layer);

    },

    /**
    * Fills the given area with the specified tile.
    *
    * @method Phaser.Tilemap#fill
    * @param {number} index - The index of the tile that the area will be filled with.
    * @param {number} x - X position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} y - Y position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} width - The width in tiles of the area to operate on.
    * @param {number} height - The height in tiles of the area to operate on.
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to operate on.
    */
    fill: function (index, x, y, width, height, layer) {

        layer = this.getLayer(layer);

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        for (var i = 1; i < this._results.length; i++)
        {
            this._results[i].index = index;
        }

        this.paste(x, y, this._results, layer);

    },

    /**
    * Removes all layers from this tile map.
    *
    * @method Phaser.Tilemap#removeAllLayers
    */
    removeAllLayers: function () {

        this.layers.length = 0;
        this.currentLayer = 0;

    },

    /**
    * Dumps the tilemap data out to the console.
    *
    * @method Phaser.Tilemap#dump
    */
    dump: function () {

        var txt = '';
        var args = [''];

        for (var y = 0; y < this.layers[this.currentLayer].height; y++)
        {
            for (var x = 0; x < this.layers[this.currentLayer].width; x++)
            {
                txt += "%c  ";

                if (this.layers[this.currentLayer].data[y][x] > 1)
                {
                    if (this.debugMap[this.layers[this.currentLayer].data[y][x]])
                    {
                        args.push("background: " + this.debugMap[this.layers[this.currentLayer].data[y][x]]);
                    }
                    else
                    {
                        args.push("background: #ffffff");
                    }
                }
                else
                {
                    args.push("background: rgb(0, 0, 0)");
                }
            }

            txt += "\n";
        }

        args[0] = txt;
        console.log.apply(console, args);

    },

    /**
    * Removes all layer data from this tile map and nulls the game reference.
    * Note: You are responsible for destroying any TilemapLayer objects you generated yourself, as Tilemap doesn't keep a reference to them.
    *
    * @method Phaser.Tilemap#destroy
    */
    destroy: function () {

        this.removeAllLayers();
        this.data = [];
        this.game = null;

    }

};

Phaser.Tilemap.prototype.constructor = Phaser.Tilemap;

/**
* @name Phaser.Tilemap#layer
* @property {number|string|Phaser.TilemapLayer} layer - The current layer object.
*/
Object.defineProperty(Phaser.Tilemap.prototype, "layer", {

    get: function () {

        return this.layers[this.currentLayer];

    },

    set: function (value) {

        if (value !== this.currentLayer)
        {
            this.setLayer(value);
        }

    }

});
