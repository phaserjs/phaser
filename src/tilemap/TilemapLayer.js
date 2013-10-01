/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
* @module       Phaser.TilemapLayer
*/

/**
* Create a new <code>TilemapLayer</code>.
* @class Phaser.TilemapLayer
* @classdesc A Tilemap Layer. Tiled format maps can have multiple overlapping layers.
* @constructor
* @param parent {Tilemap} The tilemap that contains this layer.
* @param id {number} The ID of this layer within the Tilemap array.
* @param key {string} Asset key for this map.
* @param mapformat {number} Format of this map data, available: Tilemap.CSV or Tilemap.JSON.
* @param name {string} Name of this layer, so you can get this layer by its name.
* @param tileWidth {number} Width of tiles in this map.
* @param tileHeight {number} Height of tiles in this map.
*/
Phaser.TilemapLayer = function (parent, id, key, mapFormat, name, tileWidth, tileHeight) {

	/**
	* @property {boolean} exists - Controls whether update() and draw() are automatically called.
	* @default
	*/
    this.exists = true;

	/**
	* @property {boolean} visible - Controls whether draw() are automatically called.
	* @default
	*/
    this.visible = true;

    /**
    * How many tiles in each row.
    * Read-only variable, do NOT recommend changing after the map is loaded!
    * @property {number} widthInTiles
    * @default
    */
    this.widthInTiles = 0;

    /**
    * How many tiles in each column.
    * Read-only variable, do NOT recommend changing after the map is loaded!
    * @property {number} heightInTiles
    * @default
    */
    this.heightInTiles = 0;

    /**
    * Read-only variable, do NOT recommend changing after the map is loaded!
    * @property {number} widthInPixels
    * @default
    */
    this.widthInPixels = 0;

    /**
    * Read-only variable, do NOT recommend changing after the map is loaded!
    * @property {number} heightInPixels
    * @default
    */
    this.heightInPixels = 0;

    /**
    * Distance between REAL tiles to the tileset texture bound.
    * @property {number} tileMargin
    * @default
    */
    this.tileMargin = 0;

    /**
    * Distance between every 2 neighbor tile in the tileset texture.
    * @property {number} tileSpacing
    * @default
    */
    this.tileSpacing = 0;

	/**
	* @property {Description} parent - Description.
	*/
    this.parent = parent;
    
	/**
	* @property {Phaser.Game} game - Description.
	*/ 
    this.game = parent.game;
    
	/**
	* @property {Description} ID - Description.
	*/    
    this.ID = id;
    
	/**
	* @property {Description} name - Description.
	*/
    this.name = name;
    
	/**
	* @property {Description} key - Description.
	*/
    this.key = key;
    
	/**
	* @property {Description} type - Description.
	*/
    this.type = Phaser.TILEMAPLAYER;

	/**
	* @property {tileWidth} mapFormat - Description.
	*/
    this.mapFormat = mapFormat;
    
	/**
	* @property {Description} tileWidth - Description.
	*/
    this.tileWidth = tileWidth;
    
	/**
	* @property {Description} tileHeight - Description.
	*/
    this.tileHeight = tileHeight;

	/**
	* @property {Phaser.Rectangle} boundsInTiles - Description.
	*/
    this.boundsInTiles = new Phaser.Rectangle();

    var map = this.game.cache.getTilemap(key);

	/**
	* @property {Description} tileset - Description.
	*/
    this.tileset = map.data;

	/**
	* @property {Description} _alpha - Description.
	* @private
	* @default
	*/
    this._alpha = 1;

	/**
	* @property {Description} canvas - Description.
	* @default
	*/
    this.canvas = null;
    
	/**
	* @property {Description} context - Description.
	* @default
	*/
    this.context = null;
    
	/**
	* @property {Description} baseTexture - Description.
	* @default
	*/
    this.baseTexture = null;
    
	/**
	* @property {Description} texture - Description.
	* @default
	*/
    this.texture = null;
    
	/**
	* @property {Description} sprite - Description.
	* @default
	*/
    this.sprite = null;

	/**
	* @property {array} mapData - Description.
	*/
    this.mapData = [];
    
	/**
	* @property {array} _tempTileBlock - Description.
	* @private
	*/
    this._tempTileBlock = [];
    
	/**
	* @property {array} _tempBlockResults - Description.
	* @private
	* 
	*/
    this._tempBlockResults = [];

};

Phaser.TilemapLayer.prototype = {

    /**
    * Set a specific tile with its x and y in tiles.
    * @method putTileWorldXY
    * @param {number} x - X position of this tile in world coordinates.
    * @param {number} y - Y position of this tile in world coordinates.
    * @param {number} index - The index of this tile type in the core map data.
    */
    putTileWorldXY: function (x, y, index) {

        x = this.game.math.snapToFloor(x, this.tileWidth) / this.tileWidth;
        y = this.game.math.snapToFloor(y, this.tileHeight) / this.tileHeight;

        if (y >= 0 && y < this.mapData.length)
        {
            if (x >= 0 && x < this.mapData[y].length)
            {
                this.mapData[y][x] = index;
            }
        }

    },

    /**
    * Set a specific tile with its x and y in tiles.
    * @method putTile
    * @param {number} x - X position of this tile.
    * @param {number} y - Y position of this tile.
    * @param {number} index - The index of this tile type in the core map data.
    */
    putTile: function (x, y, index) {

        if (y >= 0 && y < this.mapData.length)
        {
            if (x >= 0 && x < this.mapData[y].length)
            {
                this.mapData[y][x] = index;
            }
        }

    },

    /**
    * Swap tiles with 2 kinds of indexes.
    * @method swapTile
    * @param {number} tileA - First tile index.
    * @param {number} tileB - Second tile index.
    * @param {number} [x] - specify a Rectangle of tiles to operate. The x position in tiles of Rectangle's left-top corner.
    * @param {number} [y] - specify a Rectangle of tiles to operate. The y position in tiles of Rectangle's left-top corner.
    * @param {number} [width] - specify a Rectangle of tiles to operate. The width in tiles.
    * @param {number} [height] - specify a Rectangle of tiles to operate. The height in tiles.
    */
    swapTile: function (tileA, tileB, x, y, width, height) {

        x = x || 0;
        y = y || 0;
        width = width || this.widthInTiles;
        height = height || this.heightInTiles;
        
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

    },

    /**
    * Fill a tile block with a specific tile index.
    * @method fillTile
    * @param {number} index - Index of tiles you want to fill with.
    * @param {number} [x] - X position (in tiles) of block's left-top corner.
    * @param {number} [y] - Y position (in tiles) of block's left-top corner.
    * @param {number} [width] - width of block.
    * @param {number} [height] - height of block.
    */
    fillTile: function (index, x, y, width, height) {

        x = x || 0;
        y = y || 0;
        width = width || this.widthInTiles;
        height = height || this.heightInTiles;

        this.getTempBlock(x, y, width, height);

        for (var r = 0; r < this._tempTileBlock.length; r++)
        {
            this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = index;
        }

    },

    /**
    * Set random tiles to a specific tile block.
    * @method randomiseTiles
    * @param {number[]} tiles - Tiles with indexes in this array will be randomly set to the given block.
    * @param {number} [x] - X position (in tiles) of block's left-top corner.
    * @param {number} [y] - Y position (in tiles) of block's left-top corner.
    * @param {number} [width] - width of block.
    * @param {number} [height] - height of block.
    */
    randomiseTiles: function (tiles, x, y, width, height) {

        x = x || 0;
        y = y || 0;
        width = width || this.widthInTiles;
        height = height || this.heightInTiles;

        this.getTempBlock(x, y, width, height);

        for (var r = 0; r < this._tempTileBlock.length; r++)
        {
            this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = this.game.math.getRandom(tiles);
        }

    },

    /**
    * Replace one kind of tiles to another kind.
    * @method replaceTile
    * @param {number} tileA - First tile index.
    * @param {number} tileB - Second tile index.
    * @param {number} [x] - X position (in tiles) of block's left-top corner.
    * @param {number} [y] - Y position (in tiles) of block's left-top corner.
    * @param {number} [width] - width of block.
    * @param {number} [height] - height of block.
    */
    replaceTile: function (tileA, tileB, x, y, width, height) {

        x = x || 0;
        y = y || 0;
        width = width || this.widthInTiles;
        height = height || this.heightInTiles;

        this.getTempBlock(x, y, width, height);

        for (var r = 0; r < this._tempTileBlock.length; r++)
        {
            if (this._tempTileBlock[r].tile.index == tileA)
            {
                this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = tileB;
            }
        }

    },

    /**
    * Get a tile block with specific position and size (both are in tiles).
    * @method getTileBlock
    * @param {number} [x] - X position (in tiles) of block's left-top corner.
    * @param {number} [y] - Y position (in tiles) of block's left-top corner.
    * @param {number} [width] - width of block.
    * @param {number} [height] - height of block.
    */
    getTileBlock: function (x, y, width, height) {

        var output = [];

        this.getTempBlock(x, y, width, height);

        for (var r = 0; r < this._tempTileBlock.length; r++)
        {
            output.push({
                x: this._tempTileBlock[r].x,
                y: this._tempTileBlock[r].y,
                tile: this._tempTileBlock[r].tile
            });
        }

        return output;

    },

    /**
    * Get a tile with specific position (in world coordinate). (thus you give a position of a point which is within the tile)
    * @method getTileFromWorldXY
    * @param {number} [x] - X position (in tiles) of block's left-top corner.
    * @param {number} [y] - Y position (in tiles) of block's left-top corner.
    */
    getTileFromWorldXY: function (x, y) {

        x = Phaser.Math.snapToFloor(x, this.tileWidth) / this.tileWidth;
        y = Phaser.Math.snapToFloor(y, this.tileHeight) / this.tileHeight;

        return this.getTileIndex(x, y);

    },

    /**
    * Get tiles overlaps the given object.
    * @method getTileOverlaps
    * @param {GameObject} object - Tiles you want to get that overlaps this.
    * @return {array} Array with tiles informations (each contains x, y, and the tile).
    */
    getTileOverlaps: function (object) {

        this._tempBlockResults.length = 0;

        //  If the object is outside of the world coordinates then abort the check (tilemap has to exist within world bounds)
        if (object.body.x < 0 || object.body.x > this.widthInPixels || object.body.y < 0 || object.body.bottom > this.heightInPixels)
        {
            return this._tempBlockResults;
        }

        //  What tiles do we need to check against?
        this._tempTileX = this.game.math.snapToFloor(object.body.x, this.tileWidth) / this.tileWidth;
        this._tempTileY = this.game.math.snapToFloor(object.body.y, this.tileHeight) / this.tileHeight;
        this._tempTileW = (this.game.math.snapToCeil(object.body.width, this.tileWidth) + this.tileWidth) / this.tileWidth;
        this._tempTileH = (this.game.math.snapToCeil(object.body.height, this.tileHeight) + this.tileHeight) / this.tileHeight;

        //  Loop through the tiles we've got and check overlaps accordingly (the results are stored in this._tempTileBlock)
        this.getTempBlock(this._tempTileX, this._tempTileY, this._tempTileW, this._tempTileH, true);

        for (var r = 0; r < this._tempTileBlock.length; r++)
        {
            //  separateTile: function (object, x, y, width, height, mass, collideLeft, collideRight, collideUp, collideDown, separateX, separateY)            
            if (this.game.physics.separateTile(object, this._tempTileBlock[r].x * this.tileWidth, this._tempTileBlock[r].y * this.tileHeight, this.tileWidth, this.tileHeight, this._tempTileBlock[r].tile.mass, this._tempTileBlock[r].tile.collideLeft, this._tempTileBlock[r].tile.collideRight, this._tempTileBlock[r].tile.collideUp, this._tempTileBlock[r].tile.collideDown, this._tempTileBlock[r].tile.separateX, this._tempTileBlock[r].tile.separateY))
            {
                this._tempBlockResults.push({ x: this._tempTileBlock[r].x, y: this._tempTileBlock[r].y, tile: this._tempTileBlock[r].tile });
            }
        }

        return this._tempBlockResults;

    },

    /**
    * Get a tile block with its position and size (this method does not return, it'll set result to _tempTileBlock).
    * @method getTempBlock
    * @param {number} [x] - X position (in tiles) of block's left-top corner.
    * @param {number} [y] - Y position (in tiles) of block's left-top corner.
    * @param {number} [width] - width of block.
    * @param {number} [height] - height of block.
    * @param {boolean} collisionOnly - Whethor or not ONLY return tiles which will collide (its allowCollisions value is not Collision.NONE).
    */
    getTempBlock: function (x, y, width, height, collisionOnly) {

        if (typeof collisionOnly === "undefined") { collisionOnly = false; }

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
                    if (this.mapData[ty] && this.mapData[ty][tx] && this.parent.tiles[this.mapData[ty][tx]].collideNone == false)
                    {
                        this._tempTileBlock.push({
                            x: tx,
                            y: ty,
                            tile: this.parent.tiles[this.mapData[ty][tx]]
                        });
                    }
                }
                else
                {
                    if (this.mapData[ty] && this.mapData[ty][tx])
                    {
                        this._tempTileBlock.push({
                            x: tx,
                            y: ty,
                            tile: this.parent.tiles[this.mapData[ty][tx]]
                        });
                    }
                }
            }
        }
    },

    /**
    * Get the tile index of specific position (in tiles).
    * @method getTileIndex
    * @param {number} x - X position of the tile.
    * @param {number} y - Y position of the tile.
    * @return {number} Index of the tile at that position. Return null if there isn't a tile there.
    */
    getTileIndex: function (x, y) {

        if (y >= 0 && y < this.mapData.length)
        {
            if (x >= 0 && x < this.mapData[y].length)
            {
                return this.mapData[y][x];
            }
        }

        return null;

    },

    /**
    * Add a column of tiles into the layer.
    * @method addColumn
    * @param {string[]|number[]} column - An array of tile indexes to be added.
    */
    addColumn: function (column) {

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

    },

    /**
    * Description.
    * @method createCanvas
    */
    createCanvas: function () {

        var width = this.game.width;
        var height = this.game.height;

        if (this.widthInPixels < width)
        {
            width = this.widthInPixels;
        }

        if (this.heightInPixels < height)
        {
            height = this.heightInPixels;
        }

        this.canvas = Phaser.Canvas.create(width, height);
        this.context = this.canvas.getContext('2d');

        this.baseTexture = new PIXI.BaseTexture(this.canvas);
        this.texture = new PIXI.Texture(this.baseTexture);
        this.sprite = new PIXI.Sprite(this.texture);

        this.parent.addChild(this.sprite);

    },

    createQuadTree: function (width, height) {

        this.quadTree = new Phaser.QuadTree(this, 0, 0, width, height, 20, 4);

    },

	/**
    * Update boundsInTiles with widthInTiles and heightInTiles.
    * @method updateBounds
    */
    updateBounds: function () {

        this.boundsInTiles.setTo(0, 0, this.widthInTiles, this.heightInTiles);

    },

    /**
    * Parse tile offsets from map data.
    * Basically this creates a large array of objects that contain the x/y coordinates to grab each tile from
    * for the entire map. Yes we could calculate this at run-time by using the tile index and some math, but we're
    * trading a quite small bit of memory here to not have to process that in our main render loop.
    * @method parseTileOffsets
    * @return {number} Length of tileOffsets array.
    */
    parseTileOffsets: function () {

        this.tileOffsets = [];

        var i = 0;

        if (this.mapFormat == Phaser.Tilemap.JSON)
        {
            //  For some reason Tiled counts from 1 not 0
            this.tileOffsets[0] = null;
            i = 1;
        }

        for (var ty = this.tileMargin; ty < this.tileset.height; ty += (this.tileHeight + this.tileSpacing))
        {
            for (var tx = this.tileMargin; tx < this.tileset.width; tx += (this.tileWidth + this.tileSpacing))
            {
                this.tileOffsets[i] = {
                    x: tx,
                    y: ty
                };
                i++;
            }
        }

        return this.tileOffsets.length;

    }

};

/**
* Get
* @return {Description}
*//**
* Set
* @param {Description} value - Description.
*/
Object.defineProperty(Phaser.TilemapLayer.prototype, 'alpha', {

    get: function() {
        return this._alpha;
    },

    set: function(value) {

        if (this.sprite)
        {
            this.sprite.alpha = value;
        }
        
        this._alpha = value;
    }

});
