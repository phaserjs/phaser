/**
* Phaser - Tile
*
* A Tile is a single representation of a tile within a Tilemap
*/

/**
* Tile constructor
* Create a new <code>Tile</code>.
*
* @param tilemap {Tilemap} the tilemap this tile belongs to.
* @param index {number} The index of this tile type in the core map data.
* @param width {number} Width of the tile.
* @param height number} Height of the tile.
*/
Phaser.Tile = function (game, tilemap, index, width, height) {

    /**
    * The virtual mass of the tile.
    * @type {number}
    */
    this.mass = 1.0;

    /**
    * Indicating this Tile doesn't collide at all.
    * @type {bool}
    */
    this.collideNone = true;

    /**
    * Indicating collide with any object on the left.
    * @type {bool}
    */
    this.collideLeft = false;

    /**
    * Indicating collide with any object on the right.
    * @type {bool}
    */
    this.collideRight = false;

    /**
    * Indicating collide with any object on the top.
    * @type {bool}
    */
    this.collideUp = false;

    /**
    * Indicating collide with any object on the bottom.
    * @type {bool}
    */
    this.collideDown = false;

    /**
    * Enable separation at x-axis.
    * @type {bool}
    */
    this.separateX = true;

    /**
    * Enable separation at y-axis.
    * @type {bool}
    */
    this.separateY = true;

    this.game = game;
    this.tilemap = tilemap;
    this.index = index;
    this.width = width;
    this.height = height;

};

Phaser.Tile.prototype = {

	/**
    * Clean up memory.
    */
    destroy: function () {
        this.tilemap = null;
    },

	/**
    * Set collision configs.
    * @param collision {number} Bit field of flags. (see Tile.allowCollision)
    * @param resetCollisions {bool} Reset collision flags before set.
    * @param separateX {bool} Enable seprate at x-axis.
    * @param separateY {bool} Enable seprate at y-axis.
    */
    setCollision: function (left, right, up, down, reset, separateX, separateY) {

        if (reset)
        {
            this.resetCollision();
        }

        this.separateX = separateX;
        this.separateY = separateY;

        this.collideNone = true;
        this.collideLeft = left;
        this.collideRight = right;
        this.collideUp = up;
        this.collideDown = down;

        if (left || right || up || down)
        {
            this.collideNone = false;
        }

    },

	/**
    * Reset collision status flags.
    */
    resetCollision: function () {

        this.collideNone = true;
        this.collideLeft = false;
        this.collideRight = false;
        this.collideUp = false;
        this.collideDown = false;

    },

	/**
    * Returns a string representation of this object.
    * @method toString
    * @return {string} a string representation of the object.
    **/
    toString: function () {

        // return "[{Tile (index=" + this.index + " collisions=" + this.allowCollisions + " width=" + this.width + " height=" + this.height + ")}]";
        return '';

    }

};