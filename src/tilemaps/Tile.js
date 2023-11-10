/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Components = require('../gameobjects/components');
var CONST = require('./const/ORIENTATION_CONST');
var DeepCopy = require('../utils/object/DeepCopy');
var Rectangle = require('../geom/rectangle');

/**
 * @classdesc
 * A Tile is a representation of a single tile within the Tilemap. This is a lightweight data
 * representation, so its position information is stored without factoring in scroll, layer
 * scale or layer position.
 *
 * @class Tile
 * @memberof Phaser.Tilemaps
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.AlphaSingle
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Tilemaps.LayerData} layer - The LayerData object in the Tilemap that this tile belongs to.
 * @param {number} index - The unique index of this tile within the map.
 * @param {number} x - The x coordinate of this tile in tile coordinates.
 * @param {number} y - The y coordinate of this tile in tile coordinates.
 * @param {number} width - Width of the tile in pixels.
 * @param {number} height - Height of the tile in pixels.
 * @param {number} baseWidth - The base width a tile in the map (in pixels). Tiled maps support
 * multiple tileset sizes within one map, but they are still placed at intervals of the base
 * tile width.
 * @param {number} baseHeight - The base height of the tile in pixels (in pixels). Tiled maps
 * support multiple tileset sizes within one map, but they are still placed at intervals of the
 * base tile height.
 */
var Tile = new Class({

    Mixins: [
        Components.AlphaSingle,
        Components.Flip,
        Components.Visible
    ],

    initialize:

    function Tile (layer, index, x, y, width, height, baseWidth, baseHeight)
    {
        /**
         * The LayerData in the Tilemap data that this tile belongs to.
         *
         * @name Phaser.Tilemaps.Tile#layer
         * @type {Phaser.Tilemaps.LayerData}
         * @since 3.0.0
         */
        this.layer = layer;

        /**
         * The index of this tile within the map data corresponding to the tileset, or -1 if this
         * represents a blank tile.
         *
         * @name Phaser.Tilemaps.Tile#index
         * @type {number}
         * @since 3.0.0
         */
        this.index = index;

        /**
         * The x map coordinate of this tile in tile units.
         *
         * @name Phaser.Tilemaps.Tile#x
         * @type {number}
         * @since 3.0.0
         */
        this.x = x;

        /**
         * The y map coordinate of this tile in tile units.
         *
         * @name Phaser.Tilemaps.Tile#y
         * @type {number}
         * @since 3.0.0
         */
        this.y = y;

        /**
         * The width of the tile in pixels.
         *
         * @name Phaser.Tilemaps.Tile#width
         * @type {number}
         * @since 3.0.0
         */
        this.width = width;

        /**
         * The height of the tile in pixels.
         *
         * @name Phaser.Tilemaps.Tile#height
         * @type {number}
         * @since 3.0.0
         */
        this.height = height;

        /**
         * The right of the tile in pixels.
         *
         * Set in the `updatePixelXY` method.
         *
         * @name Phaser.Tilemaps.Tile#right
         * @type {number}
         * @since 3.50.0
         */
        this.right;

        /**
         * The bottom of the tile in pixels.
         *
         * Set in the `updatePixelXY` method.
         *
         * @name Phaser.Tilemaps.Tile#bottom
         * @type {number}
         * @since 3.50.0
         */
        this.bottom;

        /**
         * The maps base width of a tile in pixels. Tiled maps support multiple tileset sizes
         * within one map, but they are still placed at intervals of the base tile size.
         *
         * @name Phaser.Tilemaps.Tile#baseWidth
         * @type {number}
         * @since 3.0.0
         */
        this.baseWidth = (baseWidth !== undefined) ? baseWidth : width;

        /**
         * The maps base height of a tile in pixels. Tiled maps support multiple tileset sizes
         * within one map, but they are still placed at intervals of the base tile size.
         *
         * @name Phaser.Tilemaps.Tile#baseHeight
         * @type {number}
         * @since 3.0.0
         */
        this.baseHeight = (baseHeight !== undefined) ? baseHeight : height;

        /**
         * The x coordinate of the top left of this tile in pixels. This is relative to the top left
         * of the layer this tile is being rendered within. This property does NOT factor in camera
         * scroll, layer scale or layer position.
         *
         * @name Phaser.Tilemaps.Tile#pixelX
         * @type {number}
         * @since 3.0.0
         */
        this.pixelX = 0;

        /**
         * The y coordinate of the top left of this tile in pixels. This is relative to the top left
         * of the layer this tile is being rendered within. This property does NOT factor in camera
         * scroll, layer scale or layer position.
         *
         * @name Phaser.Tilemaps.Tile#pixelY
         * @type {number}
         * @since 3.0.0
         */
        this.pixelY = 0;

        this.updatePixelXY();

        /**
         * Tile specific properties. These usually come from Tiled.
         *
         * @name Phaser.Tilemaps.Tile#properties
         * @type {any}
         * @since 3.0.0
         */
        this.properties = {};

        /**
         * The rotation angle of this tile.
         *
         * @name Phaser.Tilemaps.Tile#rotation
         * @type {number}
         * @since 3.0.0
         */
        this.rotation = 0;

        /**
         * Whether the tile should collide with any object on the left side.
         *
         * This property is used by Arcade Physics only, however, you can also use it
         * in your own checks.
         *
         * @name Phaser.Tilemaps.Tile#collideLeft
         * @type {boolean}
         * @since 3.0.0
         */
        this.collideLeft = false;

        /**
         * Whether the tile should collide with any object on the right side.
         *
         * This property is used by Arcade Physics only, however, you can also use it
         * in your own checks.
         *
         * @name Phaser.Tilemaps.Tile#collideRight
         * @type {boolean}
         * @since 3.0.0
         */
        this.collideRight = false;

        /**
         * Whether the tile should collide with any object on the top side.
         *
         * This property is used by Arcade Physics only, however, you can also use it
         * in your own checks.
         *
         * @name Phaser.Tilemaps.Tile#collideUp
         * @type {boolean}
         * @since 3.0.0
         */
        this.collideUp = false;

        /**
         * Whether the tile should collide with any object on the bottom side.
         *
         * This property is used by Arcade Physics only, however, you can also use it
         * in your own checks.
         *
         * @name Phaser.Tilemaps.Tile#collideDown
         * @type {boolean}
         * @since 3.0.0
         */
        this.collideDown = false;

        /**
         * Whether the tiles left edge is interesting for collisions.
         *
         * @name Phaser.Tilemaps.Tile#faceLeft
         * @type {boolean}
         * @since 3.0.0
         */
        this.faceLeft = false;

        /**
         * Whether the tiles right edge is interesting for collisions.
         *
         * @name Phaser.Tilemaps.Tile#faceRight
         * @type {boolean}
         * @since 3.0.0
         */
        this.faceRight = false;

        /**
         * Whether the tiles top edge is interesting for collisions.
         *
         * @name Phaser.Tilemaps.Tile#faceTop
         * @type {boolean}
         * @since 3.0.0
         */
        this.faceTop = false;

        /**
         * Whether the tiles bottom edge is interesting for collisions.
         *
         * @name Phaser.Tilemaps.Tile#faceBottom
         * @type {boolean}
         * @since 3.0.0
         */
        this.faceBottom = false;

        /**
         * Tile collision callback.
         *
         * @name Phaser.Tilemaps.Tile#collisionCallback
         * @type {function}
         * @since 3.0.0
         */
        this.collisionCallback = undefined;

        /**
         * The context in which the collision callback will be called.
         *
         * @name Phaser.Tilemaps.Tile#collisionCallbackContext
         * @type {object}
         * @since 3.0.0
         */
        this.collisionCallbackContext = this;

        /**
         * The tint to apply to this tile. Note: tint is currently a single color value instead of
         * the 4 corner tint component on other GameObjects.
         *
         * @name Phaser.Tilemaps.Tile#tint
         * @type {number}
         * @default
         * @since 3.0.0
         */
        this.tint = 0xffffff;

        /**
         * The tint fill mode.
         *
         * `false` = An additive tint (the default), where vertices colors are blended with the texture.
         * `true` = A fill tint, where the vertices colors replace the texture, but respects texture alpha.
         *
         * @name Phaser.Tilemaps.Tile#tintFill
         * @type {boolean}
         * @default
         * @since 3.70.0
         */
        this.tintFill = false;

        /**
         * An empty object where physics-engine specific information (e.g. bodies) may be stored.
         *
         * @name Phaser.Tilemaps.Tile#physics
         * @type {object}
         * @since 3.0.0
         */
        this.physics = {};
    },

    /**
     * Check if the given x and y world coordinates are within this Tile. This does not factor in
     * camera scroll, layer scale or layer position.
     *
     * @method Phaser.Tilemaps.Tile#containsPoint
     * @since 3.0.0
     *
     * @param {number} x - The x coordinate to test.
     * @param {number} y - The y coordinate to test.
     *
     * @return {boolean} True if the coordinates are within this Tile, otherwise false.
     */
    containsPoint: function (x, y)
    {
        return !(x < this.pixelX || y < this.pixelY || x > this.right || y > this.bottom);
    },

    /**
     * Copies the tile data and properties from the given Tile to this Tile. This copies everything
     * except for position and interesting face calculations.
     *
     * @method Phaser.Tilemaps.Tile#copy
     * @since 3.0.0
     *
     * @param {Phaser.Tilemaps.Tile} tile - The tile to copy from.
     *
     * @return {this} This Tile object instance.
     */
    copy: function (tile)
    {
        this.index = tile.index;
        this.alpha = tile.alpha;
        this.properties = DeepCopy(tile.properties);
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
     *
     * @method Phaser.Tilemaps.Tile#getCollisionGroup
     * @since 3.0.0
     *
     * @return {?object} The collision group for this Tile, as defined in the Tileset, or `null` if no group was defined.
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
     *
     * @method Phaser.Tilemaps.Tile#getTileData
     * @since 3.0.0
     *
     * @return {?object} The tile data for this Tile, as defined in the Tileset, or `null` if no data was defined.
     */
    getTileData: function ()
    {
        return this.tileset ? this.tileset.getTileData(this.index) : null;
    },

    /**
     * Gets the world X position of the left side of the tile, factoring in the layers position,
     * scale and scroll.
     *
     * @method Phaser.Tilemaps.Tile#getLeft
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to use to perform the check.
     *
     * @return {number} The left (x) value of this tile.
     */
    getLeft: function (camera)
    {
        var tilemapLayer = this.tilemapLayer;

        if (tilemapLayer)
        {
            var point = tilemapLayer.tileToWorldXY(this.x, this.y, undefined, camera);

            return point.x;
        }

        return this.x * this.baseWidth;
    },

    /**
     * Gets the world X position of the right side of the tile, factoring in the layer's position,
     * scale and scroll.
     *
     * @method Phaser.Tilemaps.Tile#getRight
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to use to perform the check.
     *
     * @return {number} The right (x) value of this tile.
     */
    getRight: function (camera)
    {
        var tilemapLayer = this.tilemapLayer;

        return (tilemapLayer) ? this.getLeft(camera) + this.width * tilemapLayer.scaleX : this.getLeft(camera) + this.width;
    },

    /**
     * Gets the world Y position of the top side of the tile, factoring in the layer's position,
     * scale and scroll.
     *
     * @method Phaser.Tilemaps.Tile#getTop
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to use to perform the check.
     *
     * @return {number} The top (y) value of this tile.
     */
    getTop: function (camera)
    {
        var tilemapLayer = this.tilemapLayer;

        // Tiled places tiles on a grid of baseWidth x baseHeight. The origin for a tile in grid
        // units is the bottom left, so the y coordinate needs to be adjusted by the difference
        // between the base size and this tile's size.
        if (tilemapLayer)
        {
            var point = tilemapLayer.tileToWorldXY(this.x, this.y, undefined, camera);

            return point.y;
        }

        return this.y * this.baseWidth - (this.height - this.baseHeight);
    },

    /**
     * Gets the world Y position of the bottom side of the tile, factoring in the layer's position,
     * scale and scroll.

     * @method Phaser.Tilemaps.Tile#getBottom
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to use to perform the check.
     *
     * @return {number} The bottom (y) value of this tile.
     */
    getBottom: function (camera)
    {
        var tilemapLayer = this.tilemapLayer;

        return tilemapLayer
            ? this.getTop(camera) + this.height * tilemapLayer.scaleY
            : this.getTop(camera) + this.height;
    },

    /**
     * Gets the world rectangle bounding box for the tile, factoring in the layers position,
     * scale and scroll.
     *
     * @method Phaser.Tilemaps.Tile#getBounds
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to use to perform the check.
     * @param {Phaser.Geom.Rectangle} [output] - Optional Rectangle object to store the results in.
     *
     * @return {(Phaser.Geom.Rectangle|object)} The bounds of this Tile.
     */
    getBounds: function (camera, output)
    {
        if (output === undefined) { output = new Rectangle(); }

        output.x = this.getLeft(camera);
        output.y = this.getTop(camera);
        output.width = this.getRight(camera) - output.x;
        output.height = this.getBottom(camera) - output.y;

        return output;
    },

    /**
     * Gets the world X position of the center of the tile, factoring in the layer's position,
     * scale and scroll.
     *
     * @method Phaser.Tilemaps.Tile#getCenterX
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to use to perform the check.
     *
     * @return {number} The center x position of this Tile.
     */
    getCenterX: function (camera)
    {
        return (this.getLeft(camera) + this.getRight(camera)) / 2;
    },

    /**
     * Gets the world Y position of the center of the tile, factoring in the layer's position,
     * scale and scroll.
     *
     * @method Phaser.Tilemaps.Tile#getCenterY
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to use to perform the check.
     *
     * @return {number} The center y position of this Tile.
     */
    getCenterY: function (camera)
    {
        return (this.getTop(camera) + this.getBottom(camera)) / 2;
    },

    /**
     * Check for intersection with this tile. This does not factor in camera scroll, layer scale or
     * layer position.
     *
     * @method Phaser.Tilemaps.Tile#intersects
     * @since 3.0.0
     *
     * @param {number} x - The x axis in pixels.
     * @param {number} y - The y axis in pixels.
     * @param {number} right - The right point.
     * @param {number} bottom - The bottom point.
     *
     * @return {boolean} `true` if the Tile intersects with the given dimensions, otherwise `false`.
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
     * @method Phaser.Tilemaps.Tile#isInteresting
     * @since 3.0.0
     *
     * @param {boolean} collides - If true, will consider the tile interesting if it collides on any side.
     * @param {boolean} faces - If true, will consider the tile interesting if it has an interesting face.
     *
     * @return {boolean} True if the Tile is interesting, otherwise false.
     */
    isInteresting: function (collides, faces)
    {
        if (collides && faces)
        {
            return (this.canCollide || this.hasInterestingFace);
        }
        else if (collides)
        {
            return this.collides;
        }
        else if (faces)
        {
            return this.hasInterestingFace;
        }

        return false;
    },

    /**
     * Reset collision status flags.
     *
     * @method Phaser.Tilemaps.Tile#resetCollision
     * @since 3.0.0
     *
     * @param {boolean} [recalculateFaces=true] - Whether or not to recalculate interesting faces for this tile and its neighbors.
     *
     * @return {this} This Tile object instance.
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
     * @method Phaser.Tilemaps.Tile#resetFaces
     * @since 3.0.0
     *
     * @return {this} This Tile object instance.
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
     * @method Phaser.Tilemaps.Tile#setCollision
     * @since 3.0.0
     *
     * @param {boolean} left - Indicating collide with any object on the left.
     * @param {boolean} [right] - Indicating collide with any object on the right.
     * @param {boolean} [up] - Indicating collide with any object on the top.
     * @param {boolean} [down] - Indicating collide with any object on the bottom.
     * @param {boolean} [recalculateFaces=true] - Whether or not to recalculate interesting faces for this tile and its neighbors.
     *
     * @return {this} This Tile object instance.
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
     * @method Phaser.Tilemaps.Tile#setCollisionCallback
     * @since 3.0.0
     *
     * @param {function} callback - Callback function.
     * @param {object} context - Callback will be called within this context.
     *
     * @return {this} This Tile object instance.
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
     * @method Phaser.Tilemaps.Tile#setSize
     * @since 3.0.0
     *
     * @param {number} tileWidth - The width of the tile in pixels.
     * @param {number} tileHeight - The height of the tile in pixels.
     * @param {number} baseWidth - The base width a tile in the map (in pixels).
     * @param {number} baseHeight - The base height of the tile in pixels (in pixels).
     *
     * @return {this} This Tile object instance.
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
     * Used internally. Updates the tiles world XY position based on the current tile size.
     *
     * @method Phaser.Tilemaps.Tile#updatePixelXY
     * @since 3.0.0
     *
     * @return {this} This Tile object instance.
     */
    updatePixelXY: function ()
    {
        var orientation = this.layer.orientation;

        if (orientation === CONST.ORTHOGONAL)
        {
            //  In orthogonal mode, Tiled places tiles on a grid of baseWidth x baseHeight. The origin for a tile is the
            //  bottom left, while the Phaser renderer assumes the origin is the top left. The y
            //  coordinate needs to be adjusted by the difference.

            this.pixelX = this.x * this.baseWidth;
            this.pixelY = this.y * this.baseHeight;
        }
        else if (orientation === CONST.ISOMETRIC)
        {
            //  Reminder: For the tilemap to be centered we have to move the image to the right with the camera!
            //  This is crucial for wordtotile, tiletoworld to work.

            this.pixelX = (this.x - this.y) * this.baseWidth * 0.5;
            this.pixelY = (this.x + this.y) * this.baseHeight * 0.5;
        }
        else if (orientation === CONST.STAGGERED)
        {
            this.pixelX = this.x * this.baseWidth + this.y % 2 * (this.baseWidth / 2);
            this.pixelY = this.y * (this.baseHeight / 2);
        }
        else if (orientation === CONST.HEXAGONAL)
        {
            var staggerAxis = this.layer.staggerAxis;
            var staggerIndex = this.layer.staggerIndex;
            var len = this.layer.hexSideLength;
            var rowWidth;
            var rowHeight;

            if (staggerAxis === 'y')
            {
                rowHeight = ((this.baseHeight - len) / 2 + len);

                if (staggerIndex === 'odd')
                {
                    this.pixelX = this.x * this.baseWidth + this.y % 2 * (this.baseWidth / 2);
                }
                else
                {
                    this.pixelX = this.x * this.baseWidth - this.y % 2 * (this.baseWidth / 2);
                }

                this.pixelY = this.y * rowHeight;
            }
            else if (staggerAxis === 'x')
            {
                rowWidth = ((this.baseWidth - len) / 2 + len);

                this.pixelX = this.x * rowWidth;

                if (staggerIndex === 'odd')
                {
                    this.pixelY = this.y * this.baseHeight + this.x % 2 * (this.baseHeight / 2);
                }
                else
                {
                    this.pixelY = this.y * this.baseHeight - this.x % 2 * (this.baseHeight / 2);
                }
            }
        }

        this.right = this.pixelX + this.baseWidth;
        this.bottom = this.pixelY + this.baseHeight;

        return this;
    },

    /**
     * Clean up memory.
     *
     * @method Phaser.Tilemaps.Tile#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.collisionCallback = undefined;
        this.collisionCallbackContext = undefined;
        this.properties = undefined;
    },

    /**
     * True if this tile can collide on any of its faces or has a collision callback set.
     *
     * @name Phaser.Tilemaps.Tile#canCollide
     * @type {boolean}
     * @readonly
     * @since 3.0.0
     */
    canCollide: {

        get: function ()
        {
            return (this.collideLeft || this.collideRight || this.collideUp || this.collideDown || (this.collisionCallback !== undefined));
        }

    },

    /**
     * True if this tile can collide on any of its faces.
     *
     * @name Phaser.Tilemaps.Tile#collides
     * @type {boolean}
     * @readonly
     * @since 3.0.0
     */
    collides: {

        get: function ()
        {
            return (this.collideLeft || this.collideRight || this.collideUp || this.collideDown);
        }

    },

    /**
     * True if this tile has any interesting faces.
     *
     * @name Phaser.Tilemaps.Tile#hasInterestingFace
     * @type {boolean}
     * @readonly
     * @since 3.0.0
     */
    hasInterestingFace: {

        get: function ()
        {
            return (this.faceTop || this.faceBottom || this.faceLeft || this.faceRight);
        }

    },

    /**
     * The tileset that contains this Tile. This is null if accessed from a LayerData instance
     * before the tile is placed in a TilemapLayer, or if the tile has an index that doesn't correspond
     * to any of the maps tilesets.
     *
     * @name Phaser.Tilemaps.Tile#tileset
     * @type {?Phaser.Tilemaps.Tileset}
     * @readonly
     * @since 3.0.0
     */
    tileset: {

        get: function ()
        {
            var tilemapLayer = this.layer.tilemapLayer;

            if (tilemapLayer)
            {
                var tileset = tilemapLayer.gidMap[this.index];

                if (tileset)
                {
                    return tileset;
                }
            }

            return null;
        }

    },

    /**
     * The tilemap layer that contains this Tile. This will only return null if accessed from a
     * LayerData instance before the tile is placed within a TilemapLayer.
     *
     * @name Phaser.Tilemaps.Tile#tilemapLayer
     * @type {?Phaser.Tilemaps.TilemapLayer}
     * @readonly
     * @since 3.0.0
     */
    tilemapLayer: {

        get: function ()
        {
            return this.layer.tilemapLayer;
        }

    },

    /**
     * The tilemap that contains this Tile. This will only return null if accessed from a LayerData
     * instance before the tile is placed within a TilemapLayer.
     *
     * @name Phaser.Tilemaps.Tile#tilemap
     * @type {?Phaser.Tilemaps.Tilemap}
     * @readonly
     * @since 3.0.0
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
