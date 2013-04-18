/// <reference path="../Game.ts" />

/**
 * A simple helper object for <code>Tilemap</code> that helps expand collision opportunities and control.
 * You can use <code>Tilemap.setTileProperties()</code> to alter the collision properties and
 * callback functions and filters for this object to do things like one-way tiles or whatever.
 * 
 * @author	Adam Atomic
 * @author	Richard Davey
 */

/**
*   Phaser
*/

module Phaser {

    export class Tile extends GameObject {

        /**
         * Instantiate this new tile object.  This is usually called from <code>Tilemap.loadMap()</code>.
         * 
         * @param Tilemap			A reference to the tilemap object creating the tile.
         * @param Index				The actual core map data index for this tile type.
         * @param Width				The width of the tile.
         * @param Height			The height of the tile.
         * @param Visible			Whether the tile is visible or not.
         * @param AllowCollisions	The collision flags for the object.  By default this value is ANY or NONE depending on the parameters sent to loadMap().
         */
        constructor(game: Game, Tilemap: Tilemap, Index: number, Width: number, Height: number, Visible: bool, AllowCollisions: number) {

            super(game, 0, 0, Width, Height);

            this.immovable = true;
            this.moves = false;
            this.callback = null;
            this.filter = null;

            this.tilemap = Tilemap;
            this.index = Index;
            this.visible = Visible;
            this.allowCollisions = AllowCollisions;

            this.mapIndex = 0;

        }

        /**
         * This function is called whenever an object hits a tile of this type.
         * This function should take the form <code>myFunction(Tile:Tile,Object:Object)</code>.
         * Defaults to null, set through <code>Tilemap.setTileProperties()</code>.
         */
        public callback;

        /**
         * Each tile can store its own filter class for their callback functions.
         * That is, the callback will only be triggered if an object with a class
         * type matching the filter touched it.
         * Defaults to null, set through <code>Tilemap.setTileProperties()</code>.
         */
        public filter;

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
         * The current map index of this tile object at this moment.
         * You can think of tile objects as moving around the tilemap helping with collisions.
         * This value is only reliable and useful if used from the callback function.
         */
        public mapIndex: number;

        /**
         * Clean up memory.
         */
        public destroy() {

            super.destroy();
            this.callback = null;
            this.tilemap = null;

        }

    }

}