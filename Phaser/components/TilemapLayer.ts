/// <reference path="../Game.ts" />
/// <reference path="../gameobjects/Tilemap.ts" />
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
         * @param game {Phaser.Game} Current game instance.
         * @param parent {Tilemap} The tilemap that contains this layer.
         * @param key {string} Asset key for this map.
         * @param mapFormat {number} Format of this map data, available: Tilemap.FORMAT_CSV or Tilemap.FORMAT_TILED_JSON.
         * @param name {string} Name of this layer, so you can get this layer by its name.
         * @param tileWidth {number} Width of tiles in this map.
         * @param tileHeight {number} Height of tiles in this map.
         */
        constructor(game: Game, parent:Tilemap, key: string, mapFormat: number, name: string, tileWidth: number, tileHeight: number) {

            this._game = game;
            this._parent = parent;

            this.name = name;
            this.mapFormat = mapFormat;
            this.tileWidth = tileWidth;
            this.tileHeight = tileHeight;
            this.boundsInTiles = new Rectangle();
            //this.scrollFactor = new MicroPoint(1, 1);

            this.canvas = game.stage.canvas;
            this.context = game.stage.context;

            this.mapData = [];
            this._tempTileBlock = [];
            this._texture = this._game.cache.getImage(key);

        }

        /**
         * Local private reference to game.
         */
        private _game: Game;

        /**
         * The tilemap that contains this layer.
         * @type {Tilemap}
         */
        private _parent: Tilemap;

        /**
         * Tileset of this layer.
         */
        private _texture;
        private _tileOffsets;
        private _startX: number = 0;
        private _startY: number = 0;
        private _maxX: number = 0;
        private _maxY: number = 0;
        private _tx: number = 0;
        private _ty: number = 0;
        private _dx: number = 0;
        private _dy: number = 0;
        private _oldCameraX: number = 0;
        private _oldCameraY: number = 0;
        private _columnData;

        private _tempTileX: number;
        private _tempTileY: number;
        private _tempTileW: number;
        private _tempTileH: number;
        private _tempTileBlock;
        private _tempBlockResults;

        /**
         * Name of this layer, so you can get this layer by its name.
         * @type {string}
         */
        public name: string;

        /**
        * A reference to the Canvas this GameObject will render to
        * @type {HTMLCanvasElement}
        */
        public canvas: HTMLCanvasElement;

        /**
        * A reference to the Canvas Context2D this GameObject will render to
        * @type {CanvasRenderingContext2D}
        */
        public context: CanvasRenderingContext2D;

        /**
         * Opacity of this layer.
         * @type {number}
         */
        public alpha: number = 1;

        /**
         * Controls whether update() and draw() are automatically called.
         * @type {boolean}
         */
        public exists: bool = true;

        /**
         * Controls whether draw() are automatically called.
         * @type {boolean}
         */
        public visible: bool = true;

        //public scrollFactor: MicroPoint;
        /**
         * @type {string}
         */
        public orientation: string;

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
         * It's width and height are in tiles instead of pixels.
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
         * @param x {number} X position of this tile.
         * @param y {number} Y position of this tile.
         * @param index {number} The index of this tile type in the core map data.
         */
        public putTile(x: number, y: number, index: number) {

            x = this._game.math.snapToFloor(x, this.tileWidth) / this.tileWidth;
            y = this._game.math.snapToFloor(y, this.tileHeight) / this.tileHeight;

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
         * @param [x] {number} specify a rectangle of tiles to operate. The x position in tiles of rectangle's left-top corner.
         * @param [y] {number} specify a rectangle of tiles to operate. The y position in tiles of rectangle's left-top corner.
         * @param [width] {number} specify a rectangle of tiles to operate. The width in tiles.
         * @param [height] {number} specify a rectangle of tiles to operate. The height in tiles.
         */
        public swapTile(tileA: number, tileB: number, x?: number = 0, y?: number = 0, width?: number = this.widthInTiles, height?: number = this.heightInTiles) {

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
        public fillTile(index: number, x?: number = 0, y?: number = 0, width?: number = this.widthInTiles, height?: number = this.heightInTiles) {

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
        public randomiseTiles(tiles: number[], x?: number = 0, y?: number = 0, width?: number = this.widthInTiles, height?: number = this.heightInTiles) {

            this.getTempBlock(x, y, width, height);

            for (var r = 0; r < this._tempTileBlock.length; r++)
            {
                this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = this._game.math.getRandom(tiles);
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
        public replaceTile(tileA: number, tileB: number, x?: number = 0, y?: number = 0, width?: number = this.widthInTiles, height?: number = this.heightInTiles) {

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

            x = this._game.math.snapToFloor(x, this.tileWidth) / this.tileWidth;
            y = this._game.math.snapToFloor(y, this.tileHeight) / this.tileHeight;

            return this.getTileIndex(x, y);

        }

        /**
         * Get tiles overlaps the given object.
         * @param object {GameObject} Tiles you want to get that overlaps this.
         * @return {array} Array with tiles informations. (Each contains x, y and the tile.)
         */
        public getTileOverlaps(object: IGameObject) {

            //  If the object is outside of the world coordinates then abort the check (tilemap has to exist within world bounds)
            if (object.collisionMask.x < 0 || object.collisionMask.x > this.widthInPixels || object.collisionMask.y < 0 || object.collisionMask.bottom > this.heightInPixels)
            {
                return;
            }

            //  What tiles do we need to check against?
            this._tempTileX = this._game.math.snapToFloor(object.collisionMask.x, this.tileWidth) / this.tileWidth;
            this._tempTileY = this._game.math.snapToFloor(object.collisionMask.y, this.tileHeight) / this.tileHeight;
            this._tempTileW = (this._game.math.snapToCeil(object.collisionMask.width, this.tileWidth) + this.tileWidth) / this.tileWidth;
            this._tempTileH = (this._game.math.snapToCeil(object.collisionMask.height, this.tileHeight) + this.tileHeight) / this.tileHeight;

            //  Loop through the tiles we've got and check overlaps accordingly (the results are stored in this._tempTileBlock)

            this._tempBlockResults = [];
            this.getTempBlock(this._tempTileX, this._tempTileY, this._tempTileW, this._tempTileH, true);

            Collision.TILE_OVERLAP = false;

            for (var r = 0; r < this._tempTileBlock.length; r++)
            {
                if (Collision.separateTile(object, this._tempTileBlock[r].x * this.tileWidth, this._tempTileBlock[r].y * this.tileHeight, this.tileWidth, this.tileHeight, this._tempTileBlock[r].tile.mass, this._tempTileBlock[r].tile.collideLeft, this._tempTileBlock[r].tile.collideRight, this._tempTileBlock[r].tile.collideUp, this._tempTileBlock[r].tile.collideDown, this._tempTileBlock[r].tile.separateX, this._tempTileBlock[r].tile.separateY) == true)
                {
                    this._tempBlockResults.push({ x: this._tempTileBlock[r].x, y: this._tempTileBlock[r].y, tile: this._tempTileBlock[r].tile });
                }
            }

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
        private getTempBlock(x: number, y: number, width: number, height: number, collisionOnly?: bool = false) {

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
                        if (this.mapData[ty] && this.mapData[ty][tx] && this._parent.tiles[this.mapData[ty][tx]].allowCollisions != Collision.NONE)
                        {
                            this._tempTileBlock.push({ x: tx, y: ty, tile: this._parent.tiles[this.mapData[ty][tx]] });
                        }
                    }
                    else
                    {
                        if (this.mapData[ty] && this.mapData[ty][tx])
                        {
                            this._tempTileBlock.push({ x: tx, y: ty, tile: this._parent.tiles[this.mapData[ty][tx]] });
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
         * @return {number} length of _tileOffsets array.
         */
        public parseTileOffsets():number {

            this._tileOffsets = [];

            var i = 0;

            if (this.mapFormat == Tilemap.FORMAT_TILED_JSON)
            {
                //  For some reason Tiled counts from 1 not 0
                this._tileOffsets[0] = null;
                i = 1;
            }

            for (var ty = this.tileMargin; ty < this._texture.height; ty += (this.tileHeight + this.tileSpacing))
            {
                for (var tx = this.tileMargin; tx < this._texture.width; tx += (this.tileWidth + this.tileSpacing))
                {
                    this._tileOffsets[i] = { x: tx, y: ty };
                    i++;
                }
            }

            return this._tileOffsets.length;

        }

        public renderDebugInfo(x: number, y: number, color?: string = 'rgb(255,255,255)') {

            this.context.fillStyle = color;
            this.context.fillText('TilemapLayer: ' + this.name, x, y);
            this.context.fillText('startX: ' + this._startX + ' endX: ' + this._maxX, x, y + 14);
            this.context.fillText('startY: ' + this._startY + ' endY: ' + this._maxY, x, y + 28);
            this.context.fillText('dx: ' + this._dx + ' dy: ' + this._dy, x, y + 42);

        }

        /**
         * Render this layer to a specific camera with offset to camera.
         * @param camera {Camera} The camera the layer is going to be rendered.
         * @param dx {number} X offset to the camera.
         * @param dy {number} Y offset to the camera.
         * @return {boolean} Return false if layer is invisible or has a too low opacity(will stop rendering), return true if succeed.
         */
        public render(camera: Camera, dx, dy): bool {

            if (this.visible === false || this.alpha < 0.1)
            {
                return false;
            }

            //  Work out how many tiles we can fit into our camera and round it up for the edges
            this._maxX = this._game.math.ceil(camera.width / this.tileWidth) + 1;
            this._maxY = this._game.math.ceil(camera.height / this.tileHeight) + 1;

            //  And now work out where in the tilemap the camera actually is
            this._startX = this._game.math.floor(camera.worldView.x / this.tileWidth);
            this._startY = this._game.math.floor(camera.worldView.y / this.tileHeight);

            //  Tilemap bounds check
            if (this._startX < 0)
            {
                this._startX = 0;
            }

            if (this._startY < 0)
            {
                this._startY = 0;
            }

            if (this._maxX > this.widthInTiles)
            {
                this._maxX = this.widthInTiles;
            }

            if (this._maxY > this.heightInTiles)
            {
                this._maxY = this.heightInTiles;
            }

            if (this._startX + this._maxX > this.widthInTiles)
            {
                this._startX = this.widthInTiles - this._maxX;
            }

            if (this._startY + this._maxY > this.heightInTiles)
            {
                this._startY = this.heightInTiles - this._maxY;
            }

            //  Finally get the offset to avoid the blocky movement
            this._dx = dx;
            this._dy = dy;

            this._dx += -(camera.worldView.x - (this._startX * this.tileWidth));
            this._dy += -(camera.worldView.y - (this._startY * this.tileHeight));

            this._tx = this._dx;
            this._ty = this._dy;

            //	Apply camera difference
            /*
            if (this.scrollFactor.x !== 1.0 || this.scrollFactor.y !== 1.0)
            {
                this._dx -= (camera.worldView.x * this.scrollFactor.x);
                this._dy -= (camera.worldView.y * this.scrollFactor.y);
            }
            */

            //  Alpha
            if (this.alpha !== 1)
            {
                var globalAlpha = this.context.globalAlpha;
                this.context.globalAlpha = this.alpha;
            }

            for (var row = this._startY; row < this._startY + this._maxY; row++)
            {
                this._columnData = this.mapData[row];

                for (var tile = this._startX; tile < this._startX + this._maxX; tile++)
                {
                    if (this._tileOffsets[this._columnData[tile]])
                    {
                        this.context.drawImage(
                            this._texture,	                                //  Source Image
                            this._tileOffsets[this._columnData[tile]].x,    //  Source X (location within the source image)
                            this._tileOffsets[this._columnData[tile]].y,    //  Source Y
                            this.tileWidth, 	                            //	Source Width
                            this.tileHeight, 	                            //	Source Height
                            this._tx, 	    	                            //	Destination X (where on the canvas it'll be drawn)
                            this._ty,	    	                            //	Destination Y
                            this.tileWidth, 	                            //	Destination Width (always same as Source Width unless scaled)
                            this.tileHeight	                                //	Destination Height (always same as Source Height unless scaled)
                        );

                    }

                    this._tx += this.tileWidth;

                }

                this._tx = this._dx;
                this._ty += this.tileHeight;

            }

            if (globalAlpha > -1)
            {
                this.context.globalAlpha = globalAlpha;
            }

            return true;

        }

    }
}