var Class = require('../../utils/Class');
var Components = require('../components');
var Rectangle = require('../../geom/rectangle');

/**
 * A Tile is a representation of a single tile within the Tilemap. This is a lightweight data
 * representation, so it's position information is stored without factoring in scroll, layer
 * scale or layer position.
 *
 * @class Tile
 * @memberOf Phaser.GameObjects.Tilemaps
 * @constructor
 * @since 3.0.0
 *
 * @param {LayerData} layer - The LayerData object in the Tilemap that this tile belongs to.
 * @param {integer} index - The unique index of this tile within the map.
 * @param {integer} x - The x coordinate of this tile in tile coordinates.
 * @param {integer} y - The y coordinate of this tile in tile coordinates.
 * @param {integer} width - Width of the tile in pixels.
 * @param {integer} height - Height of the tile in pixels.
 * @param {integer} baseWidth - The base width a tile in the map (in pixels). Tiled maps support
 * multiple tileset sizes within one map, but they are still placed at intervals of the base
 * tile width.
 * @param {integer} baseHeight - The base height of the tile in pixels (in pixels). Tiled maps
 * support multiple tileset sizes within one map, but they are still placed at intervals of the
 * base tile height.
 */
var Tile = new Class({

    Mixins: [
        Components.Alpha,
        Components.Flip,
        Components.Visible
    ],

    initialize:

    function Tile (layer, index, x, y, width, height, baseWidth, baseHeight)
    {
        /**
         * The LayerData in the Tilemap data that this tile belongs to.
         * @property {LayerData} layer
         */
        this.layer = layer;

        /**
         * The index of this tile within the map data corresponding to the tileset, or -1 if this
         * represents a blank tile.
         * @property {integer} index
         */
        this.index = index;

        /**
         * The x map coordinate of this tile in tile units.
         * @property {integer} x
         */
        this.x = x;

        /**
         * The y map coordinate of this tile in tile units.
         * @property {integer} y
         */
        this.y = y;

        /**
         * The width of the tile in pixels.
         * @property {integer} width
         */
        this.width = width;

        /**
         * The height of the tile in pixels.
         * @property {integer} height
         */
        this.height = height;

        /**
         * The map's base width of a tile in pixels. Tiled maps support multiple tileset sizes
         * within one map, but they are still placed at intervals of the base tile size.
         * @property {integer} baseWidth
         */
        this.baseWidth = (baseWidth !== undefined) ? baseWidth : width;

        /**
         * The map's base height of a tile in pixels. Tiled maps support multiple tileset sizes
         * within one map, but they are still placed at intervals of the base tile size.
         * @property {integer} baseHeight
         */
        this.baseHeight = (baseHeight !== undefined) ? baseHeight : height;

        /**
         * The x coordinate of the top left of this tile in pixels. This is relative to the top left
         * of the layer this tile is being rendered within. This property does NOT factor in camera
         * scroll, layer scale or layer position.
         * @property {number} pixelX
         */
        this.pixelX = 0;

        /**
         * The y coordinate of the top left of this tile in pixels. This is relative to the top left
         * of the layer this tile is being rendered within. This property does NOT factor in camera
         * scroll, layer scale or layer position.
         * @property {number} pixelY
         */
        this.pixelY = 0;

        this.updatePixelXY();

        /**
         * Tile specific properties. These usually come from Tiled.
         * @property {object} properties
         */
        this.properties = {};

        /**
         * The rotation angle of this tile.
         * @property {number} rotation
         */
        this.rotation = 0;

        /**
         * Whether the tile should collide with any object on the left side.
         * @property {boolean} collideLeft
         */
        this.collideLeft = false;

        /**
         * Whether the tile should collide with any object on the right side.
         * @property {boolean} collideRight
         */
        this.collideRight = false;

        /**
         * Whether the tile should collide with any object on the top side.
         * @property {boolean} collideUp
         */
        this.collideUp = false;

        /**
         * Whether the tile should collide with any object on the bottom side.
         * @property {boolean} collideDown
         */
        this.collideDown = false;

        /**
         * Whether the tile's left edge is interesting for collisions.
         * @property {boolean} faceLeft
         */
        this.faceLeft = false;

        /**
         * Whether the tile's right edge is interesting for collisions.
         * @property {boolean} faceRight
         */
        this.faceRight = false;

        /**
         * Whether the tile's top edge is interesting for collisions.
         * @property {boolean} faceTop
         */
        this.faceTop = false;

        /**
         * Whether the tile's bottom edge is interesting for collisions.
         * @property {boolean} faceBottom
         */
        this.faceBottom = false;

        /**
         * Tile collision callback.
         * @property {function} collisionCallback
         */
        this.collisionCallback = null;

        /**
         * The context in which the collision callback will be called.
         * @property {object} collisionCallbackContext
         */
        this.collisionCallbackContext = this;

        /**
         * The tint to apply to this tile. Note: tint is currently a single color value instead of
         * the 4 corner tint component on other GameObjects.
         * @property {number} Tint
         * @default
         */
        this.tint = 0xffffff;

        /**
         * An empty object where physics-engine specific information (e.g. bodies) may be stored.
         * @property {object} physics
         */
        this.physics = {};
    },

    /**
     * Check if the given x and y world coordinates are within this Tile. This does not factor in
     * camera scroll, layer scale or layer position.
     *
     * @param {number} x - The x coordinate to test.
     * @param {number} y - The y coordinate to test.
     * @return {boolean} True if the coordinates are within this Tile, otherwise false.
     */
    containsPoint: function (x, y)
    {
        return !(x < this.pixelX || y < this.pixelY || x > this.right || y > this.bottom);
    },

    /**
     * Copies the tile data & properties from the given tile to this tile. This copies everything
     * except for position and interesting faces.
     *
     * @param {Tile} tile - The tile to copy from.
     * @returns {this}
     */
    copy: function (tile)
    {
        this.index = tile.index;
        this.alpha = tile.alpha;
        this.properties = tile.properties;
        this.visible = tile.visible;
        this.setFlip(tile.flipX, tile.flipY);
        this.tint = tile.tint;
        this.rotation = tile.rotation;
        this.collideUp = tile.collideUp;
        this.collideDown = tile.collideDown;
        this.collideLeft = tile.collideLeft;
        this.collideRight = tile.collideRight;
        this.collisionCallback = tile.collisionCallback;
        this.collisionCallbackContext = tile.collisionCallbackContext;

        return this;
    },

    /**
     * The collision group for this Tile, defined within the Tileset. This returns a reference to
     * the collision group stored within the Tileset, so any modification of the returned object
     * will impact all tiles that have the same index as this tile.
     * @returns {object|null} tileset
     */
    getCollisionGroup: function ()
    {
        return this.tileset ? this.tileset.getTileCollisionGroup(this.index) : null;
    },

    /**
     * The tile data for this Tile, defined within the Tileset. This typically contains Tiled
     * collision data, tile animations and terrain information. This returns a reference to the tile
     * data stored within the Tileset, so any modification of the returned object will impact all
     * tiles that have the same index as this tile.
     * @returns {object|null} tileset
     */
    getTileData: function ()
    {
        return this.tileset ? this.tileset.getTileData(this.index) : null;
    },

    /**
     * Gets the world X position of the left side of the tile, factoring in the layer's position,
     * scale and scroll.
     * @param {Camera} [camera=main camera] - [description]
     * @returns {number}
     */
    getLeft: function (camera)
    {
        var tilemapLayer = this.tilemapLayer;
        return tilemapLayer
            ? tilemapLayer.tileToWorldX(this.x, camera)
            : this.x * this.baseWidth;
    },

    /**
     * Gets the world X position of the right side of the tile, factoring in the layer's position,
     * scale and scroll.
     * @param {Camera} [camera=main camera] - [description]
     * @returns {number}
     */
    getRight: function (camera)
    {
        var tilemapLayer = this.tilemapLayer;
        return tilemapLayer
            ? this.getLeft(camera) + this.width * tilemapLayer.scaleX
            : this.getLeft(camera) + this.width;
    },

    /**
     * Gets the world Y position of the top side of the tile, factoring in the layer's position,
     * scale and scroll.
     * @param {Camera} [camera=main camera] - [description]
     * @returns {number}
     */
    getTop: function (camera)
    {
        var tilemapLayer = this.tilemapLayer;

        // Tiled places tiles on a grid of baseWidth x baseHeight. The origin for a tile in grid
        // units is the bottom left, so the y coordinate needs to be adjusted by the difference
        // between the base size and this tile's size.
        return tilemapLayer
            ? tilemapLayer.tileToWorldY(this.y, camera) - (this.height - this.baseHeight) * tilemapLayer.scaleY
            : this.y * this.baseHeight - (this.height - this.baseHeight);
    },

    /**
     * Gets the world Y position of the bottom side of the tile, factoring in the layer's position,
     * scale and scroll.
     * @param {Camera} [camera=main camera] - [description]
     * @returns {number}
     */
    getBottom: function (camera)
    {
        var tilemapLayer = this.tilemapLayer;
        return tilemapLayer
            ? this.getTop(camera) + this.height * tilemapLayer.scaleY
            : this.getTop(camera) + this.height;
    },


    /**
     * Gets the world rectangle bounding box for the tile, factoring in the layer's position,
     * scale and scroll.
     * @param {Camera} [camera=main camera] - [description]
     * @param {object} [output] - [description]
     * @returns {Phaser.Geom.Rectangle|object}
     */
    getBounds: function (camera, output)
    {
        if (output === undefined) { output = new Rectangle(); }

        output.x = this.getLeft();
        output.y = this.getTop();
        output.width = this.getRight() - output.x;
        output.height = this.getBottom() - output.y;
        return output;
    },

    /**
     * Gets the world X position of the center of the tile, factoring in the layer's position,
     * scale and scroll.
     * @param {Camera} [camera=main camera] - [description]
     * @returns {number}
     */
    getCenterX: function (camera)
    {
        return this.getLeft(camera) + this.width / 2;
    },

    /**
     * Gets the world Y position of the center of the tile, factoring in the layer's position,
     * scale and scroll.
     * @param {Camera} [camera=main camera] - [description]
     * @returns {number}
     */
    getCenterY: function (camera)
    {
        return this.getTop(camera) + this.height / 2;
    },

    /**
     * Clean up memory.
     */
    destroy: function ()
    {
        this.collisionCallback = undefined;
        this.collisionCallbackContext = undefined;
        this.properties = undefined;
    },

    /**
     * Check for intersection with this tile. This does not factor in camera scroll, layer scale or
     * layer position.
     *
     * @param {number} x - The x axis in pixels.
     * @param {number} y - The y axis in pixels.
     * @param {number} right - The right point.
     * @param {number} bottom - The bottom point.
     * @return {boolean}
     */
    intersects: function (x, y, right, bottom)
    {
        return !(
            right <= this.pixelX || bottom <= this.pixelY ||
            x >= this.right || y >= this.bottom
        );
    },

    /**
     * Checks if the tile is interesting.
     *
     * @param {boolean} collides - If true, will consider the tile interesting if it collides on any
     * side.
     * @param {boolean} faces - If true, will consider the tile interesting if it has an interesting
     * face.
     * @returns {boolean} True if the Tile is interesting, otherwise false.
     */
    isInteresting: function (collides, faces)
    {
        if (collides && faces) { return (this.canCollide || this.hasInterestingFace); }
        else if (collides) { return this.collides; }
        else if (faces) { return this.hasInterestingFace; }
        return false;
    },

    /**
     * Reset collision status flags.
     *
     * @param {boolean} [recalculateFaces=true] - Whether or not to recalculate interesting faces
     * for this tile and its neighbors.
     * @returns {this}
     */
    resetCollision: function (recalculateFaces)
    {
        if (recalculateFaces === undefined) { recalculateFaces = true; }

        this.collideLeft = false;
        this.collideRight = false;
        this.collideUp = false;
        this.collideDown = false;

        this.faceTop = false;
        this.faceBottom = false;
        this.faceLeft = false;
        this.faceRight = false;

        if (recalculateFaces)
        {
            var tilemapLayer = this.tilemapLayer;
            if (tilemapLayer)
            {
                this.tilemapLayer.calculateFacesAt(this.x, this.y);
            }
        }

        return this;
    },

    /**
     * Reset faces.
     *
     * @returns {this}
     */
    resetFaces: function ()
    {
        this.faceTop = false;
        this.faceBottom = false;
        this.faceLeft = false;
        this.faceRight = false;

        return this;
    },

    /**
     * Sets the collision flags for each side of this tile and updates the interesting faces list.
     *
     * @param {boolean} left - Indicating collide with any object on the left.
     * @param {boolean} right - Indicating collide with any object on the right.
     * @param {boolean} up - Indicating collide with any object on the top.
     * @param {boolean} down - Indicating collide with any object on the bottom.
     * @param {boolean} [recalculateFaces=true] - Whether or not to recalculate interesting faces
     * for this tile and its neighbors.
     * @returns {this}
     */
    setCollision: function (left, right, up, down, recalculateFaces)
    {
        if (right === undefined) { right = left; }
        if (up === undefined) { up = left; }
        if (down === undefined) { down = left; }
        if (recalculateFaces === undefined) { recalculateFaces = true; }

        this.collideLeft = left;
        this.collideRight = right;
        this.collideUp = up;
        this.collideDown = down;

        this.faceLeft = left;
        this.faceRight = right;
        this.faceTop = up;
        this.faceBottom = down;

        if (recalculateFaces)
        {
            var tilemapLayer = this.tilemapLayer;
            if (tilemapLayer)
            {
                this.tilemapLayer.calculateFacesAt(this.x, this.y);
            }
        }

        return this;
    },

    /**
     * Set a callback to be called when this tile is hit by an object. The callback must true for
     * collision processing to take place.
     *
     * @param {function} callback - Callback function.
     * @param {object} context - Callback will be called within this context.
     * @returns {this}
     */
    setCollisionCallback: function (callback, context)
    {
        if (callback === null)
        {
            this.collisionCallback = undefined;
            this.collisionCallbackContext = undefined;
        }
        else
        {
            this.collisionCallback = callback;
            this.collisionCallbackContext = context;
        }

        return this;
    },

    /**
     * Sets the size of the tile and updates its pixelX and pixelY.
     *
     * @param {integer} tileWidth - The width of the tile in pixels.
     * @param {integer} tileHeight - The height of the tile in pixels.
     * @param {integer} baseWidth - The base width a tile in the map (in pixels).
     * @param {integer} baseHeight - The base height of the tile in pixels (in pixels).
     * @returns {this}
     */
    setSize: function (tileWidth, tileHeight, baseWidth, baseHeight)
    {
        if (tileWidth !== undefined) { this.width = tileWidth; }
        if (tileHeight !== undefined) { this.height = tileHeight; }
        if (baseWidth !== undefined) { this.baseWidth = baseWidth; }
        if (baseHeight !== undefined) { this.baseHeight = baseHeight; }

        this.updatePixelXY();

        return this;
    },

    /**
     * Used internally. Updates the tile's world XY position based on the current tile size.
     *
     * @returns {this}
     */
    updatePixelXY: function ()
    {
        // Tiled places tiles on a grid of baseWidth x baseHeight. The origin for a tile is the
        // bottom left, while the Phaser renderer assumes the origin is the top left. The y
        // coordinate needs to be adjusted by the difference.
        this.pixelX = this.x * this.baseWidth;
        this.pixelY = this.y * this.baseHeight - (this.height - this.baseHeight);

        return this;
    },

    /**
     * True if this tile can collide on any of its faces or has a collision callback set.
     * @property {boolean} canCollide
     * @readonly
     */
    canCollide: {
        get: function ()
        {
            return (this.collideLeft || this.collideRight || this.collideUp || this.collideDown || this.collisionCallback);
        }
    },

    /**
     * True if this tile can collide on any of its faces.
     * @property {boolean} canCollide
     * @readonly
     */
    collides: {
        get: function ()
        {
            return (this.collideLeft || this.collideRight || this.collideUp || this.collideDown);
        }
    },

    /**
     * True if this tile has any interesting faces.
     * @property {boolean} canCollide
     * @readonly
     */
    hasInterestingFace: {
        get: function ()
        {
            return (this.faceTop || this.faceBottom || this.faceLeft || this.faceRight);
        }
    },

    /**
     * The tileset that contains this Tile. This will only return null if accessed from a LayerData
     * instance before the tile is placed within a StaticTilemapLayer or DynamicTilemapLayer.
     * @property {Tileset|null} tileset
     * @readonly
     */
    tileset: {
        get: function ()
        {
            var tilemapLayer = this.tilemapLayer;
            return tilemapLayer ? tilemapLayer.tileset : null;
        }
    },

    /**
     * The tilemap layer that contains this Tile. This will only return null if accessed from a
     * LayerData instance before the tile is placed within a StaticTilemapLayer or
     * DynamicTilemapLayer.
     * @property {StaticTilemapLayer|DynamicTilemapLayer|null} tilemapLayer
     * @readonly
     */
    tilemapLayer: {
        get: function ()
        {
            return this.layer.tilemapLayer;
        }
    },

    /**
     * The tilemap that contains this Tile. This will only return null if accessed from a LayerData
     * instance before the tile is placed within a StaticTilemapLayer or DynamicTilemapLayer.
     * @property {Tilemap|null} tilemap
     * @readonly
     */
    tilemap: {
        get: function ()
        {
            var tilemapLayer = this.tilemapLayer;
            return tilemapLayer ? tilemapLayer.tilemap : null;
        }
    }
});

module.exports = Tile;
