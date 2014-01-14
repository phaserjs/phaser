/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Tile Map object. A Tile map consists of a set of tile data and tile sets. It is rendered to the display using a TilemapLayer.
* A map may have multiple layers. You can perform operations on the map data such as copying, pasting, filling and shuffling the tiles around.
*
* @class Phaser.Tilemap
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
* @param {string} [key] - The key of the tilemap data as stored in the Cache.
*/
Phaser.Tilemap = function (game, key) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

    /**
    * @property {string} key - The key of this map data in the Phaser.Cache.
    */
    this.key = key;

    var data = Phaser.TilemapParser.parse(this.game, key);

    if (data === null)
    {
        return;
    }

    this.width = data.width;
    this.height = data.height;
    this.tileWidth = data.tileWidth;
    this.tileHeight = data.tileHeight;
    this.orientation = data.orientation;
    this.version = data.version;
    this.properties = data.properties;
    this.widthInPixels = data.widthInPixels;
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

Phaser.Tilemap.prototype = {

    /**
    * Creates an empty map of the given dimensions.
    *
    * @method Phaser.Tilemap#create
    * @param {string} name - The name of the map (mostly used for debugging)
    * @param {number} width - The width of the map in tiles.
    * @param {number} height - The height of the map in tiles.
    */
    create: function (name, width, height) {

        var data = [];

        for (var y = 0; y < height; y++)
        {
            data[y] = [];

            for (var x = 0; x < width; x++)
            {
                data[y][x] = 0;
            }
        }

        this.layers.push({

            name: name,
            width: width,
            height: height,
            alpha: 1,
            visible: true,
            tileMargin: 0,
            tileSpacing: 0,
            format: Phaser.Tilemap.CSV,
            data: data,
            indexes: [],
			dirty: true

        });

        this.currentLayer = this.layers.length - 1;

    },

    addTilesetImage: function (tileset, key) {

        if (typeof key === 'undefined')
        {
            if (typeof tileset === 'string')
            {
                key = tileset;
            }
            else
            {
                return false;
            }
        }

        if (typeof tileset === 'string')
        {
            tileset = this.getTilesetIndex(tileset);
        }

        if (this.tilesets[tileset])
        {
            this.tilesets[tileset].image = this.game.cache.getImage(key);

            return true;
        }

        return false;

    },

    //  Region? Remove tile from map data?
    createFromTiles: function (layer, tileIndex, key, frame, group) {

        if (typeof group === 'undefined') { group = this.game.world; }

    },

    /**
    * Creates a Sprite for every object matching the given gid in the map data. You can optionally specify the group that the Sprite will be created in. If none is
    * given it will be created in the World. All properties from the map data objectgroup are copied across to the Sprite, so you can use this as an easy way to
    * configure Sprite properties from within the map editor. For example giving an object a property if alpha: 0.5 in the map editor will duplicate that when the
    * Sprite is created. You could also give it a value like: body.velocity.x: 100 to set it moving automatically.
    *
    * @method Phaser.Tileset#createFromObjects
    * @param {string} name - The name of the Object Group to create Sprites from.
    * @param {number} gid - The layer array index value, or if a string is given the layer name, within the map data that this TilemapLayer represents.
    * @param {string} key - The Game.cache key of the image that this Sprite will use.
    * @param {number|string} [frame] - If the Sprite image contains multiple frames you can specify which one to use here.
    * @param {boolean} [exists=true] - The default exists state of the Sprite.
    * @param {boolean} [autoCull=true] - The default autoCull state of the Sprite. Sprites that are autoCulled are culled from the camera if out of its range.
    * @param {Phaser.Group} [group] - Optional Group to add the Sprite to. If not specified it will be added to the World group.
    */
    createFromObjects: function (name, gid, key, frame, exists, autoCull, group) {

        if (typeof exists === 'undefined') { exists = true; }
        if (typeof autoCull === 'undefined') { autoCull = true; }
        if (typeof group === 'undefined') { group = this.game.world; }

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
                sprite = group.create(this.objects[name][i].x, this.objects[name][i].y, key, frame, exists);

                sprite.anchor.setTo(0, 1);
                sprite.name = this.objects[name][i].name;
                sprite.visible = this.objects[name][i].visible;
                sprite.autoCull = autoCull;

                for (property in this.objects[name][i].properties)
                {
                    group.set(sprite, property, this.objects[name][i].properties[property], false, false, 0);
                }
            }
        }

    },

    /**
    * Creates a new TilemapLayer object. By default TilemapLayers are fixed to the camera.
    *
    * @method Phaser.Tileset#createLayer
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
    * Gets the layer index based on a layer name.
    *
    * @method Phaser.Tileset#getIndex
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
    * @method Phaser.Tileset#getLayerIndex
    * @param {string} name - The name of the layer to get.
    * @return {number} The index of the layer in this tilemap, or null if not found.
    */
    getLayerIndex: function (name) {

        return this.getIndex(this.layers, name);

    },

    /**
    * Gets the tileset index based on its name.
    *
    * @method Phaser.Tileset#getTilesetIndex
    * @param {string} name - The name of the tileset to get.
    * @return {number} The index of the tileset in this tilemap, or null if not found.
    */
    getTilesetIndex: function (name) {

        return this.getIndex(this.tilesets, name);

    },

    /**
    * Gets the image index based on its name.
    *
    * @method Phaser.Tileset#getImageIndex
    * @param {string} name - The name of the image to get.
    * @return {number} The index of the image in this tilemap, or null if not found.
    */
    getImageIndex: function (name) {

        return this.getIndex(this.images, name);

    },

    /**
    * Gets the object index based on its name.
    *
    * @method Phaser.Tileset#getObjectIndex
    * @param {string} name - The name of the object to get.
    * @return {number} The index of the object in this tilemap, or null if not found.
    */
    getObjectIndex: function (name) {

        return this.getIndex(this.objects, name);

    },

    //  TODO - set collision in an area, REMOVE collision

    /**
    * Sets collision on all tiles in the given layer, except for the IDs of those in the given array.
    *
    * @method Phaser.Tileset#setCollisionByExclusion
    * @param {array} indexes - An array of the tile IDs to not be counted for collision.
    * @param {number|string|Phaser.TilemapLayer} layer - The layer to operate on. If not given will default to this.currentLayer.
    */
    setCollisionByExclusion: function (indexes, layer) {

        if (typeof layer === 'undefined')
        {
            layer = this.currentLayer;
        }

        //  Collide everything, except the IDs given in the indexes array
        for (var i = 0, len = this.tiles.length; i < len; i++)
        {
            if (indexes.indexOf(i) === -1)
            {
                this.setCollisionByIndex(i, layer, false);
            }
        }

        //  Now re-calculate interesting faces
        this.calculateFaces(layer);

    },

    /**
    * Sets collision the given tile index, or array of tiles indexes.
    *
    * @method Phaser.Tileset#setCollision
    * @param {number|array} indexes - Either a single tile index, or an array of tile IDs to be checked for collision.
    * @param {number|string|Phaser.TilemapLayer} layer - The layer to operate on. If not given will default to this.currentLayer.
    */
    setCollision: function (indexes, layer) {

        if (typeof layer === 'undefined')
        {
            layer = this.currentLayer;
        }

        if (typeof indexes === 'number')
        {
            return this.setCollisionByIndex(indexes, layer);
        }

        //  Collide all of the IDs given in the indexes array
        for (var i = 0, len = indexes.length; i < len; i++)
        {
            this.setCollisionByIndex(indexes[i], layer, false);
        }

        //  Now re-calculate interesting faces
        this.calculateFaces(layer);

    },

    /**
    * Sets collision on a range of tiles.
    *
    * @method Phaser.Tileset#setCollisionBetween
    * @param {number} start - The first index of the tile to be set for collision.
    * @param {number} stop - The last index of the tile to be set for collision.
    * @param {number|string|Phaser.TilemapLayer} layer - The layer to operate on. If not given will default to this.currentLayer.
    */
    setCollisionBetween: function (start, stop, layer) {

        if (start > stop)
        {
            return;
        }

        for (var i = start; i <= stop; i++)
        {
            var index = this.setCollisionByIndex(i, layer, false);
        }

        //  Now re-calculate interesting faces
        this.calculateFaces(index);

    },

    /**
    * Sets collision values on a tile in the set.
    *
    * @method Phaser.Tileset#setCollisionByIndex
    * @param {number} index - The index of the tile on the layer.
    * @param {number|string|Phaser.TilemapLayer} layer - The layer to operate on. If not given will default to this.currentLayer.
    * @param {boolean} [recalculate=true] - Recalculates the tile faces after the update.
    */
    setCollisionByIndex: function (index, layer, recalculate) {

        if (typeof layer === 'undefined')
        {
            layer = this.currentLayer;
        }
        else if (typeof layer === 'string')
        {
            layer = this.getLayerIndex(layer);
        }
        else if (layer instanceof Phaser.TilemapLayer)
        {
            layer = layer.index;
        }

        if (typeof recalculate === "undefined") { recalculate = true; }

        for (var y = 0; y < this.layers[layer].height ; y++)
        {
            for (var x = 0; x < this.layers[layer].width; x++)
            {
                var tile = this.layers[layer].data[y][x];

                if (tile && tile.index === index)
                {
                    tile.collides = true;
                    tile.faceTop = true;
                    tile.faceBottom = true;
                    tile.faceLeft = true;
                    tile.faceRight = true;
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
    * Internal function.
    *
    * @method Phaser.Tileset#calculateFaces
    * @param {number} layer - The layer to operate on.
    */
    calculateFaces: function (layer) {

        var above = null;
        var below = null;
        var left = null;
        var right = null;

        // console.log(this.layers[layer].width, 'x', this.layers[layer].height);

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
    * Internal function.
    *
    * @method Phaser.Tileset#getTileAbove
    * @param {number} layer - The layer to operate on.
    * @param {number} x - X.
    * @param {number} y - Y.
    */
    getTileAbove: function (layer, x, y) {

        if (y > 0)
        {
            return this.layers[layer].data[y - 1][x];
        }

        return null;

    },

    /**
    * Internal function.
    *
    * @method Phaser.Tileset#getTileBelow
    * @param {number} layer - The layer to operate on.
    * @param {number} x - X.
    * @param {number} y - Y.
    */
    getTileBelow: function (layer, x, y) {

        if (y < this.layers[layer].height - 1)
        {
            return this.layers[layer].data[y + 1][x];
        }

        return null;

    },

    /**
    * Internal function.
    *
    * @method Phaser.Tileset#getTileLeft
    * @param {number} layer - The layer to operate on.
    * @param {number} x - X.
    * @param {number} y - Y.
    */
    getTileLeft: function (layer, x, y) {

        if (x > 0)
        {
            return this.layers[layer].data[y][x - 1];
        }

        return null;

    },

    /**
    * Internal function.
    *
    * @method Phaser.Tileset#getTileRight
    * @param {number} layer - The layer to operate on.
    * @param {number} x - X.
    * @param {number} y - Y.
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
    * @param {number} layer - Sets the current layer to the given index.
    */
    setLayer: function (layer) {

        if (this.layers[layer])
        {
            this.currentLayer = layer;
        }

    },

    /**
    * Puts a tile of the given index value at the coordinate specified.
    * @method Phaser.Tilemap#putTile
    * @param {number} index - The index of this tile to set.
    * @param {number} x - X position to place the tile (given in tile units, not pixels)
    * @param {number} y - Y position to place the tile (given in tile units, not pixels)
    * @param {number} [layer] - The Tilemap Layer to operate on.
    */
    putTile: function (index, x, y, layer) {

        if (typeof layer === "undefined") { layer = this.currentLayer; }

        if (x >= 0 && x < this.layers[layer].width && y >= 0 && y < this.layers[layer].height)
        {
            this.layers[layer].data[y][x] = index;
			this.layers[layer].dirty = true;
            this.calculateFaces(layer);
        }

    },

    /**
    * Gets a tile from the Tilemap Layer. The coordinates are given in tile values.
    * @method Phaser.Tilemap#getTile
    * @param {number} x - X position to get the tile from (given in tile units, not pixels)
    * @param {number} y - Y position to get the tile from (given in tile units, not pixels)
    * @param {number} [layer] - The Tilemap Layer to operate on.
    * @return {number} The index of the tile at the given coordinates.
    */
    getTile: function (x, y, layer) {

        if (typeof layer === "undefined") { layer = this.currentLayer; }

        if (x >= 0 && x < this.layers[layer].width && y >= 0 && y < this.layers[layer].height)
        {
            return this.layers[layer].data[y][x];
        }

    },

    /**
    * Gets a tile from the Tilemap layer. The coordinates are given in pixel values.
    * @method Phaser.Tilemap#getTileWorldXY
    * @param {number} x - X position to get the tile from (given in pixels)
    * @param {number} y - Y position to get the tile from (given in pixels)
    * @param {number} [layer] - The Tilemap Layer to operate on.
    * @return {number} The index of the tile at the given coordinates.
    */
    getTileWorldXY: function (x, y, tileWidth, tileHeight, layer) {

        if (typeof layer === "undefined") { layer = this.currentLayer; }

        x = this.game.math.snapToFloor(x, tileWidth) / tileWidth;
        y = this.game.math.snapToFloor(y, tileHeight) / tileHeight;

        if (x >= 0 && x < this.layers[layer].width && y >= 0 && y < this.layers[layer].height)
        {
            return this.layers[layer].data[y][x];
        }

    },

    /**
    * Puts a tile into the Tilemap layer. The coordinates are given in pixel values.
    * @method Phaser.Tilemap#putTileWorldXY
    * @param {number} index - The index of the tile to put into the layer.
    * @param {number} x - X position to insert the tile (given in pixels)
    * @param {number} y - Y position to insert the tile (given in pixels)
    * @param {number} tileWidth - The width of the tile in pixels.
    * @param {number} tileHeight - The height of the tile in pixels.
    * @param {number} [layer] - The Tilemap Layer to operate on.
    */
    putTileWorldXY: function (index, x, y, tileWidth, tileHeight, layer) {

        if (typeof layer === "undefined") { layer = this.currentLayer; }

        x = this.game.math.snapToFloor(x, tileWidth) / tileWidth;
        y = this.game.math.snapToFloor(y, tileHeight) / tileHeight;

        if (x >= 0 && x < this.layers[layer].width && y >= 0 && y < this.layers[layer].height)
        {
            this.layers[layer].data[y][x] = index;
			this.layers[layer].dirty = true;
            this.calculateFaces(layer);
        }

    },

    /**
    * Copies all of the tiles in the given rectangular block into the tilemap data buffer.
    * @method Phaser.Tilemap#copy
    * @param {number} x - X position of the top left of the area to copy (given in tiles, not pixels)
    * @param {number} y - Y position of the top left of the area to copy (given in tiles, not pixels)
    * @param {number} width - The width of the area to copy (given in tiles, not pixels)
    * @param {number} height - The height of the area to copy (given in tiles, not pixels)
    * @param {number} [layer] - The Tilemap Layer to operate on.
    * @return {array} An array of the tiles that were copied.
    */
    copy: function (x, y, width, height, layer) {

        if (typeof layer === "undefined") { layer = this.currentLayer; }

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

        this._results.push( { x: x, y: y, width: width, height: height, layer: layer });

        for (var ty = y; ty < y + height; ty++)
        {
            for (var tx = x; tx < x + width; tx++)
            {
                this._results.push({ x: tx, y: ty, index: this.layers[layer].data[ty][tx] });
            }
        }

        return this._results;

    },

    /**
    * Pastes a previously copied block of tile data into the given x/y coordinates. Data should have been prepared with Tilemap.copy.
    * @method Phaser.Tilemap#paste
    * @param {number} x - X position of the top left of the area to paste to (given in tiles, not pixels)
    * @param {number} y - Y position of the top left of the area to paste to (given in tiles, not pixels)
    * @param {array} tileblock - The block of tiles to paste.
    * @param {number} layer - The Tilemap Layer to operate on.
    */
    paste: function (x, y, tileblock, layer) {

        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        if (typeof layer === "undefined") { layer = this.currentLayer; }

        if (!tileblock || tileblock.length < 2)
        {
            return;
        }

        //  Find out the difference between tileblock[1].x/y and x/y and use it as an offset, as it's the top left of the block to paste
        var diffX = tileblock[1].x - x;
        var diffY = tileblock[1].y - y;

        for (var i = 1; i < tileblock.length; i++)
        {
            this.layers[layer].data[ diffY + tileblock[i].y ][ diffX + tileblock[i].x ] = tileblock[i].index;
        }

		this.layers[layer].dirty = true;
        this.calculateFaces(layer);

    },

    /**
    * Swap tiles with 2 kinds of indexes.
    * @method Phaser.Tilemap#swapTile
    * @param {number} tileA - First tile index.
    * @param {number} tileB - Second tile index.
    * @param {number} x - X position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} y - Y position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} width - The width in tiles of the area to operate on.
    * @param {number} height - The height in tiles of the area to operate on.
    */
    swap: function (tileA, tileB, x, y, width, height, layer) {

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        this._tempA = tileA;
        this._tempB = tileB;

        this._results.forEach(this.swapHandler, this);

        this.paste(x, y, this._results);

    },

    /**
    * Internal function that handles the swapping of tiles.
    * @method Phaser.Tilemap#swapHandler
    * @param {number} value
    * @param {number} index
    */
    swapHandler: function (value, index) {

        if (value.index === this._tempA)
        {
            this._results[index].index = this._tempB;
        }
        else if (value.index === this._tempB)
        {
            this._results[index].index = this._tempA;
        }

    },

    /**
    * For each tile in the given area (defined by x/y and width/height) run the given callback.
    * @method Phaser.Tilemap#forEach
    * @param {number} callback - The callback. Each tile in the given area will be passed to this callback as the first and only parameter.
    * @param {number} context - The context under which the callback should be run.
    * @param {number} x - X position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} y - Y position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} width - The width in tiles of the area to operate on.
    * @param {number} height - The height in tiles of the area to operate on.
    * @param {number} [layer] - The Tilemap Layer to operate on.
    */
    forEach: function (callback, context, x, y, width, height, layer) {

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        this._results.forEach(callback, context);

        this.paste(x, y, this._results);

    },

    /**
    * Replaces one type of tile with another in the given area (defined by x/y and width/height).
    * @method Phaser.Tilemap#replace
    * @param {number} tileA - First tile index.
    * @param {number} tileB - Second tile index.
    * @param {number} x - X position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} y - Y position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} width - The width in tiles of the area to operate on.
    * @param {number} height - The height in tiles of the area to operate on.
    * @param {number} [layer] - The Tilemap Layer to operate on.
    */
    replace: function (tileA, tileB, x, y, width, height, layer) {

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        for (var i = 1; i < this._results.length; i++)
        {
            if (this._results[i].index === tileA)
            {
                this._results[i].index = tileB;
            }
        }

        this.paste(x, y, this._results);

    },

    /**
    * Randomises a set of tiles in a given area.
    * @method Phaser.Tilemap#random
    * @param {number} tileA - First tile index.
    * @param {number} tileB - Second tile index.
    * @param {number} x - X position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} y - Y position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} width - The width in tiles of the area to operate on.
    * @param {number} height - The height in tiles of the area to operate on.
    * @param {number} [layer] - The Tilemap Layer to operate on.
    */
    random: function (x, y, width, height, layer) {

        if (typeof layer === "undefined") { layer = this.currentLayer; }

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        var indexes = [];

        for (var t = 1; t < this._results.length; t++)
        {
            var idx = this._results[t].index;

            if (indexes.indexOf(idx) === -1)
            {
                indexes.push(idx);
            }
        }

        for (var i = 1; i < this._results.length; i++)
        {
            this._results[i].index = this.game.rnd.pick(indexes);
        }

        this.paste(x, y, this._results);

    },

    /**
    * Shuffles a set of tiles in a given area. It will only randomise the tiles in that area, so if they're all the same nothing will appear to have changed!
    * @method Phaser.Tilemap#shuffle
    * @param {number} tileA - First tile index.
    * @param {number} tileB - Second tile index.
    * @param {number} x - X position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} y - Y position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} width - The width in tiles of the area to operate on.
    * @param {number} height - The height in tiles of the area to operate on.
    * @param {number} [layer] - The Tilemap Layer to operate on.
    */
    shuffle: function (x, y, width, height, layer) {

        if (typeof layer === "undefined") { layer = this.currentLayer; }

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        var header = this._results.shift();

        Phaser.Utils.shuffle(this._results);

        this._results.unshift(header);

        this.paste(x, y, this._results);

    },

    /**
    * Fill a block with a specific tile index.
    * @method Phaser.Tilemap#fill
    * @param {number} index - Index of tiles you want to fill with.
    * @param {number} x - X position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} y - Y position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} width - The width in tiles of the area to operate on.
    * @param {number} height - The height in tiles of the area to operate on.
    * @param {number} [layer] - The Tilemap Layer to operate on.
    */
    fill: function (index, x, y, width, height, layer) {

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        for (var i = 1; i < this._results.length; i++)
        {
            this._results[i].index = index;
        }

        this.paste(x, y, this._results);

    },

    /**
    * Removes all layers from this tile map.
    * @method Phaser.Tilemap#removeAllLayers
    */
    removeAllLayers: function () {

        this.layers.length = 0;
        this.currentLayer = 0;

    },

    /**
    * Dumps the tilemap data out to the console.
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
    * Removes all layers from this tile map and nulls the game reference.
    * @method Phaser.Tilemap#destroy
    */
    destroy: function () {

        this.removeAllLayers();
        this.game = null;

    }

};

Phaser.Tilemap.prototype.constructor = Phaser.Tilemap;
