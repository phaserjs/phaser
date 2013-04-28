/// <reference path="../Game.ts" />

/**
* Phaser - Tile
*
* A Tile is a single representation of a tile within a Tilemap
*/

module Phaser {

    export class Tile {

        constructor(game: Game, tilemap: Tilemap, index: number, width: number, height: number) {

            this._game = game;
            this.tilemap = tilemap;
            this.index = index;

            this.width = width;
            this.height = height;
            this.allowCollisions = Collision.NONE;

        }

        private _game: Game;

        //  You can give this Tile a friendly name to help with debugging. Never used internally.
        public name: string;

        public width: number;

        public height: number;

        public allowCollisions: number;

        /**
         * A reference to the tilemap this tile object belongs to.
         */
        public tilemap: Tilemap;

        /**
         * The index of this tile type in the core map data.
         * For example, if your map only has 16 kinds of tiles in it,
         * this number is usually between 0 and 15.
         */
        public index: number;

        /**
         * Clean up memory.
         */
        public destroy() {

            this.tilemap = null;

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