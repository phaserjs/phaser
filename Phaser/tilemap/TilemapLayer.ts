/// <reference path="../Game.ts" />
/// <reference path="Tilemap.ts" />
/// <reference path="../gameobjects/IGameObject.ts" />

/**
* Phaser - TilemapLayer
*
* A Tilemap Layer. Tiled format maps can have multiple overlapping layers.
*/

module Phaser {

    export class TilemapLayer {

        /**
         * TilemapLayer constructor
         * Create a new <code>TilemapLayer</code>.
         *
         * @param parent {Tilemap} The tilemap that contains this layer.
         * @param id {number} The ID of this layer within the Tilemap array.
         * @param key {string} Asset key for this map.
         * @param mapFormat {number} Format of this map data, available: Tilemap.FORMAT_CSV or Tilemap.FORMAT_TILED_JSON.
         * @param name {string} Name of this layer, so you can get this layer by its name.
         * @param tileWidth {number} Width of tiles in this map.
         * @param tileHeight {number} Height of tiles in this map.
         */
        constructor(parent:Tilemap, id:number, key: string, mapFormat: number, name: string, tileWidth: number, tileHeight: number) {

            this.parent = parent;
            this.game = parent.game;

            this.ID = id;
            this.name = name;
            this.mapFormat = mapFormat;
            this.tileWidth = tileWidth;
            this.tileHeight = tileHeight;
            this.boundsInTiles = new Rectangle();

            this.texture = new Phaser.Display.Texture(this);
            this.transform = new Phaser.Components.TransformManager(this);

            if (key !== null)
            {
                this.texture.loadImage(key, false);
            }
            else
            {
                this.texture.opaque = true;
            }

            //  Handy proxies
            this.alpha = this.texture.alpha;

            this.mapData = [];
            this._tempTileBlock = [];

        }

        //  Private vars to help avoid gc spikes
        private _tempTileX: number;
        private _tempTileY: number;
        private _tempTileW: number;
        private _tempTileH: number;
        private _tempTileBlock;
        private _tempBlockResults;

        /**
         * Local reference to Game.
         */
        public game: Game;

        /**
         * The tilemap that contains this layer.
         * @type {Tilemap}
         */
        public parent: Tilemap;

        /**
         * The texture used to render the Sprite.
         */
        public texture: Phaser.Display.Texture;

        /**
         * The Sprite transform component.
         */
        public transform: Phaser.Components.TransformManager;

        public tileOffsets;

        /**
        * The alpha of the Sprite between 0 and 1, a value of 1 being fully opaque.
        */
        public alpha: number;

        /**
         * Name of this layer, so you can get this layer by its name.
         * @type {string}
         */
        public name: string;

        /**
         * The ID of the layer within the Tilemap.
         * @type {number}
         */
        public ID: number;

        /**
         * Controls whether update() and draw() are automatically called.
         * @type {boolean}
         */
        public exists: boolean = true;

        /**
         * Controls whether draw() are automatically called.
         * @type {boolean}
         */
        public visible: boolean = true;

        /**
         * Properties of this map layer. (normally set by map editors)
         */
        public properties: {};

        /**
         * Map data in a 2d array, its element is a index number for that tile.
         * @type {number[][]}
         */
        public mapData;

        /**
         * Format of this map data, available: Tilemap.FORMAT_CSV or Tilemap.FORMAT_TILED_JSON.
         */
        public mapFormat: number;

        /**
         * Map bounds (width and height) in tiles not pixels.
         * @type {Rectangle}
         */
        public boundsInTiles: Rectangle;

        /**
         * Width of each tile.
         * @type {number}
         */
        public tileWidth: number;

        /**
         * Height of a single tile.
         * @type {number}
         */
        public tileHeight: number;

        /**
         * How many tiles in each row.
         * Read-only variable, do NOT recommend changing after the map is loaded!
         * @type {number}
         */
        public widthInTiles: number = 0;

        /**
         * How many tiles in each column.
         * Read-only variable, do NOT recommend changing after the map is loaded!
         * @type {number}
         */
        public heightInTiles: number = 0;

        /**
         * Read-only variable, do NOT recommend changing after the map is loaded!
         * @type {number}
         */
        public widthInPixels: number = 0;

        /**
         * Read-only variable, do NOT recommend changing after the map is loaded!
         * @type {number}
         */
        public heightInPixels: number = 0;

        /**
         * Distance between REAL tiles to the tileset texture bound.
         * @type {number}
         */
        public tileMargin: number = 0;

        /**
         * Distance between every 2 neighbor tile in the tileset texture.
         * @type {number}
         */
        public tileSpacing: number = 0;

        /**
         * Set a specific tile with its x and y in tiles.
         * @param x {number} X position of this tile in world coordinates.
         * @param y {number} Y position of this tile in world coordinates.
         * @param index {number} The index of this tile type in the core map data.
         */
        public putTileWorldXY(x: number, y: number, index: number) {

            x = this.game.math.snapToFloor(x, this.tileWidth) / this.tileWidth;
            y = this.game.math.snapToFloor(y, this.tileHeight) / this.tileHeight;

            if (y >= 0 && y < this.mapData.length)
            {
                if (x >= 0 && x < this.mapData[y].length)
                {
                    this.mapData[y][x] = index;
                }
            }

        }

        /**
         * Set a specific tile with its x and y in tiles.
         * @param x {number} X position of this tile.
         * @param y {number} Y position of this tile.
         * @param index {number} The index of this tile type in the core map data.
         */
        public putTile(x: number, y: number, index: number) {

            if (y >= 0 && y < this.mapData.length)
            {
                if (x >= 0 && x < this.mapData[y].length)
                {
                    this.mapData[y][x] = index;
                }
            }

        }

        /**
         * Swap tiles with 2 kinds of indexes.
         * @param tileA {number} First tile index.
         * @param tileB {number} Second tile index.
         * @param [x] {number} specify a Rectangle of tiles to operate. The x position in tiles of Rectangle's left-top corner.
         * @param [y] {number} specify a Rectangle of tiles to operate. The y position in tiles of Rectangle's left-top corner.
         * @param [width] {number} specify a Rectangle of tiles to operate. The width in tiles.
         * @param [height] {number} specify a Rectangle of tiles to operate. The height in tiles.
         */
        public swapTile(tileA: number, tileB: number, x: number = 0, y: number = 0, width: number = this.widthInTiles, height: number = this.heightInTiles) {

            this.getTempBlock(x, y, width, height);

            for (var r = 0; r < this._tempTileBlock.length; r++)
            {
                //  First sweep marking tileA as needing a new index
                if (this._tempTileBlock[r].tile.index == tileA)
                {
                    this._tempTileBlock[r].newIndex = true;
                }

                //  In the same pass we can swap tileB to tileA
                if (this._tempTileBlock[r].tile.index == tileB)
                {
                    this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = tileA;
                }
            }

            for (var r = 0; r < this._tempTileBlock.length; r++)
            {
                //  And now swap our newIndex tiles for tileB
                if (this._tempTileBlock[r].newIndex == true)
                {
                    this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = tileB;
                }
            }

        }

        /**
         * Fill a tile block with a specific tile index.
         * @param index {number} Index of tiles you want to fill with.
         * @param [x] {number} x position (in tiles) of block's left-top corner.
         * @param [y] {number} y position (in tiles) of block's left-top corner.
         * @param [width] {number} width of block.
         * @param [height] {number} height of block.
         */
        public fillTile(index: number, x: number = 0, y: number = 0, width: number = this.widthInTiles, height: number = this.heightInTiles) {

            this.getTempBlock(x, y, width, height);

            for (var r = 0; r < this._tempTileBlock.length; r++)
            {
                this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = index;
            }

        }

        /**
         * Set random tiles to a specific tile block.
         * @param tiles {number[]} Tiles with indexes in this array will be randomly set to the given block.
         * @param [x] {number} x position (in tiles) of block's left-top corner.
         * @param [y] {number} y position (in tiles) of block's left-top corner.
         * @param [width] {number} width of block.
         * @param [height] {number} height of block.
         */
        public randomiseTiles(tiles: number[], x: number = 0, y: number = 0, width: number = this.widthInTiles, height: number = this.heightInTiles) {

            this.getTempBlock(x, y, width, height);

            for (var r = 0; r < this._tempTileBlock.length; r++)
            {
                this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = this.game.math.getRandom(tiles);
            }

        }

        /**
         * Replace one kind of tiles to another kind.
         * @param tileA {number} Index of tiles you want to replace.
         * @param tileB {number} Index of tiles you want to set.
         * @param [x] {number} x position (in tiles) of block's left-top corner.
         * @param [y] {number} y position (in tiles) of block's left-top corner.
         * @param [width] {number} width of block.
         * @param [height] {number} height of block.
         */
        public replaceTile(tileA: number, tileB: number, x: number = 0, y: number = 0, width: number = this.widthInTiles, height: number = this.heightInTiles) {

            this.getTempBlock(x, y, width, height);

            for (var r = 0; r < this._tempTileBlock.length; r++)
            {
                if (this._tempTileBlock[r].tile.index == tileA)
                {
                    this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = tileB;
                }
            }

        }

        /**
         * Get a tile block with specific position and size.(both are in tiles)
         * @param x {number} X position of block's left-top corner.
         * @param y {number} Y position of block's left-top corner.
         * @param width {number} Width of block.
         * @param height {number} Height of block.
         */
        public getTileBlock(x: number, y: number, width: number, height: number) {

            var output = [];

            this.getTempBlock(x, y, width, height);

            for (var r = 0; r < this._tempTileBlock.length; r++)
            {
                output.push({ x: this._tempTileBlock[r].x, y: this._tempTileBlock[r].y, tile: this._tempTileBlock[r].tile });
            }

            return output;

        }

        /**
         * Get a tile with specific position (in world coordinate). (thus you give a position of a point which is within the tile)
         * @param x {number} X position of the point in target tile.
         * @param x {number} Y position of the point in target tile.
         */
        public getTileFromWorldXY(x: number, y: number): number {

            x = this.game.math.snapToFloor(x, this.tileWidth) / this.tileWidth;
            y = this.game.math.snapToFloor(y, this.tileHeight) / this.tileHeight;

            return this.getTileIndex(x, y);

        }

        /**
         * Get tiles overlaps the given object.
         * @param object {GameObject} Tiles you want to get that overlaps this.
         * @return {array} Array with tiles informations. (Each contains x, y and the tile.)
         */
        public getTileOverlaps(object: Sprite) {

            //  If the object is outside of the world coordinates then abort the check (tilemap has to exist within world bounds)
            if (object.body.bounds.x < 0 || object.body.bounds.x > this.widthInPixels || object.body.bounds.y < 0 || object.body.bounds.bottom > this.heightInPixels)
            {
                return;
            }

            //  What tiles do we need to check against?
            this._tempTileX = this.game.math.snapToFloor(object.body.bounds.x, this.tileWidth) / this.tileWidth;
            this._tempTileY = this.game.math.snapToFloor(object.body.bounds.y, this.tileHeight) / this.tileHeight;
            this._tempTileW = (this.game.math.snapToCeil(object.body.bounds.width, this.tileWidth) + this.tileWidth) / this.tileWidth;
            this._tempTileH = (this.game.math.snapToCeil(object.body.bounds.height, this.tileHeight) + this.tileHeight) / this.tileHeight;

            //  Loop through the tiles we've got and check overlaps accordingly (the results are stored in this._tempTileBlock)

            this._tempBlockResults = [];
            this.getTempBlock(this._tempTileX, this._tempTileY, this._tempTileW, this._tempTileH, true);

            /*
            for (var r = 0; r < this._tempTileBlock.length; r++)
            {
                if (this.game.world.physics.separateTile(object, this._tempTileBlock[r].x * this.tileWidth, this._tempTileBlock[r].y * this.tileHeight, this.tileWidth, this.tileHeight, this._tempTileBlock[r].tile.mass, this._tempTileBlock[r].tile.collideLeft, this._tempTileBlock[r].tile.collideRight, this._tempTileBlock[r].tile.collideUp, this._tempTileBlock[r].tile.collideDown, this._tempTileBlock[r].tile.separateX, this._tempTileBlock[r].tile.separateY) == true)
                {
                    this._tempBlockResults.push({ x: this._tempTileBlock[r].x, y: this._tempTileBlock[r].y, tile: this._tempTileBlock[r].tile });
                }
            }
            */

            return this._tempBlockResults;

        }

        /**
         * Get a tile block with its position and size. (This method does not return, it'll set result to _tempTileBlock)
         * @param x {number} X position of block's left-top corner.
         * @param y {number} Y position of block's left-top corner.
         * @param width {number} Width of block.
         * @param height {number} Height of block.
         * @param collisionOnly {boolean} Whethor or not ONLY return tiles which will collide (its allowCollisions value is not Collision.NONE).
         */
        private getTempBlock(x: number, y: number, width: number, height: number, collisionOnly: boolean = false) {

            if (x < 0)
            {
                x = 0;
            }

            if (y < 0)
            {
                y = 0;
            }

            if (width > this.widthInTiles)
            {
                width = this.widthInTiles;
            }

            if (height > this.heightInTiles)
            {
                height = this.heightInTiles;
            }

            this._tempTileBlock = [];

            for (var ty = y; ty < y + height; ty++)
            {
                for (var tx = x; tx < x + width; tx++)
                {
                    if (collisionOnly)
                    {
                        //  We only want to consider the tile for checking if you can actually collide with it
                        if (this.mapData[ty] && this.mapData[ty][tx] && this.parent.tiles[this.mapData[ty][tx]].allowCollisions != Types.NONE)
                        {
                            this._tempTileBlock.push({ x: tx, y: ty, tile: this.parent.tiles[this.mapData[ty][tx]] });
                        }
                    }
                    else
                    {
                        if (this.mapData[ty] && this.mapData[ty][tx])
                        {
                            this._tempTileBlock.push({ x: tx, y: ty, tile: this.parent.tiles[this.mapData[ty][tx]] });
                        }
                    }
                }
            }

        }

        /**
         * Get the tile index of specific position (in tiles).
         * @param x {number} X position of the tile.
         * @param y {number} Y position of the tile.
         * @return {number} Index of the tile at that position. Return null if there isn't a tile there.
         */
        public getTileIndex(x: number, y: number): number {

            if (y >= 0 && y < this.mapData.length)
            {
                if (x >= 0 && x < this.mapData[y].length)
                {
                    return this.mapData[y][x];
                }
            }

            return null;

        }

        /**
         * Add a column of tiles into the layer.
         * @param column {string[]/number[]} An array of tile indexes to be added.
         */
        public addColumn(column) {

            var data = [];

            for (var c = 0; c < column.length; c++)
            {
                data[c] = parseInt(column[c]);
            }

            if (this.widthInTiles == 0)
            {
                this.widthInTiles = data.length;
                this.widthInPixels = this.widthInTiles * this.tileWidth;
            }

            this.mapData.push(data);

            this.heightInTiles++;
            this.heightInPixels += this.tileHeight;

        }

        /**
         * Update boundsInTiles with widthInTiles and heightInTiles.
         */
        public updateBounds() {

            this.boundsInTiles.setTo(0, 0, this.widthInTiles, this.heightInTiles);

        }

        /**
         * Parse tile offsets from map data.
         * @return {number} length of tileOffsets array.
         */
        public parseTileOffsets():number {

            this.tileOffsets = [];

            var i = 0;

            if (this.mapFormat == Tilemap.FORMAT_TILED_JSON)
            {
                //  For some reason Tiled counts from 1 not 0
                this.tileOffsets[0] = null;
                i = 1;
            }

            for (var ty = this.tileMargin; ty < this.texture.height; ty += (this.tileHeight + this.tileSpacing))
            {
                for (var tx = this.tileMargin; tx < this.texture.width; tx += (this.tileWidth + this.tileSpacing))
                {
                    this.tileOffsets[i] = { x: tx, y: ty };
                    i++;
                }
            }

            return this.tileOffsets.length;

        }

    }
}