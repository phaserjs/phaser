//  Maybe should extend Sprite?
Phaser.TilemapLayer = function (game, x, y, renderWidth, renderHeight, tileset, tilemap, layer) {

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
    this.sprite.fixedToCamera = true;


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

    this._results = [];

    this._tw = 0;
    this._th = 0;
    
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

    this.tilemap = null;
    this.layer = null;

    this._x = 0;
    this._y = 0;
    this._prevX = 0;
    this._prevY = 0;


    this.dirty = true;

    if (tileset instanceof Phaser.Tileset || typeof tileset === 'string')
    {
        this.updateTileset(tileset);
    }

    if (tilemap instanceof Phaser.Tilemap)
    {
        this.updateMapData(tilemap, layer);
    }

};

Phaser.TilemapLayer.prototype = {

    update: function () {

        this.x = this.game.camera.x;
        this.y = this.game.camera.y;

    },

    resizeWorld: function () {

        this.game.world.setBounds(0, 0, this.widthInPixels, this.heightInPixels);

        console.log('world', this.game.world.bounds);

    },

    updateTileset: function (tileset) {

        if (tileset instanceof Phaser.Tileset)
        {
            this.tileset = tileset;
        }
        else if (typeof tileset === 'string')
        {
            this.tileset = this.game.cache.getTileset('tiles');
        }
        else
        {
            return;
        }

        this.tileWidth = this.tileset.tileWidth;
        this.tileHeight = this.tileset.tileHeight;
        this.updateMax();

    },

    updateMapData: function (tilemap, layer) {

        if (typeof layer === 'undefined')
        {
            layer = 0;
        }

        if (tilemap instanceof Phaser.Tilemap)
        {
            this.tilemap = tilemap;
            this.layer = this.tilemap.layers[layer];
            this.updateMax();
        }

    },

    /**
    * 
    * @method getTileOverlaps
    * @param {GameObject} object - Tiles you want to get that overlaps this.
    * @return {array} Array with tiles informations (each contains x, y, and the tile).
    */
    getTiles: function (x, y, width, height, collides) {

        if (this.tilemap === null)
        {
            return;
        }

        //  Should we only get tiles that have at least one of their collision flags set? (true = yes, false = no just get them all)
        if (typeof collides === 'undefined') { collides = false; }

        //  Cap the values

        if (x < 0)
        {
            x = 0;
        }

        if (y < 0)
        {
            y = 0;
        }

        if (width > this.widthInPixels)
        {
            width = this.widthInPixels;
        }

        if (height > this.heightInPixels)
        {
            height = this.heightInPixels;
        }

        var tileWidth = this.tileWidth * this.sprite.scale.x;
        var tileHeight = this.tileHeight * this.sprite.scale.y;

        //  Convert the pixel values into tile coordinates
        this._tx = this.game.math.snapToFloor(x, tileWidth) / tileWidth;
        this._ty = this.game.math.snapToFloor(y, tileHeight) / tileHeight;
        this._tw = (this.game.math.snapToCeil(width, tileWidth) + tileWidth) / tileWidth;
        this._th = (this.game.math.snapToCeil(height, tileHeight) + tileHeight) / tileHeight;

        this._results.length = 0;

        this._results.push( { x: x, y: y, width: width, height: height, tx: this._tx, ty: this._ty, tw: this._tw, th: this._th });

        var _index = 0;
        var _tile = null;
        var sx = 0;
        var sy = 0;

        for (var wy = this._ty; wy < this._ty + this._th; wy++)
        {
            for (var wx = this._tx; wx < this._tx + this._tw; wx++)
            {
                if (this.layer.data[wy] && this.layer.data[wy][wx])
                {
                    //  Could combine
                    _index = this.layer.data[wy][wx] - 1;
                    _tile = this.tileset.getTile(_index);

                    sx = _tile.width * this.sprite.scale.x;
                    sy = _tile.height * this.sprite.scale.y;

                    if (collides == false || (collides && _tile.collideNone == false))
                    {
                        // this._results.push({ x: wx * _tile.width, right: (wx * _tile.width) + _tile.width, y: wy * _tile.height, bottom: (wy * _tile.height) + _tile.height, width: _tile.width, height: _tile.height, tx: wx, ty: wy, tile: _tile });
                        this._results.push({ x: wx * sx, right: (wx * sx) + sx, y: wy * sy, bottom: (wy * sy) + sy, width: sx, height: sy, tx: wx, ty: wy, tile: _tile });
                    }
                }
            }
        }

        return this._results;

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

        this.dirty = true;

    },

    render: function () {

        if (!this.dirty || !this.tileset || !this.tilemap || !this.sprite.visible)
        {
            return;
        }

        this._prevX = this._dx;
        this._prevY = this._dy;

        this._dx = -(this._x - (this._startX * this.tileWidth));
        this._dy = -(this._y - (this._startY * this.tileHeight));

        this._tx = this._dx;
        this._ty = this._dy;

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
                        Math.floor(this._tx),
                        Math.floor(this._ty),
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
