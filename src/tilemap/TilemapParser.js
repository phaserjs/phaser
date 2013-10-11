Phaser.TilemapParser = {

	/**
	* Parse a Sprite Sheet and extract the animation frame data from it.
	*
	* @method Phaser.AnimationParser.spriteSheet
	* @param {Phaser.Game} game - A reference to the currently running game.
	* @param {string} key - The Game.Cache asset key of the Sprite Sheet image.
	* @param {number} frameWidth - The fixed width of each frame of the animation.
	* @param {number} frameHeight - The fixed height of each frame of the animation.
	* @param {number} [frameMax=-1] - The total number of animation frames to extact from the Sprite Sheet. The default value of -1 means "extract all frames".
	* @return {Phaser.FrameData} A FrameData object containing the parsed frames.
	*/
	tileset: function (game, key, tileWidth, tileHeight, tileMax) {

	    //  How big is our image?
	    var img = game.cache.getTilesetImage(key);

	    if (img == null)
	    {
	        return null;
	    }

	    var width = img.width;
	    var height = img.height;

	    if (tileWidth <= 0)
	    {
	        tileWidth = Math.floor(-width / Math.min(-1, tileWidth));
	    }

	    if (tileHeight <= 0)
	    {
	        tileHeight = Math.floor(-height / Math.min(-1, tileHeight));
	    }

	    var row = Math.round(width / tileWidth);
	    var column = Math.round(height / tileHeight);
	    var total = row * column;
	    
	    if (tileMax !== -1)
	    {
	        total = tileMax;
	    }

	    //  Zero or smaller than tile sizes?
	    if (width == 0 || height == 0 || width < tileWidth || height < tileHeight || total === 0)
	    {
	        console.warn("Phaser.TilemapParser.tileSet: width/height zero or width/height < given tileWidth/tileHeight");
	        return null;
	    }

	    //  Let's create some tiles
	    var x = 0;
	    var y = 0;

	    var tileset = new Phaser.Tileset(key, tileWidth, tileHeight);

	    for (var i = 0; i < total; i++)
	    {
	        tileset.addTile(new Phaser.Tile(tileset, i, x, y, tileWidth, tileHeight));

	        x += tileWidth;

	        if (x === width)
	        {
	            x = 0;
	            y += tileHeight;
	        }
	    }

	    return tileset;

	},

	/**
	* Parse csv map data and generate tiles.
	* 
	* @method Phaser.Tilemap.prototype.parseCSV
	* @param {string} data - CSV map data.
	* @param {string} key - Asset key for tileset image.
	* @param {number} tileWidth - Width of its tile.
	* @param {number} tileHeight - Height of its tile.
	*/
	parseCSV: function (data, key, tileWidth, tileHeight) {

	    // var layer = new Phaser.TilemapLayer(this, 0, key, Phaser.Tilemap.CSV, 'TileLayerCSV' + this.layers.length.toString(), tileWidth, tileHeight);

	    //  Trim any rogue whitespace from the data
	    data = data.trim();

	    var rows = data.split("\n");

	    for (var i = 0; i < rows.length; i++)
	    {
	        var column = rows[i].split(",");

	        if (column.length > 0)
	        {
	            // layer.addColumn(column);
	        }
	    }

	    // layer.updateBounds();
	    // layer.createCanvas();

	    // var tileQuantity = layer.parseTileOffsets();

	    // this.currentLayer = layer;
	    // this.collisionLayer = layer;
	    // this.layers.push(layer);

	    // this.width = this.currentLayer.widthInPixels;
	    // this.height = this.currentLayer.heightInPixels;

	    // this.generateTiles(tileQuantity);

	}

}
