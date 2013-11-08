Phaser.Tilemap = function (game, key) {

	/**
	* @property {Phaser.Game} game - Description.
	*/ 
    this.game = game;

    /**
    * @property {array} layers - Description.
    */
	this.layers;

    if (typeof key === 'string')
    {
    	this.key = key;

		this.layers = game.cache.getTilemapData(key).layers;
        this.calculateIndexes();
    }
    else
    {
	    this.layers = [];
    }

    this.currentLayer = 0;

    this.debugMap = [];

    this.dirty = false;

    this._results = [];
    this._tempA = 0;
    this._tempB = 0;

};

Phaser.Tilemap.CSV = 0;
Phaser.Tilemap.TILED_JSON = 1;

Phaser.Tilemap.prototype = {

    create: function (name, width, height) {

        var data = [];

        for (var y = 0; y < height; y++)
        {
            data[y] = [];

            for (var x = 0; x < width; x++)
            {
                data[y][x] = 0;
            }
        }

        this.currentLayer = this.layers.push({

			name: name, 
			width: width, 
			height: height, 
			alpha: 1, 
			visible: true, 
			tileMargin: 0, 
			tileSpacing: 0,
			format: Phaser.Tilemap.CSV,
			data: data,
            indexes: []

        });

        this.dirty = true;

    },

    calculateIndexes: function () {

        for (var layer = 0; layer < this.layers.length; layer++)
        {
            this.layers[layer].indexes = [];

            for (var y = 0; y < this.layers[layer].height ; y++)
            {
                for (var x = 0; x < this.layers[layer].width; x++)
                {
                    var idx = this.layers[layer].data[y][x];

                    if (this.layers[layer].indexes.indexOf(idx) === -1)
                    {
                        this.layers[layer].indexes.push(idx);
                    }
                }
            }
        }

    },

    setLayer: function (layer) {

    	if (this.layers[layer])
    	{
    		this.currentLayer = layer;
    	}

    },

    /**
    * Set a specific tile with its x and y in tiles.
    * @method putTile
    * @param {number} x - X position of this tile.
    * @param {number} y - Y position of this tile.
    * @param {number} index - The index of this tile type in the core map data.
    */
    putTile: function (index, x, y, layer) {

        if (typeof layer === "undefined") { layer = this.currentLayer; }

    	if (x >= 0 && x < this.layers[layer].width && y >= 0 && y < this.layers[layer].height)
    	{
    		this.layers[layer].data[y][x] = index;
    	}

        this.dirty = true;

    },

    getTile: function (x, y, layer) {

        if (typeof layer === "undefined") { layer = this.currentLayer; }

        if (x >= 0 && x < this.layers[layer].width && y >= 0 && y < this.layers[layer].height)
        {
            return this.layers[layer].data[y][x];
        }

    },

    getTileWorldXY: function (x, y, tileWidth, tileHeight, layer) {

        if (typeof layer === "undefined") { layer = this.currentLayer; }

        x = this.game.math.snapToFloor(x, tileWidth) / tileWidth;
        y = this.game.math.snapToFloor(y, tileHeight) / tileHeight;

        if (x >= 0 && x < this.layers[layer].width && y >= 0 && y < this.layers[layer].height)
        {
            return this.layers[layer].data[y][x];
        }

    },

    /**
    * Set a specific tile with its x and y in tiles.
    * @method putTileWorldXY
    * @param {number} x - X position of this tile in world coordinates.
    * @param {number} y - Y position of this tile in world coordinates.
    * @param {number} index - The index of this tile type in the core map data.
    */
    putTileWorldXY: function (index, x, y, tileWidth, tileHeight, layer) {

        x = this.game.math.snapToFloor(x, tileWidth) / tileWidth;
        y = this.game.math.snapToFloor(y, tileHeight) / tileHeight;

        if (x >= 0 && x < this.layers[layer].width && y >= 0 && y < this.layers[layer].height)
        {
            this.layers[layer].data[y][x] = index;
        }

        this.dirty = true;

    },

    //  Values are in TILEs, not pixels.
    copy: function (x, y, width, height, layer) {

        if (typeof layer === "undefined") { layer = this.currentLayer; }

        if (!this.layers[layer])
        {
            this._results.length = 0;
            return;
        }

        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        if (typeof width === "undefined") { width = this.layers[layer].width; }
        if (typeof height === "undefined") { height = this.layers[layer].height; }

        if (x < 0)
        {
            x = 0;
        }

        if (y < 0)
        {
            y = 0;
        }

        if (width > this.layers[layer].width)
        {
            width = this.layers[layer].width;
        }

        if (height > this.layers[layer].height)
        {
            height = this.layers[layer].height;
        }

        this._results.length = 0;

        this._results.push( { x: x, y: y, width: width, height: height, layer: layer });

        for (var ty = y; ty < y + height; ty++)
        {
            for (var tx = x; tx < x + width; tx++)
            {
                this._results.push({ x: tx, y: ty, index: this.layers[layer].data[ty][tx] });
            }
        }

        return this._results;

    },

    paste: function (x, y, tileblock, layer) {

        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        if (typeof layer === "undefined") { layer = this.currentLayer; }

        if (!tileblock || tileblock.length < 2)
        {
            return;
        }

        //  Find out the difference between tileblock[1].x/y and x/y and use it as an offset, as it's the top left of the block to paste
        var diffX = tileblock[1].x - x;
        var diffY = tileblock[1].y - y;

        for (var i = 1; i < tileblock.length; i++)
        {
            this.layers[layer].data[ diffY + tileblock[i].y ][ diffX + tileblock[i].x ] = tileblock[i].index;
        }

        this.dirty = true;

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
    swap: function (tileA, tileB, x, y, width, height, layer) {

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        this._tempA = tileA;
        this._tempB = tileB;

        this._results.forEach(this.swapHandler, this);

        this.paste(x, y, this._results);

    },

    swapHandler: function (value, index, array) {

        if (value.index === this._tempA)
        {
            this._results[index].index = this._tempB;
        }
        else if (value.index === this._tempB)
        {
            this._results[index].index = this._tempA;
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
    forEach: function (callback, context, x, y, width, height, layer) {

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        this._results.forEach(callback, context);

        this.paste(x, y, this._results);

    },

    /**
    * Replaces one type of tile with another.
    * @method replace
    * @param {number} tileA - First tile index.
    * @param {number} tileB - Second tile index.
    * @param {number} [x] - specify a Rectangle of tiles to operate. The x position in tiles of Rectangle's left-top corner.
    * @param {number} [y] - specify a Rectangle of tiles to operate. The y position in tiles of Rectangle's left-top corner.
    * @param {number} [width] - specify a Rectangle of tiles to operate. The width in tiles.
    * @param {number} [height] - specify a Rectangle of tiles to operate. The height in tiles.
    */
    replace: function (tileA, tileB, x, y, width, height, layer) {

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        for (var i = 1; i < this._results.length; i++)
        {
            if (this._results[i].index === tileA)
            {
                this._results[i].index = tileB;
            }
        }

        this.paste(x, y, this._results);

    },

    /**
    * Randomises a set of tiles in a given area. It will only randomise the tiles in that area, so if they're all the same nothing will appear to have changed!
    * @method random
    * @param {number} tileA - First tile index.
    * @param {number} tileB - Second tile index.
    * @param {number} [x] - specify a Rectangle of tiles to operate. The x position in tiles of Rectangle's left-top corner.
    * @param {number} [y] - specify a Rectangle of tiles to operate. The y position in tiles of Rectangle's left-top corner.
    * @param {number} [width] - specify a Rectangle of tiles to operate. The width in tiles.
    * @param {number} [height] - specify a Rectangle of tiles to operate. The height in tiles.
    */
    random: function (x, y, width, height, layer) {

        if (typeof layer === "undefined") { layer = this.currentLayer; }

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        var indexes = [];

        for (var t = 1; t < this._results.length; t++)
        {
            var idx = this._results[t].index;

            if (indexes.indexOf(idx) === -1)
            {
                indexes.push(idx);
            }
        }

        for (var i = 1; i < this._results.length; i++)
        {
            this._results[i].index = this.game.rnd.pick(indexes);
        }

        this.paste(x, y, this._results);

    },

    /**
    * Randomises a set of tiles in a given area. It will only randomise the tiles in that area, so if they're all the same nothing will appear to have changed!
    * @method random
    * @param {number} tileA - First tile index.
    * @param {number} tileB - Second tile index.
    * @param {number} [x] - specify a Rectangle of tiles to operate. The x position in tiles of Rectangle's left-top corner.
    * @param {number} [y] - specify a Rectangle of tiles to operate. The y position in tiles of Rectangle's left-top corner.
    * @param {number} [width] - specify a Rectangle of tiles to operate. The width in tiles.
    * @param {number} [height] - specify a Rectangle of tiles to operate. The height in tiles.
    */
    shuffle: function (x, y, width, height, layer) {

        if (typeof layer === "undefined") { layer = this.currentLayer; }

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        var header = this._results.shift();

        Phaser.Utils.shuffle(this._results);

        this._results.unshift(header);

        this.paste(x, y, this._results);

    },

    /**
    * Fill a tile block with a specific tile index.
    * @method fill
    * @param {number} index - Index of tiles you want to fill with.
    * @param {number} [x] - X position (in tiles) of block's left-top corner.
    * @param {number} [y] - Y position (in tiles) of block's left-top corner.
    * @param {number} [width] - width of block.
    * @param {number} [height] - height of block.
    */
    fill: function (index, x, y, width, height, layer) {

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        for (var i = 1; i < this._results.length; i++)
        {
            this._results[i].index = index;
        }

        this.paste(x, y, this._results);

    },

    removeAllLayers: function () {

        this.layers.length = 0;
        this.currentLayer = 0;

    },

    dump: function () {

        var txt = '';
        var args = [''];

        for (var y = 0; y < this.layers[this.currentLayer].height; y++)
        {
            for (var x = 0; x < this.layers[this.currentLayer].width; x++)
            {
                txt += "%c  ";

                if (this.layers[this.currentLayer].data[y][x] > 1)
                {
                	if (this.debugMap[this.layers[this.currentLayer].data[y][x]])
                	{
	                    args.push("background: " + this.debugMap[this.layers[this.currentLayer].data[y][x]]);
                	}
                	else
                	{
	                    args.push("background: #ffffff");
                	}
                }
                else
                {
                    args.push("background: rgb(0, 0, 0)");
                }
            }

            txt += "\n";
        }

        args[0] = txt;
        console.log.apply(console, args);

    },

    destroy: function () {

        this.removeAllLayers();
        this.game = null;

    }

};
