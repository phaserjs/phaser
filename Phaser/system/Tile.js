/// <reference path="../Game.ts" />
/**
* Phaser - Tile
*
* A Tile is a single representation of a tile within a Tilemap
*/
var Phaser;
(function (Phaser) {
    var Tile = (function () {
        /**
        * Tile constructor
        * Create a new <code>Tile</code>.
        *
        * @param tilemap {Tilemap} the tilemap this tile belongs to.
        * @param index {number} The index of this tile type in the core map data.
        * @param width {number} Width of the tile.
        * @param height number} Height of the tile.
        */
        function Tile(game, tilemap, index, width, height) {
            /**
            * The virtual mass of the tile.
            * @type {number}
            */
            this.mass = 1.0;
            /**
            * Indicating collide with any object on the left.
            * @type {boolean}
            */
            this.collideLeft = false;
            /**
            * Indicating collide with any object on the right.
            * @type {boolean}
            */
            this.collideRight = false;
            /**
            * Indicating collide with any object on the top.
            * @type {boolean}
            */
            this.collideUp = false;
            /**
            * Indicating collide with any object on the bottom.
            * @type {boolean}
            */
            this.collideDown = false;
            /**
            * Enable separation at x-axis.
            * @type {boolean}
            */
            this.separateX = true;
            /**
            * Enable separation at y-axis.
            * @type {boolean}
            */
            this.separateY = true;
            this._game = game;
            this.tilemap = tilemap;
            this.index = index;
            this.width = width;
            this.height = height;
            this.allowCollisions = Collision.NONE;
        }
        Tile.prototype.destroy = /**
        * Clean up memory.
        */
        function () {
            this.tilemap = null;
        };
        Tile.prototype.setCollision = /**
        * Set collision configs.
        * @param collision {number} Bit field of flags. (see Tile.allowCollision)
        * @param resetCollisions {boolean} Reset collision flags before set.
        * @param separateX {boolean} Enable seprate at x-axis.
        * @param separateY {boolean} Enable seprate at y-axis.
        */
        function (collision, resetCollisions, separateX, separateY) {
            if(resetCollisions) {
                this.resetCollision();
            }
            this.separateX = separateX;
            this.separateY = separateY;
            this.allowCollisions = collision;
            if(collision & Phaser.Collision.ANY) {
                this.collideLeft = true;
                this.collideRight = true;
                this.collideUp = true;
                this.collideDown = true;
                return;
            }
            if(collision & Phaser.Collision.LEFT || collision & Phaser.Collision.WALL) {
                this.collideLeft = true;
            }
            if(collision & Phaser.Collision.RIGHT || collision & Phaser.Collision.WALL) {
                this.collideRight = true;
            }
            if(collision & Phaser.Collision.UP || collision & Phaser.Collision.CEILING) {
                this.collideUp = true;
            }
            if(collision & Phaser.Collision.DOWN || collision & Phaser.Collision.CEILING) {
                this.collideDown = true;
            }
        };
        Tile.prototype.resetCollision = /**
        * Reset collision status flags.
        */
        function () {
            this.allowCollisions = Phaser.Collision.NONE;
            this.collideLeft = false;
            this.collideRight = false;
            this.collideUp = false;
            this.collideDown = false;
        };
        Tile.prototype.toString = /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the object.
        **/
        function () {
            return "[{Tiled (index=" + this.index + " collisions=" + this.allowCollisions + " width=" + this.width + " height=" + this.height + ")}]";
        };
        return Tile;
    })();
    Phaser.Tile = Tile;    
})(Phaser || (Phaser = {}));
