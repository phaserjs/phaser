
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
    
    this.frame = new Phaser.Frame(0, 0, 0, renderWidth, renderHeight, 'tilemaplayer', game.rnd.uuid());

	/**
	* @property {Description} sprite - Description.
	* @default
	*/
    this.sprite = new Phaser.Sprite(this.game, x, y, this.texture, this.frame);

    /**
    * @property {Description} tileset - Description.
    */
    this.tileset = null;

    this.tileWidth = 0;
    this.tileHeight = 0;

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

    this.tilemap;
    this.layer;

    this._x = 0;
    this._y = 0;
    this._prevX = 0;
    this._prevY = 0;
    this.dirty = true;

};

Phaser.TilemapLayer.prototype = {

    updateMapData: function (tilemap, layerID) {

        this.tilemap = tilemap;
        this.layer = this.tilemap.layers[layerID];

        this.updateMax();

    },

    updateTileset: function (tileset) {

        this.tileset = this.game.cache.getTileset(tileset);
        this.tileWidth = this.tileset.tileWidth;
        this.tileHeight = this.tileset.tileHeight;

        this.updateMax();
    },

    updateMax: function () {

        this._maxX = this.game.math.ceil(this.canvas.width / this.tileWidth) + 1;
        this._maxY = this.game.math.ceil(this.canvas.height / this.tileHeight) + 1;

        if (this.layer)
        {
            if (this._maxX > this.layer.width)
            {
                this._maxX = this.layer.width;
            }

            if (this._maxY > this.layer.height)
            {
                this._maxY = this.layer.height;
            }

            this.widthInPixels = this.layer.width * this.tileWidth;
            this.heightInPixels = this.layer.height * this.tileHeight;
        }

    },

    render: function () {

        if (this.visible == false || this.dirty == false)
        {
            return;
        }

        this._prevX = this._dx;
        this._prevY = this._dy;

        this._dx = -(this._x - (this._startX * this.tileWidth));
        this._dy = -(this._y - (this._startY * this.tileHeight));

        this._tx = this._dx;
        this._ty = this._dy;

        //  First let's just copy over the whole canvas, offset by the scroll difference

        //  Then we only need fill in the missing strip/s (could be top/bottom/left/right I guess)
        //   ScrollZone code might be useful here.

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (var y = this._startY; y < this._startY + this._maxY; y++)
        {
            this._column = this.layer.data[y];

            for (var x = this._startX; x < this._startX + this._maxX; x++)
            {
                //  only -1 on TILED maps, not CSV
                var tile = this.tileset.tiles[this._column[x]-1];

                // if (this.tileset.checkTileIndex(tile))
                // {
                    this.context.drawImage(
                        this.tileset.image,
                        tile.x,
                        tile.y,
                        this.tileWidth,
                        this.tileHeight,
                        this._tx,
                        this._ty,
                        this.tileWidth,
                        this.tileHeight
                    );
                // }

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

        this.dirty = false;

        return true;

    }

};

Phaser.TilemapLayer.prototype.deltaAbsX = function () {
    return (this.deltaX() > 0 ? this.deltaX() : -this.deltaX());
}

Phaser.TilemapLayer.prototype.deltaAbsY = function () {
    return (this.deltaY() > 0 ? this.deltaY() : -this.deltaY());
}

Phaser.TilemapLayer.prototype.deltaX = function () {
    return this._dx - this._prevX;
}

Phaser.TilemapLayer.prototype.deltaY = function () {
    return this._dy - this._prevY;
}

Object.defineProperty(Phaser.TilemapLayer.prototype, "x", {
    
    get: function () {
        return this._x;
    },

    set: function (value) {

        if (value !== this._x && value >= 0)
        {
            this._x = value;

            if (this._x > (this.widthInPixels - this.renderWidth))
            {
                this._x = this.widthInPixels - this.renderWidth;
            }

            this._startX = this.game.math.floor(this._x / this.tileWidth);

            if (this._startX < 0)
            {
                this._startX = 0;
            }

            if (this._startX + this._maxX > this.layer.width)
            {
                this._startX = this.layer.width - this._maxX;
            }

            this.dirty = true;
        }

    }

});

Object.defineProperty(Phaser.TilemapLayer.prototype, "y", {
    
    get: function () {
        return this._y;
    },

    set: function (value) {

        if (value !== this._y && value >= 0)
        {
            this._y = value;

            if (this._y > (this.heightInPixels - this.renderHeight))
            {
                this._y = this.heightInPixels - this.renderHeight;
            }

            this._startY = this.game.math.floor(this._y / this.tileHeight);

            if (this._startY < 0)
            {
                this._startY = 0;
            }

            if (this._startY + this._maxY > this.layer.height)
            {
                this._startY = this.layer.height - this._maxY;
            }

            this.dirty = true;
        }

    }

});
