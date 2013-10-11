
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
    this.tileset = null;

    this.tileWidth = 0;
    this.tileHeight = 0;

    this.widthInTiles = 0;
    this.heightInTiles = 0;

    this.renderWidth = renderWidth;
    this.renderHeight = renderHeight;

    /**
    * @property {number} _ga - Local render loop var to help avoid gc spikes.
    * @private 
    */
    this._ga = 1;
    
    /**
    * @property {number} _dx - Local render loop var to help avoid gc spikes.
    * @private 
    */
    this._dx = 0;
    
    /**
    * @property {number} _dy - Local render loop var to help avoid gc spikes.
    * @private 
    */
    this._dy = 0;
    
    /**
    * @property {number} _dw - Local render loop var to help avoid gc spikes.
    * @private 
    */
    this._dw = 0;
    
    /**
    * @property {number} _dh - Local render loop var to help avoid gc spikes.
    * @private 
    */
    this._dh = 0;
    
    /**
    * @property {number} _tx - Local render loop var to help avoid gc spikes.
    * @private 
    */
    this._tx = 0;
    
    /**
    * @property {number} _ty - Local render loop var to help avoid gc spikes.
    * @private 
    */
    this._ty = 0;
    
    /**
    * @property {number} _tl - Local render loop var to help avoid gc spikes.
    * @private 
    */
    this._tl = 0;
    
    /**
    * @property {number} _maxX - Local render loop var to help avoid gc spikes.
    * @private 
    */
    this._maxX = 0;
    
    /**
    * @property {number} _maxY - Local render loop var to help avoid gc spikes.
    * @private 
    */
    this._maxY = 0;
    
    /**
    * @property {number} _startX - Local render loop var to help avoid gc spikes.
    * @private 
    */
    this._startX = 0;
    
    /**
    * @property {number} _startY - Local render loop var to help avoid gc spikes.
    * @private 
    */
    this._startY = 0;

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

    updateTileset: function (tileset) {

        this.tileset = this.game.cache.getTileset(tileset);
        this.tileWidth = this.tileset.tileWidth;
        this.tileHeight = this.tileset.tileHeight;

    },

    render: function () {

        if (this.visible == false)
        {
            return;
        }

        //  Work out how many tiles we can fit into our canvas and round it up for the edges
        this._maxX = this.game.math.ceil(this.canvas.width / this.tileWidth) + 1;
        this._maxY = this.game.math.ceil(this.canvas.height / this.tileHeight) + 1;

        //  And now work out where in the tilemap the camera actually is
        this._startX = this.game.math.floor(this.game.camera.x / this.tileWidth);
        this._startY = this.game.math.floor(this.game.camera.y / this.tileHeight);

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
        this._dx = -(this.game.camera.x - (this._startX * this.tileWidth));
        this._dy = -(this.game.camera.y - (this._startY * this.tileHeight));

        this._tx = this._dx;
        this._ty = this._dy;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (var row = this._startY; row < this._startY + this._maxY; row++)
        {
            this._columnData = this.mapData[row];

            for (var tile = this._startX; tile < this._startX + this._maxX; tile++)
            {
                if (this.tileset.checkTileIndex(this._columnData[tile]))
                {
                    this.context.drawImage(
                        this.tileset.image,
                        this.tileset.tiles[this._columnData[tile]].x,
                        this.tileset.tiles[this._columnData[tile]].y,
                        this.tileWidth,
                        this.tileHeight,
                        this._tx,
                        this._ty,
                        this.tileWidth,
                        this.tileHeight
                    );
                }

                this._tx += this.tileWidth;

            }

            this._tx = this._dx;
            this._ty += this.tileHeight;
        }

        //  Only needed if running in WebGL, otherwise this array will never get cleared down I don't think!
        if (this.game.renderType == Phaser.WEBGL)
        {
            PIXI.texturesToUpdate.push(this.baseTexture);
        }

        return true;

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

