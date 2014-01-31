/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
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
    * @property {number} width - The width of the tile in pixels.
    */
    this.width = width;
    
    /**
    * @property {number} height - The height of the tile in pixels.
    */
    this.height = height;

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
    * @property {boolean} collides - Does this tile collide at all?
    */
    this.collides = false;

    /**
    * @property {boolean} collideNone - Indicating this Tile doesn't collide at all.
    * @default
    */
    this.collideNone = true;

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
    * @property {function} callback - Tile collision callback.
    * @default
    */
    this.callback = null;

    /**
    * @property {object} callbackContext - The context in which the collision callback will be called.
    * @default
    */
    this.callbackContext = this;

    this.debug = false;

};

Phaser.Tile.prototype = {

    /**
    * Set a callback to be called when this tile is hit by an object.
    * The callback must true true for collision processing to take place.
    * 
    * @method Phaser.Tile#setCollisionCallback
    * @param {function} callback - Callback function.
    * @param {object} context - Callback will be called with this context.
    */
    setCollisionCallback: function (callback, context) {

        this.collisionCallbackContext = context;
        this.collisionCallback = callback;

    },

    /**
    * Clean up memory.
    * @method Phaser.Tile#destroy
    */
    destroy: function () {

        this.collisionCallback = null;
        this.collisionCallbackContext = null;
        this.properties = null;
        
    },

    /**
    * Set collision settings on this tile.
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

        if (left || right || up || down)
        {
            this.collideNone = false;
        }
        else
        {
            this.collideNone = true;
        }

    },

    /**
    * Reset collision status flags.
    * @method Phaser.Tile#resetCollision
    */
    resetCollision: function () {

        this.collideNone = true;
        this.collideLeft = false;
        this.collideRight = false;
        this.collideUp = false;
        this.collideDown = false;

    },

    /**
    * Copies the tile data and properties from the given tile to this tile.
    * @method Phaser.Tile#copy
    * @param {Phaser.Tile} tile - The tile to copy from.
    */
    copy: function (tile) {

        this.index = tile.index;
        this.alpha = tile.alpha;
        this.properties = tile.properties;
        this.collides = tile.collides;
        this.collideNone = tile.collideNone;
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
Object.defineProperty(Phaser.Tile.prototype, "canCollide", {
    
    get: function () {
        return (this.collides || this.collisionCallback || this.layer.callbacks[this.index]);
    }

});

/**
* @name Phaser.Tile#left
* @property {number} left - The x value.
* @readonly
*/
Object.defineProperty(Phaser.Tile.prototype, "left", {
    
    get: function () {
        return this.x;
    }

});

/**
* @name Phaser.Tile#right
* @property {number} right - The sum of the x and width properties.
* @readonly
*/
Object.defineProperty(Phaser.Tile.prototype, "right", {
    
    get: function () {
        return this.x + this.width;
    }

});

/**
* @name Phaser.Tile#top
* @property {number} top - The y value.
* @readonly
*/
Object.defineProperty(Phaser.Tile.prototype, "top", {
    
    get: function () {
        return this.y;
    }

});

/**
* @name Phaser.Tile#bottom
* @property {number} bottom - The sum of the y and height properties.
* @readonly
*/
Object.defineProperty(Phaser.Tile.prototype, "bottom", {
    
    get: function () {
        return this.y + this.height;
    }

});
