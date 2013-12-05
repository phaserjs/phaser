/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Create a new `Tile` object. Tiles live inside of Tilesets and are rendered via TilemapLayers.
*
* @class Phaser.Tile
* @classdesc A Tile is a single representation of a tile within a Tilemap.
* @constructor
* @param {Phaser.Tileset} tileset - The tileset this tile belongs to.
* @param {number} index - The index of this tile type in the core map data.
* @param {number} x - The x coordinate of this tile.
* @param {number} y - The y coordinate of this tile.
* @param {number} width - Width of the tile.
* @param {number} height - Height of the tile.
*/
// Phaser.Tile = function (tileset, index, x, y, width, height) {
Phaser.Tile = function (index, x, y, width, height) {

    /**
    * @property {Phaser.Tileset} tileset - The tileset this tile belongs to.
    */
    // this.tileset = tileset;
    
    /**
    * @property {number} index - The index of this tile within the tileset.
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

    //  Any extra meta data info we need here

    /**
    * @property {number} mass - The virtual mass of the tile.
    * @default
    */
    // this.mass = 1.0;


    //  Keep track of our interesting faces
    this.faceTop = false;
    this.faceBottom = false;
    this.faceLeft = false;
    this.faceRight = false;

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
    * @property {boolean} separateX - Enable separation at x-axis. 
    * @default
    */
    // this.separateX = true;

    /**
    * @property {boolean} separateY - Enable separation at y-axis. 
    * @default
    */
    // this.separateY = true;

    /**
    * @property {boolean} collisionCallback - Tilemap collision callback.
    * @default
    */
    this.collisionCallback = null;

    /**
    * @property {boolean} collisionCallback - Tilemap collision callback.
    * @default
    */
    this.collisionCallbackContext = this;

};

Phaser.Tile.prototype = {

    /**
    * Set callback to be called when this tilemap collides.
    * 
    * @method Phaser.Tile#setCollisionCallback
    * @param {Function} callback - Callback function.
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

        this.tileset = null;
        
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

    }

};

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
