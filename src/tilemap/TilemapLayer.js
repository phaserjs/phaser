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
    
    this.textureFrame = new Phaser.Frame(0, 0, 0, renderWidth, renderHeight, 'tilemaplayer', game.rnd.uuid());

    Phaser.Sprite.call(this, this.game, x, y, this.texture, this.textureFrame);

    this.type = Phaser.TILEMAPLAYER;

    this.fixedToCamera = true;

    /**
    * @property {Description} tileset - Description.
    */
    this.tileset = null;

    this.tileWidth = 0;
    this.tileHeight = 0;
    this.tileMargin = 0;
    this.tileSpacing = 0;

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

    /**
    * @property {number} scrollFactorX - speed at which this layer scrolls
	* horizontally, relative to the camera (e.g. scrollFactorX of 0.5 scrolls
	* half as quickly as the 'normal' camera-locked layers do)
	* @default 1
    */
	this.scrollFactorX = 1;
    /**
    * @property {number} scrollFactorY - speed at which this layer scrolls
	* vertically, relative to the camera (e.g. scrollFactorY of 0.5 scrolls
	* half as quickly as the 'normal' camera-locked layers do)
	* @default 1
    */
	this.scrollFactorY = 1;

    this.tilemap = null;
    this.layer = null;
    this.index = 0;

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

Phaser.TilemapLayer.prototype = Object.create(Phaser.Sprite.prototype);
Phaser.TilemapLayer.prototype = Phaser.Utils.extend(true, Phaser.TilemapLayer.prototype, Phaser.Sprite.prototype, PIXI.Sprite.prototype);
Phaser.TilemapLayer.prototype.constructor = Phaser.TilemapLayer;


Phaser.TilemapLayer.prototype.update = function () {

    this.scrollX = this.game.camera.x * this.scrollFactorX;
    this.scrollY = this.game.camera.y * this.scrollFactorY;

    this.render();

}

Phaser.TilemapLayer.prototype.resizeWorld = function () {

    this.game.world.setBounds(0, 0, this.widthInPixels, this.heightInPixels);

}

Phaser.TilemapLayer.prototype.updateTileset = function (tileset) {

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
    this.tileMargin = this.tileset.tileMargin;
    this.tileSpacing = this.tileset.tileSpacing;

    this.updateMax();

}

Phaser.TilemapLayer.prototype.updateMapData = function (tilemap, layer) {

    if (typeof layer === 'undefined')
    {
        layer = 0;
    }

    if (tilemap instanceof Phaser.Tilemap)
    {
        this.tilemap = tilemap;
        this.layer = this.tilemap.layers[layer];
        this.index = layer;
        this.updateMax();
        this.tilemap.dirty = true;
    }

}

/**
 * Take an x coordinate that doesn't account for scrollFactorY and 'fix' it 
 * into a scrolled local space. Used primarily internally
 * @param {number} x - x coordinate in camera space
 * @return {number} x coordinate in scrollFactor-adjusted dimensions
 */
Phaser.TilemapLayer.prototype._fixX = function( x )
{
	if( this.scrollFactorX === 1 )
		return x;
	var left_edge = x - (this._x / this.scrollFactorX);
	return this._x + left_edge;
};
/**
 * Take an x coordinate that _does_ account for scrollFactorY and 'unfix' it 
 * back to camera space. Used primarily internally
 * @param {number} x - x coordinate in scrollFactor-adjusted dimensions
 * @return {number} x coordinate in camera space
 */
Phaser.TilemapLayer.prototype._unfixX = function( x )
{
	if( this.scrollFactorX === 1 )
		return x;
	var left_edge = x - this._x;
	return (this._x / this.scrollFactorX) + left_edge;
};
/**
 * Take a y coordinate that doesn't account for scrollFactorY and 'fix' it 
 * into a scrolled local space. Used primarily internally
 * @param {number} y - y coordinate in camera space
 * @return {number} y coordinate in scrollFactor-adjusted dimensions
 */
Phaser.TilemapLayer.prototype._fixY = function( y )
{
	if( this.scrollFactorY === 1 )
		return y;
	var top_edge = y - (this._y / this.scrollFactorY);
	return this._y + top_edge;
};
/**
 * Take a y coordinate that _does_ account for scrollFactorY and 'unfix' it 
 * back to camera space. Used primarily internally
 * @param {number} y - y coordinate in scrollFactor-adjusted dimensions
 * @return {number} y coordinate in camera space
 */
Phaser.TilemapLayer.prototype._unfixY = function( y )
{
	if( this.scrollFactorY === 1 )
		return y;
	var top_edge = y - this._y;
	return (this._y / this.scrollFactorY) + top_edge;
};

/**
* Convert a pixel value to a tile coordinate.
* @param {number} x - X position of the point in target tile.
* @param {number} [layer] - layer of this tile located.
* @return {number} The tile with specific properties.
*/
Phaser.TilemapLayer.prototype.getTileX = function (x) {

    var tileWidth = this.tileWidth * this.scale.x;

	return this.game.math.snapToFloor(this._fixX(x), tileWidth) / tileWidth;

}

/**
* Convert a pixel value to a tile coordinate.
* @param {number} x - X position of the point in target tile.
* @param {number} [layer] - layer of this tile located.
* @return {number} The tile with specific properties.
*/
Phaser.TilemapLayer.prototype.getTileY = function (y) {

    var tileHeight = this.tileHeight * this.scale.y;

	return this.game.math.snapToFloor(this._fixY(y), tileHeight) / tileHeight;

}

Phaser.TilemapLayer.prototype.getTileXY = function (x, y, point) {

    point.x = this.getTileX(x);
    point.y = this.getTileY(y);

    return point;

}

/**
* 
* @method getTileOverlaps
* @param {GameObject} object - Tiles you want to get that overlaps this.
* @return {array} Array with tiles informations (each contains x, y, and the tile).
*/
Phaser.TilemapLayer.prototype.getTiles = function (x, y, width, height, collides) {

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

	// adjust the x,y coordinates for scrollFactor
	x = this._fixX( x );
	y = this._fixY( y );

    if (width > this.widthInPixels)
    {
        width = this.widthInPixels;
    }

    if (height > this.heightInPixels)
    {
        height = this.heightInPixels;
    }

    var tileWidth = this.tileWidth * this.scale.x;
    var tileHeight = this.tileHeight * this.scale.y;

    //  Convert the pixel values into tile coordinates
    this._tx = this.game.math.snapToFloor(x, tileWidth) / tileWidth;
    this._ty = this.game.math.snapToFloor(y, tileHeight) / tileHeight;
    this._tw = (this.game.math.snapToCeil(width, tileWidth) + tileWidth) / tileWidth;
    this._th = (this.game.math.snapToCeil(height, tileHeight) + tileHeight) / tileHeight;

    //  This should apply the layer x/y here

    // this._results.length = 0;
    this._results = [];

    //  pretty sure we don't use this any more?
    // this._results.push( { x: x, y: y, width: width, height: height, tx: this._tx, ty: this._ty, tw: this._tw, th: this._th });

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

                sx = _tile.width * this.scale.x;
                sy = _tile.height * this.scale.y;

                if (collides == false || (collides && _tile.collideNone == false))
                {
					// convert tile coordinates back to camera space for return
					var _wx = this._unfixX( wx*sx ) / tileWidth;
					var _wy = this._unfixY( wy*sy ) / tileHeight;
                    this._results.push({ x: _wx * sx, right: (_wx * sx) + sx, y: _wy * sy, bottom: (_wy * sy) + sy, width: sx, height: sy, tx: _wx, ty: _wy, tile: _tile });
                }
            }
        }
    }

    return this._results;

}

Phaser.TilemapLayer.prototype.updateMax = function () {

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

}

Phaser.TilemapLayer.prototype.render = function () {

    if (this.tilemap && this.tilemap.dirty)
    {
        this.dirty = true;
    }

    if (!this.dirty || !this.tileset || !this.tilemap || !this.visible)
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

            if (tile)
            {
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

    this.dirty = false;

    if (this.tilemap.dirty)
    {
        this.tilemap.dirty = false;
    }

    return true;

}

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

Object.defineProperty(Phaser.TilemapLayer.prototype, "scrollX", {
    
    get: function () {
        return this._x;
    },

    set: function (value) {

        if (value !== this._x && value >= 0 && this.layer)
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

Object.defineProperty(Phaser.TilemapLayer.prototype, "scrollY", {
    
    get: function () {
        return this._y;
    },

    set: function (value) {

        if (value !== this._y && value >= 0 && this.layer)
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
