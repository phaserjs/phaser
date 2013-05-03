/// <reference path="../Game.ts" />

/**
* Phaser - Tile
*
* A Tile is a single representation of a tile within a Tilemap
*/

module Phaser {

    export class Tile {

        /**
         * Tile constructor
         * Create a new <code>Tile</code>.
         *
         * @param tilemap   the tilemap this tile belongs to.
         * @param index     The index of this tile type in the core map data.
         * @param width     Width of the tile.
         * @param height    Height of the tile.
         */
        constructor(game: Game, tilemap: Tilemap, index: number, width: number, height: number) {

            this._game = game;
            this.tilemap = tilemap;
            this.index = index;

            this.width = width;
            this.height = height;
            this.allowCollisions = Collision.NONE;

        }

        /**
         * Local private reference to game.
         */
        private _game: Game;

        /**
         * You can give this Tile a friendly name to help with debugging. Never used internally.
         * @type {string}
         */
        public name: string;

        /**
         * The virtual mass of the tile.
         * @type {number}
         */
        public mass: number = 1.0;
        /**
         * Tile width.
         * @type {number}
         */
        public width: number;
        /**
         * Tile height.
         * @type {number}
         */
        public height: number;

        /**
         * Bit field of flags (use with UP, DOWN, LEFT, RIGHT, etc) indicating collision directions.
         * @type {number}
         */
        public allowCollisions: number;

        /**
         * Indicating collide with any object on the left.
         * @type {boolean}
         */
        public collideLeft: bool = false;
        /**
         * Indicating collide with any object on the right.
         * @type {boolean}
         */
        public collideRight: bool = false;
        /**
         * Indicating collide with any object on the top.
         * @type {boolean}
         */
        public collideUp: bool = false;
        /**
         * Indicating collide with any object on the bottom.
         * @type {boolean}
         */
        public collideDown: bool = false;

        /**
         * Enable separation at x-axis.
         * @type {boolean}
         */
        public separateX: bool = true;
        /**
         * Enable separation at y-axis.
         * @type {boolean}
         */
        public separateY: bool = true;

        /**
         * A reference to the tilemap this tile object belongs to.
         * @type {Tilemap}
         */
        public tilemap: Tilemap;

        /**
         * The index of this tile type in the core map data.
         * For example, if your map only has 16 kinds of tiles in it,
         * this number is usually between 0 and 15.
         * @type {number}
         */
        public index: number;

        /**
         * Clean up memory.
         */
        public destroy() {

            this.tilemap = null;

        }

        /**
         * Set collision configs.
         * @param   collision       Bit field of flags. (see Tile.allowCollision)
         * @param   resetCollisions Reset collision flags before set.
         * @param   separateX       Enable seprate at x-axis.
         * @param   separateY       Enable seprate at y-axis.
         */
        public setCollision(collision: number, resetCollisions: bool, separateX: bool, separateY: bool) {

            if (resetCollisions)
            {
                this.resetCollision();
            }

            this.separateX = separateX;
            this.separateY = separateY;

            this.allowCollisions = collision;

            if (collision & Collision.ANY)
            {
                this.collideLeft = true;
                this.collideRight = true;
                this.collideUp = true;
                this.collideDown = true;
                return;
            }

            if (collision & Collision.LEFT || collision & Collision.WALL)
            {
                this.collideLeft = true;
            }

            if (collision & Collision.RIGHT || collision & Collision.WALL)
            {
                this.collideRight = true;
            }

            if (collision & Collision.UP || collision & Collision.CEILING)
            {
                this.collideUp = true;
            }

            if (collision & Collision.DOWN || collision & Collision.CEILING)
            {
                this.collideDown = true;
            }

        }

        /**
         * Reset collision status flags.
         */
        public resetCollision() {

            this.allowCollisions = Collision.NONE;
            this.collideLeft = false;
            this.collideRight = false;
            this.collideUp = false;
            this.collideDown = false;

        }

        /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the object.
        **/
        public toString(): string {

            return "[{Tiled (index=" + this.index + " collisions=" + this.allowCollisions + " width=" + this.width + " height=" + this.height + ")}]";

        }

    }

}