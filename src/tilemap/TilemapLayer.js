
Phaser.TilemapLayer = function (game, x, y, renderWidth, renderHeight, mapData, tileset) {

	/**
	* @property {Phaser.Game} game - Description.
	*/ 
    this.game = game;
    
	/**
	* @property {Description} canvas - Description.
	* @default
	*/
    this.canvas = Phaser.Canvas.create(renderWidth, renderHeight);
    
	/**
	* @property {Description} context - Description.
	* @default
	*/
    this.context = this.canvas.getContext('2d');
    
	/**
	* @property {Description} baseTexture - Description.
	* @default
	*/
    this.baseTexture = new PIXI.BaseTexture(this.canvas);
    
	/**
	* @property {Description} texture - Description.
	* @default
	*/
    this.texture = new PIXI.Texture(this.baseTexture);
    
	/**
	* @property {Description} sprite - Description.
	* @default
	*/
    this.sprite = new PIXI.Sprite(this.texture);

    /**
    * @property {array} mapData - Description.
    */
    this.mapData = [];

    /**
    * @property {Description} tileset - Description.
    */
    this.tileset = tileset;

    this.widthInTiles = 0;
    this.heightInTiles = 0;

    this.renderWidth = renderWidth;
    this.renderHeight = renderHeight;

};

Phaser.TilemapLayer.prototype = {

    create: function (width, height) {

        this.mapData = [];

        var data;

        for (var y = 0; y < height; y++)
        {
            this.mapData[y] = [];

            for (var x = 0; x < width; x++)
            {
                this.mapData[y][x] = 0;
            }
        }

        this.widthInTiles = width;
        this.heightInTiles = height;

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

    dump: function () {

        var txt = '';
        var args = [''];

        for (var y = 0; y < this.heightInTiles; y++)
        {
            for (var x = 0; x < this.widthInTiles; x++)
            {
                txt += "%c  ";

                if (this.mapData[y][x] > 0)
                {
                    args.push("background: rgb(50, 50, 50)");
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

