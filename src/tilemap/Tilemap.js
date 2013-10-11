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
    }
    else
    {
	    this.layers = [];
    }

    this.currentLayer = 0;

    this.debugMap = [];

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
			data: data

        });

    },

    setLayer: function (layer) {

    	if (this.layers[layer])
    	{
    		this.currentLayer = layer;
    	}

    },

    createLayerSprite: function (tilset) {

    	//	Creates a TilemapLayer which you can add to the display list
    	//	Hooked to a specific layer within the map data


    },

    /**
    * Set a specific tile with its x and y in tiles.
    * @method putTile
    * @param {number} x - X position of this tile.
    * @param {number} y - Y position of this tile.
    * @param {number} index - The index of this tile type in the core map data.
    */
    putTile: function (x, y, index) {

    	if (x >= 0 && x < this.layers[this.currentLayer].width && y >= 0 && y < this.layers[this.currentLayer].height)
    	{
    		this.layers[this.currentLayer].data[y][x] = index;
    	}

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

    }

};
