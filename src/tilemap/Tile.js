/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Create a new `Tile` object.
*
* @class Phaser.Tile
* @classdesc A Tile is a representation of a single tile within the Tilemap.
* @constructor
* @param {object} layer - The layer in the Tilemap data that this tile belongs to.
* @param {number} index - The index of this tile type in the core map data.
* @param {number} x - The x coordinate of this tile.
* @param {number} y - The y coordinate of this tile.
* @param {number} width - Width of the tile.
* @param {number} height - Height of the tile.
*/
Phaser.Tile = function (layer, index, x, y, width, height) {

    /**
    * @property {object} layer - The layer in the Tilemap data that this tile belongs to.
    */
    this.layer = layer;

    /**
    * @property {number} index - The index of this tile within the map data corresponding to the tileset.
    */
    this.index = index;

    /**
    * @property {number} x - The x map coordinate of this tile.
    */
    this.x = x;

    /**
    * @property {number} y - The y map coordinate of this tile.
    */
    this.y = y;

    /**
    * @property {number} x - The x map coordinate of this tile.
    */
    this.worldX = x * width;

    /**
    * @property {number} y - The y map coordinate of this tile.
    */
    this.worldY = y * height;

    /**
    * @property {number} width - The width of the tile in pixels.
    */
    this.width = width;

    /**
    * @property {number} height - The height of the tile in pixels.
    */
    this.height = height;

    /**
    * @property {number} width - The width of the tile in pixels.
    */
    this.centerX = Math.abs(width / 2);

    /**
    * @property {number} height - The height of the tile in pixels.
    */
    this.centerY = Math.abs(height / 2);

    /**
    * @property {number} alpha - The alpha value at which this tile is drawn to the canvas.
    */
    this.alpha = 1;

    /**
    * @property {object} properties - Tile specific properties.
    */
    this.properties = {};

    /**
    * @property {boolean} scanned - Has this tile been walked / turned into a poly?
    */
    this.scanned = false;

    /**
    * @property {boolean} faceTop - Is the top of this tile an interesting edge?
    */
    this.faceTop = false;

    /**
    * @property {boolean} faceBottom - Is the bottom of this tile an interesting edge?
    */
    this.faceBottom = false;

    /**
    * @property {boolean} faceLeft - Is the left of this tile an interesting edge?
    */
    this.faceLeft = false;

    /**
    * @property {boolean} faceRight - Is the right of this tile an interesting edge?
    */
    this.faceRight = false;

    /**
    * @property {boolean} collideLeft - Indicating collide with any object on the left.
    * @default
    */
    this.collideLeft = false;

    /**
    * @property {boolean} collideRight - Indicating collide with any object on the right.
    * @default
    */
    this.collideRight = false;

    /**
    * @property {boolean} collideUp - Indicating collide with any object on the top.
    * @default
    */
    this.collideUp = false;

    /**
    * @property {boolean} collideDown - Indicating collide with any object on the bottom.
    * @default
    */
    this.collideDown = false;

    /**
    * @property {function} collisionCallback - Tile collision callback.
    * @default
    */
    this.collisionCallback = null;

    /**
    * @property {object} collisionCallbackContext - The context in which the collision callback will be called.
    * @default
    */
    this.collisionCallbackContext = this;

};

Phaser.Tile.prototype = {

    /**
    * Check if the given x and y world coordinates are within this Tile.
    *
    * @method Phaser.Tile#containsPoint
    * @param {number} x - The x coordinate to test.
    * @param {number} y - The y coordinate to test.
    * @return {boolean} True if the coordinates are within this Tile, otherwise false.
    */
    containsPoint: function (x, y) {

        return !(x < this.worldX || y < this.worldY || x > this.right || y > this.bottom);

    },

    /**
    * Check for intersection with this tile.
    *
    * @method Phaser.Tile#intersects
    * @param {number} x - The x axis in pixels.
    * @param {number} y - The y axis in pixels.
    * @param {number} right - The right point.
    * @param {number} bottom - The bottom point.
    */
    intersects: function (x, y, right, bottom) {

        if (right <= this.worldX)
        {
            return false;
        }

        if (bottom <= this.worldY)
        {
            return false;
        }

        if (x >= this.worldX + this.width)
        {
            return false;
        }

        if (y >= this.worldY + this.height)
        {
            return false;
        }

        return true;

    },

    /**
    * Set a callback to be called when this tile is hit by an object.
    * The callback must true true for collision processing to take place.
    *
    * @method Phaser.Tile#setCollisionCallback
    * @param {function} callback - Callback function.
    * @param {object} context - Callback will be called within this context.
    */
    setCollisionCallback: function (callback, context) {

        this.collisionCallback = callback;
        this.collisionCallbackContext = context;

    },

    /**
    * Clean up memory.
    *
    * @method Phaser.Tile#destroy
    */
    destroy: function () {

        this.collisionCallback = null;
        this.collisionCallbackContext = null;
        this.properties = null;

    },

    /**
    * Set collision settings on this tile.
    *
    * @method Phaser.Tile#setCollision
    * @param {boolean} left - Indicating collide with any object on the left.
    * @param {boolean} right - Indicating collide with any object on the right.
    * @param {boolean} up - Indicating collide with any object on the top.
    * @param {boolean} down - Indicating collide with any object on the bottom.
    */
    setCollision: function (left, right, up, down) {

        this.collideLeft = left;
        this.collideRight = right;
        this.collideUp = up;
        this.collideDown = down;

    },

    /**
    * Reset collision status flags.
    *
    * @method Phaser.Tile#resetCollision
    */
    resetCollision: function () {

        this.collideLeft = false;
        this.collideRight = false;
        this.collideUp = false;
        this.collideDown = false;

        this.faceTop = false;
        this.faceBottom = false;
        this.faceLeft = false;
        this.faceRight = false;

    },

    /**
    * Is this tile interesting?
    *
    * @method Phaser.Tile#isInteresting
    * @param {boolean} collides - If true will check any collides value.
    * @param {boolean} faces - If true will check any face value.
    * @return {boolean} True if the Tile is interesting, otherwise false.
    */
    isInteresting: function (collides, faces) {

        if (collides && faces)
        {
            //  Does this tile have any collide flags OR interesting face?
            return (this.collideLeft || this.collideRight || this.collideUp || this.collideDown || this.faceTop || this.faceBottom || this.faceLeft || this.faceRight || this.collisionCallback);
        }
        else if (collides)
        {
            //  Does this tile collide?
            return (this.collideLeft || this.collideRight || this.collideUp || this.collideDown);
        }
        else if (faces)
        {
            //  Does this tile have an interesting face?
            return (this.faceTop || this.faceBottom || this.faceLeft || this.faceRight);
        }

        return false;

    },

    /**
    * Copies the tile data and properties from the given tile to this tile.
    *
    * @method Phaser.Tile#copy
    * @param {Phaser.Tile} tile - The tile to copy from.
    */
    copy: function (tile) {

        this.index = tile.index;
        this.alpha = tile.alpha;
        this.properties = tile.properties;

        this.collideUp = tile.collideUp;
        this.collideDown = tile.collideDown;
        this.collideLeft = tile.collideLeft;
        this.collideRight = tile.collideRight;

        this.collisionCallback = tile.collisionCallback;
        this.collisionCallbackContext = tile.collisionCallbackContext;

    }

};

Phaser.Tile.prototype.constructor = Phaser.Tile;

/**
* @name Phaser.Tile#canCollide
* @property {boolean} canCollide - True if this tile can collide or has a collision callback.
* @readonly
*/
Object.defineProperty(Phaser.Tile.prototype, "collides", {

    get: function () {
        return (this.collideLeft || this.collideRight || this.collideUp || this.collideDown);
    }

});

/**
* @name Phaser.Tile#canCollide
* @property {boolean} canCollide - True if this tile can collide or has a collision callback.
* @readonly
*/
Object.defineProperty(Phaser.Tile.prototype, "canCollide", {

    get: function () {
        return (this.collideLeft || this.collideRight || this.collideUp || this.collideDown || this.collisionCallback);
    }

});

/**
* @name Phaser.Tile#left
* @property {number} left - The x value in pixels.
* @readonly
*/
Object.defineProperty(Phaser.Tile.prototype, "left", {

    get: function () {
        return this.worldX;
    }

});

/**
* @name Phaser.Tile#right
* @property {number} right - The sum of the x and width properties.
* @readonly
*/
Object.defineProperty(Phaser.Tile.prototype, "right", {

    get: function () {
        return this.worldX + this.width;
    }

});

/**
* @name Phaser.Tile#top
* @property {number} top - The y value.
* @readonly
*/
Object.defineProperty(Phaser.Tile.prototype, "top", {

    get: function () {
        return this.worldY;
    }

});

/**
* @name Phaser.Tile#bottom
* @property {number} bottom - The sum of the y and height properties.
* @readonly
*/
Object.defineProperty(Phaser.Tile.prototype, "bottom", {

    get: function () {
        return this.worldY + this.height;
    }

});
