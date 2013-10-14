/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
* @module       Phaser.Tile
*/


/**
* Create a new <code>Tile</code>.
*
* @class Phaser.Tile
* @classdesc A Tile is a single representation of a tile within a Tilemap.
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {Tilemap} tilemap - The tilemap this tile belongs to.
* @param {number}  index - The index of this tile type in the core map data.
* @param {number}  width - Width of the tile.
* @param {number}  height - Height of the tile.
*/
Phaser.Tile = function (tileset, index, x, y, width, height) {

    /**
    * @property {string} tileset - The tileset this tile belongs to.
    */
    this.tileset = tileset;
    
    /**
    * @property {number} index - The index of this tile within the tileset.
    */
    this.index = index;
    
    /**
    * @property {number} width - The width of the tile in pixels.
    */
    this.width = width;
    
    /**
    * @property {number} height - The height of the tile in pixels.
    */
    this.height = height;

    /**
    * @property {number} x - The top-left corner of the tile within the tileset.
    */
    this.x = x;
    
    /**
    * @property {number} y - The top-left corner of the tile within the tileset.
    */
    this.y = y;

    //  Any extra meta data info we need here

    /**
    * @property {number} mass - The virtual mass of the tile.
    * @default
    */
    this.mass = 1.0;

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
    this.separateX = true;

    /**
    * @property {boolean} separateY - Enable separation at y-axis. 
    * @default
    */
    this.separateY = true;

};

Phaser.Tile.prototype = {

    /**
    * Clean up memory.
    * @method destroy
    */
    destroy: function () {

        this.tileset = null;
        
    },

    /**
    * Set collision configs.
    * @method setCollision
    * @param {boolean}   left - Indicating collide with any object on the left.
    * @param {boolean}   right - Indicating collide with any object on the right.
    * @param {boolean}   up - Indicating collide with any object on the top.
    * @param {boolean}   down - Indicating collide with any object on the bottom.
    * @param {boolean}   reset - Description. 
    * @param {boolean}   separateX - Separate at x-axis.
    * @param {boolean}   separateY - Separate at y-axis.
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
    * @method resetCollision
    */
    resetCollision: function () {

        this.collideNone = true;
        this.collideLeft = false;
        this.collideRight = false;
        this.collideUp = false;
        this.collideDown = false;

    }

};

Object.defineProperty(Phaser.Tile.prototype, "bottom", {
    
    /**
    * The sum of the y and height properties. Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
    * @method bottom
    * @return {number}
    **/
    get: function () {
        return this.y + this.height;
    }

});

Object.defineProperty(Phaser.Tile.prototype, "right", {
    
    /**
    * The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties.
    * However it does affect the width property.
    * @method right
    * @return {number}
    **/    
    get: function () {
        return this.x + this.width;
    }

});
