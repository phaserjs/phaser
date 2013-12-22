/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Tilemap Layer is a set of map data combined with a Tileset in order to render that data to the game.
*
* @class Phaser.TilemapLayer
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
* @param {Phaser.Tilemap} tilemap - The tilemap to which this layer belongs.
* @param {number} index - The layer index within the map that this TilemapLayer represents.
* @param {number} width - Width of the renderable area of the layer.
* @param {number} height - Height of the renderable area of the layer.
*/
Phaser.TilemapLayer = function (game, tilemap, index, width, height) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

    /**
    * @property {Phaser.Tilemap} map - The Tilemap to which this layer is bound.
    */
    this.map = tilemap;

    /**
    * @property {number} index - The index of this layer within the Tilemap.
    */
    this.index = index;

    /**
    * @property {object} layer - The layer object within the Tilemap that this layer represents.
    */
    this.layer = tilemap.layers[index];

    /**
    * @property {HTMLCanvasElement} canvas - The canvas to which this TilemapLayer draws.
    */
    this.canvas = Phaser.Canvas.create(width, height);
    
    /**
    * @property {CanvasRenderingContext2D} context - The 2d context of the canvas.
    */
    this.context = this.canvas.getContext('2d');
    
    /**
    * @property {PIXI.BaseTexture} baseTexture - Required Pixi var.
    */
    this.baseTexture = new PIXI.BaseTexture(this.canvas);
    
    /**
    * @property {PIXI.Texture} texture - Required Pixi var.
    */
    this.texture = new PIXI.Texture(this.baseTexture);
    
    /**
    * @property {Phaser.Frame} textureFrame - Dimensions of the renderable area.
    */
    this.textureFrame = new Phaser.Frame(0, 0, 0, width, height, 'tilemapLayer', game.rnd.uuid());

    Phaser.Sprite.call(this, this.game, 0, 0, this.texture, this.textureFrame);

    /**
    * @property {string} name - The name of the layer.
    */
    this.name = '';

    /**
    * @property {number} type - The const type of this object.
    * @default
    */
    this.type = Phaser.TILEMAPLAYER;

    /**
    * An object that is fixed to the camera ignores the position of any ancestors in the display list and uses its x/y coordinates as offsets from the top left of the camera.
    * @property {boolean} fixedToCamera - Fixes this object to the Camera.
    * @default
    */
    this.fixedToCamera = true;

    /**
    * @property {Phaser.Point} cameraOffset - If this object is fixed to the camera then use this Point to specify how far away from the Camera x/y it's rendered.
    */
    this.cameraOffset = new Phaser.Point(0, 0);

    /**
    * @property {string} tileColor - If no tile set is given the tiles will be rendered as rectangles in this color. Provide in hex or rgb/rgba string format.
    * @default
    */
    this.tileColor = 'rgb(255, 255, 255)';

    /**
    * @property {boolean} debug - If set to true the collideable tile edges path will be rendered.
    * @default
    */
    this.debug = false;

    /**
    * @property {number} debugAlpha - If debug is true then the tileset is rendered with this alpha level, to make the tile edges clearer.
    * @default
    */
    this.debugAlpha = 0.5;

    /**
    * @property {string} debugColor - If debug is true this is the color used to outline the edges of collidable tiles. Provide in hex or rgb/rgba string format.
    * @default
    */
    this.debugColor = 'rgba(0, 255, 0, 1)';

    /**
    * @property {boolean} debugFill - If true the debug tiles are filled with debugFillColor AND stroked around.
    * @default
    */
    this.debugFill = false;

    /**
    * @property {string} debugFillColor - If debugFill is true this is the color used to fill the tiles. Provide in hex or rgb/rgba string format.
    * @default
    */
    this.debugFillColor = 'rgba(0, 255, 0, 0.2)';

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

    /**
    * @property {boolean} dirty - Flag controlling when to re-render the layer.
    */
    this.dirty = true;

    /**
    * @property {number} _cw - Local collision var.
    * @private 
    */
    this._cw = tilemap.tileWidth;

    /**
    * @property {number} _ch - Local collision var.
    * @private 
    */
    this._ch = tilemap.tileHeight;

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
    * @property {number} _tw - Local render loop var to help avoid gc spikes.
    * @private 
    */
    this._tw = 0;

    /**
    * @property {number} _th - Local render loop var to help avoid gc spikes.
    * @private 
    */
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
    * @property {array} _results - Local render loop var to help avoid gc spikes.
    * @private 
    */
    this._results = [];

    /**
    * @property {number} _x - Private var.
    * @private 
    */
    this._x = 0;

    /**
    * @property {number} _y - Private var.
    * @private 
    */
    this._y = 0;

    /**
    * @property {number} _prevX - Private var.
    * @private 
    */
    this._prevX = 0;

    /**
    * @property {number} _prevY - Private var.
    * @private 
    */
    this._prevY = 0;

    this.updateMax();

};

Phaser.TilemapLayer.prototype = Object.create(Phaser.Sprite.prototype);
Phaser.TilemapLayer.prototype = Phaser.Utils.extend(true, Phaser.TilemapLayer.prototype, Phaser.Sprite.prototype, PIXI.Sprite.prototype);
Phaser.TilemapLayer.prototype.constructor = Phaser.TilemapLayer;

/**
* Automatically called by World.postUpdate. Handles cache updates.
*
* @method Phaser.TilemapLayer#postUpdate
* @memberof Phaser.TilemapLayer
*/
Phaser.TilemapLayer.prototype.postUpdate = function () {

	Phaser.Sprite.prototype.postUpdate.call(this);
	
    //  Stops you being able to auto-scroll the camera if it's not following a sprite
    this.scrollX = this.game.camera.x * this.scrollFactorX;
    this.scrollY = this.game.camera.y * this.scrollFactorY;

    this.render();

}

/**
* Sets the world size to match the size of this layer.
*
* @method Phaser.TilemapLayer#resizeWorld
* @memberof Phaser.TilemapLayer
*/
Phaser.TilemapLayer.prototype.resizeWorld = function () {

    this.game.world.setBounds(0, 0, this.layer.widthInPixels * 4, this.layer.heightInPixels);

}

/**
* Take an x coordinate that doesn't account for scrollFactorX and 'fix' it 
* into a scrolled local space. Used primarily internally
* @method Phaser.TilemapLayer#_fixX
* @memberof Phaser.TilemapLayer
* @private
* @param {number} x - x coordinate in camera space
* @return {number} x coordinate in scrollFactor-adjusted dimensions
*/
Phaser.TilemapLayer.prototype._fixX = function(x) {

    if (x < 0)
    {
        x = 0;
    }

    if (this.scrollFactorX === 1)
    {
        return x;
    }

    return this._x + (x - (this._x / this.scrollFactorX));

}

/**
* Take an x coordinate that _does_ account for scrollFactorX and 'unfix' it 
* back to camera space. Used primarily internally
* @method Phaser.TilemapLayer#_unfixX
* @memberof Phaser.TilemapLayer
* @private
* @param {number} x - x coordinate in scrollFactor-adjusted dimensions
* @return {number} x coordinate in camera space
*/
Phaser.TilemapLayer.prototype._unfixX = function(x) {

    if (this.scrollFactorX === 1)
    {
        return x;
    }

    return (this._x / this.scrollFactorX) + (x - this._x);

}

/**
* Take a y coordinate that doesn't account for scrollFactorY and 'fix' it 
* into a scrolled local space. Used primarily internally
* @method Phaser.TilemapLayer#_fixY
* @memberof Phaser.TilemapLayer
* @private
* @param {number} y - y coordinate in camera space
* @return {number} y coordinate in scrollFactor-adjusted dimensions
*/
Phaser.TilemapLayer.prototype._fixY = function(y) {

    if (y < 0)
    {
        y = 0;
    }

    if (this.scrollFactorY === 1)
    {
        return y;
    }

    return this._y + (y - (this._y / this.scrollFactorY));

}

/**
* Take a y coordinate that _does_ account for scrollFactorY and 'unfix' it 
* back to camera space. Used primarily internally
* @method Phaser.TilemapLayer#_unfixY
* @memberof Phaser.TilemapLayer
* @private
* @param {number} y - y coordinate in scrollFactor-adjusted dimensions
* @return {number} y coordinate in camera space
*/
Phaser.TilemapLayer.prototype._unfixY = function(y) {

    if (this.scrollFactorY === 1)
    {
        return y;
    }

    return (this._y / this.scrollFactorY) + (y - this._y);

}

/**
* Convert a pixel value to a tile coordinate.
* @method Phaser.TilemapLayer#getTileX
* @memberof Phaser.TilemapLayer
* @param {number} x - X position of the point in target tile.
* @return {Phaser.Tile} The tile with specific properties.
*/
Phaser.TilemapLayer.prototype.getTileX = function (x) {

    // var tileWidth = this.tileWidth * this.scale.x;

    return this.game.math.snapToFloor(this._fixX(x), this.map.tileWidth) / this.map.tileWidth;

}

/**
* Convert a pixel value to a tile coordinate.
* @method Phaser.TilemapLayer#getTileY
* @memberof Phaser.TilemapLayer
* @param {number} y - Y position of the point in target tile.
* @return {Phaser.Tile} The tile with specific properties.
*/
Phaser.TilemapLayer.prototype.getTileY = function (y) {

    // var tileHeight = this.tileHeight * this.scale.y;

    return this.game.math.snapToFloor(this._fixY(y), this.map.tileHeight) / this.map.tileHeight;

}

/**
* Convert a pixel value to a tile coordinate.
* @method Phaser.TilemapLayer#getTileXY
* @memberof Phaser.TilemapLayer
* @param {number} x - X position of the point in target tile.
* @param {number} y - Y position of the point in target tile.
* @param {Phaser.Point|object} point - The Point object to set the x and y values on.
* @return {Phaser.Point|object} A Point object with its x and y properties set.
*/
Phaser.TilemapLayer.prototype.getTileXY = function (x, y, point) {

    point.x = this.getTileX(x);
    point.y = this.getTileY(y);

    return point;

}

/**
* Get all tiles that exist within the given area, defined by the top-left corner, width and height. Values given are in pixels, not tiles.
* @method Phaser.TilemapLayer#getTiles
* @memberof Phaser.TilemapLayer
* @param {number} x - X position of the top left corner.
* @param {number} y - Y position of the top left corner.
* @param {number} width - Width of the area to get.
* @param {number} height - Height of the area to get.
* @param {boolean} [collides=false] - If true only return tiles that collide on one or more faces.
* @return {array} Array with tiles informations (each contains x, y, and the tile).
*/
Phaser.TilemapLayer.prototype.getTiles = function (x, y, width, height, collides) {

    //  Should we only get tiles that have at least one of their collision flags set? (true = yes, false = no just get them all)
    if (typeof collides === 'undefined') { collides = false; }

    // adjust the x,y coordinates for scrollFactor
    x = this._fixX(x);
    y = this._fixY(y);

    if (width > this.layer.widthInPixels)
    {
        width = this.layer.widthInPixels;
    }

    if (height > this.layer.heightInPixels)
    {
        height = this.layer.heightInPixels;
    }

    //  Convert the pixel values into tile coordinates
    this._tx = this.game.math.snapToFloor(x, this._cw) / this._cw;
    this._ty = this.game.math.snapToFloor(y, this._ch) / this._ch;
    this._tw = (this.game.math.snapToCeil(width, this._cw) + this._cw) / this._cw;
    this._th = (this.game.math.snapToCeil(height, this._ch) + this._ch) / this._ch;

    //  This should apply the layer x/y here
    this._results.length = 0;

    var _tile = null;

    for (var wy = this._ty; wy < this._ty + this._th; wy++)
    {
        for (var wx = this._tx; wx < this._tx + this._tw; wx++)
        {
            if (this.layer.data[wy] && this.layer.data[wy][wx])
            {
                _tile = this.layer.data[wy][wx];
        
                if (_tile)
                {
                    if (collides === false || (collides && _tile.collides))
                    {
                        // convert tile coordinates back to camera space for return
                        var _wx = this._unfixX(wx * this._cw) / this._cw;
                        var _wy = this._unfixY(wy * this._ch) / this._ch;

                        this._results.push({ 
                            x: _wx * this._cw, 
                            y: _wy * this._ch, 
                            right: (_wx * this._cw) + this._cw, 
                            bottom: (_wy * this._ch) + this._ch, 
                            tile: _tile 
                        });
                    }
                }
            }
        }
    }

    return this._results;

}

/**
* Get all tiles that exist within the given area, defined by the top-left corner, width and height. Values given are in pixels, not tiles.
* This function also draws to the context all of the debug areas.
* @method Phaser.TilemapLayer#debugGetTiles
* @memberof Phaser.TilemapLayer
* @param {number} x - X position of the top left corner.
* @param {number} y - Y position of the top left corner.
* @param {number} width - Width of the area to get.
* @param {number} height - Height of the area to get.
* @param {boolean} [collides=false] - If true only return tiles that collide on one or more faces.
* @return {array} Array with tiles informations (each contains x, y, and the tile).
Phaser.TilemapLayer.prototype.debugGetTiles = function (x, y, width, height, collides) {

    if (this.tilemap === null)
    {
        return;
    }

    //  Should we only get tiles that have at least one of their collision flags set? (true = yes, false = no just get them all)
    if (typeof collides === 'undefined') { collides = false; }
    if (typeof debug === 'undefined') { debug = false; }

    // adjust the x,y coordinates for scrollFactor
    x = this._fixX(x);
    y = this._fixY(y);

    if (width > this.widthInPixels)
    {
        width = this.widthInPixels;
    }

    if (height > this.heightInPixels)
    {
        height = this.heightInPixels;
    }

    if (debug)
    {
        console.log('x', x, 'y', y, 'w', width, 'h', height);
    }

    // this.context.fillStyle = 'rgba(255,0,255,0.5)';
    // this.context.fillRect(x, y, width, height);

    var tileWidth = this.tileWidth * this.scale.x;
    var tileHeight = this.tileHeight * this.scale.y;

    //  Convert the pixel values into tile coordinates
    this._tx = this.game.math.snapToFloor(x, tileWidth) / tileWidth;
    this._ty = this.game.math.snapToFloor(y, tileHeight) / tileHeight;
    this._tw = (this.game.math.snapToCeil(width, tileWidth) + tileWidth) / tileWidth;
    this._th = (this.game.math.snapToCeil(height, tileHeight) + tileHeight) / tileHeight;

    if (debug)
    {
        console.log('tx', this._tx, 'ty', this._ty, 'tw', this._tw, 'th', this._th);
    }

    // this.context.fillRect(this._tx * tileWidth, this._ty * tileHeight, this._tw * tileWidth, this._th * tileHeight);

    //  This should apply the layer x/y here
    this._results.length = 0;

    var _index = 0;
    var _tile = null;
    var sx = 0;
    var sy = 0;

    this.context.fillStyle = 'rgba(255,0,0,1)';
    // this.context.strokeStyle = 'rgba(0,0,0,1)';

    for (var wy = this._ty; wy < this._ty + this._th; wy++)
    {
        if (debug)
        {
            console.log('wy', wy);
        }

        for (var wx = this._tx; wx < this._tx + this._tw; wx++)
        {
            if (debug)
            {
                console.log('wx', wx);
            }

            if (this.layer.data[wy] && this.layer.data[wy][wx])
            {
                //  Could combine
                // _index = this.layer.data[wy][wx] - 1;
                // _tile = this.tileset.getTile(_index);
                _tile = this.layer.data[wy][wx];
        
                if (debug)
                {
                    console.log('tile', _tile);
                }

                if (_tile)
                {

                    // sx = _tile.width * this.scale.x;
                    // sy = _tile.height * this.scale.y;
                    sx = this.tileWidth * this.scale.x;
                    sy = this.tileHeight * this.scale.y;

                    if (collides === false || (collides && _tile.collides))
                    {
                        if (debug)
                        {
                            this.context.fillRect(_tile.x * this.tileWidth, _tile.y * this.tileHeight, this.tileWidth, this.tileHeight);
                        }

                        // this.context.strokeRect(_tile.x * this.tileWidth, _tile.y * this.tileHeight, this.tileWidth, this.tileHeight);

                        // convert tile coordinates back to camera space for return
                        var _wx = this._unfixX(wx * sx) / this.tileWidth;
                        var _wy = this._unfixY(wy * sy) / this.tileHeight;

                        this._results.push({ 
                            x: _wx * sx, 
                            y: _wy * sy, 
                            width: sx, 
                            height: sy, 
                            right: (_wx * sx) + sx, 
                            bottom: (_wy * sy) + sy, 
                            tx: _wx, 
                            ty: _wy, 
                            tile: _tile 
                        });
                    }

                }

            }
        }
    }

    return this._results;

}
*/

/**
* Internal function to update maximum values.
* @method Phaser.TilemapLayer#updateMax
* @memberof Phaser.TilemapLayer
*/
Phaser.TilemapLayer.prototype.updateMax = function () {

    this._maxX = this.game.math.ceil(this.canvas.width / this.map.tileWidth) + 1;
    this._maxY = this.game.math.ceil(this.canvas.height / this.map.tileHeight) + 1;

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
    }

    this.dirty = true;

    // console.log('updateMax', this._maxX, this._maxY, 'px', this.layer.widthInPixels, this.layer.heightInPixels, 'rwh', this.layer.width, this.layer.height);

}

/**
* Renders the tiles to the layer canvas and pushes to the display.
* @method Phaser.TilemapLayer#render
* @memberof Phaser.TilemapLayer
*/
Phaser.TilemapLayer.prototype.render = function () {

	if (this.layer.dirty)
    {
        this.dirty = true;
    }

    if (!this.dirty || !this.visible)
    {
        return;
    }

    this._prevX = this._dx;
    this._prevY = this._dy;

    this._dx = -(this._x - (this._startX * this.map.tileWidth));
    this._dy = -(this._y - (this._startY * this.map.tileHeight));

    this._tx = this._dx;
    this._ty = this._dy;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = this.tileColor;

    var tile;
    var set;
    var ox = 0;
    var oy = 0;

    if (this.debug)
    {
        this.context.globalAlpha = this.debugAlpha;
    }

    for (var y = this._startY, lenY = this._startY + this._maxY; y < lenY; y++)
    {
        this._column = this.layer.data[y];

        for (var x = this._startX, lenX = this._startX + this._maxX; x < lenX; x++)
        {
            if (this._column[x])
            {
                tile = this._column[x];

                if (this.map.tiles[tile.index])
                {
                    set = this.map.tilesets[this.map.tiles[tile.index][2]]

                    if (set.image)
                    {
                        if (set.tileWidth !== this.map.tileWidth || set.tileHeight !== this.map.tileHeight)
                        {
                            //  TODO: Smaller sized tile check
                            this.context.drawImage(
                                this.map.tilesets[this.map.tiles[tile.index][2]].image,
                                this.map.tiles[tile.index][0],
                                this.map.tiles[tile.index][1],
                                set.tileWidth,
                                set.tileHeight,
                                Math.floor(this._tx),
                                Math.floor(this._ty) - (set.tileHeight - this.map.tileHeight),
                                set.tileWidth,
                                set.tileHeight
                            );
                        }
                        else
                        {
                            this.context.drawImage(
                                this.map.tilesets[this.map.tiles[tile.index][2]].image,
                                this.map.tiles[tile.index][0],
                                this.map.tiles[tile.index][1],
                                this.map.tileWidth,
                                this.map.tileHeight,
                                Math.floor(this._tx),
                                Math.floor(this._ty),
                                this.map.tileWidth,
                                this.map.tileHeight
                            );
                        }
                    }
                    else
                    {
                        this.context.fillRect(Math.floor(this._tx), Math.floor(this._ty), this.map.tileWidth, this.map.tileHeight);
                    }
                }
            }

            this._tx += this.map.tileWidth;

        }

        this._tx = this._dx;
        this._ty += this.map.tileHeight;

    }

    if (this.debug)
    {
        this.context.globalAlpha = 1;
        this.renderDebug();
    }

    //  Only needed if running in WebGL, otherwise this array will never get cleared down I don't think!
    if (this.game.renderType === Phaser.WEBGL)
    {
        PIXI.texturesToUpdate.push(this.baseTexture);
    }

    this.dirty = false;
    this.layer.dirty = false;

    return true;

}

/**
* Renders a collision debug overlay on-top of the canvas. Called automatically by render when debug = true.
* @method Phaser.TilemapLayer#renderDebug
* @memberof Phaser.TilemapLayer
*/
Phaser.TilemapLayer.prototype.renderDebug = function () {

    this._tx = this._dx;
    this._ty = this._dy;

    this.context.strokeStyle = this.debugColor;
    this.context.fillStyle = this.debugFillColor;

    for (var y = this._startY, lenY = this._startY + this._maxY; y < lenY; y++)
    {
        this._column = this.layer.data[y];

        for (var x = this._startX, lenX = this._startX + this._maxX; x < lenX; x++)
        {
            var tile = this._column[x];

            if (tile && (tile.faceTop || tile.faceBottom || tile.faceLeft || tile.faceRight))
            {
                this._tx = Math.floor(this._tx);

                if (this.debugFill)
                {
                    this.context.fillRect(this._tx, this._ty, this._cw, this._ch);
                }

                this.context.beginPath();

                if (tile.faceTop)
                {
                    this.context.moveTo(this._tx, this._ty);
                    this.context.lineTo(this._tx + this._cw, this._ty);
                }

                if (tile.faceBottom)
                {
                    this.context.moveTo(this._tx, this._ty + this._ch);
                    this.context.lineTo(this._tx + this._cw, this._ty + this._ch);
                }

                if (tile.faceLeft)
                {
                    this.context.moveTo(this._tx, this._ty);
                    this.context.lineTo(this._tx, this._ty + this._ch);
                }

                if (tile.faceRight)
                {
                    this.context.moveTo(this._tx + this._cw, this._ty);
                    this.context.lineTo(this._tx + this._cw, this._ty + this._ch);
                }

                this.context.stroke();
            }

            this._tx += this.map.tileWidth;

        }

        this._tx = this._dx;
        this._ty += this.map.tileHeight;

    }

}

/**
* @name Phaser.TilemapLayer#scrollX
* @property {number} scrollX - Scrolls the map horizontally or returns the current x position.
*/
Object.defineProperty(Phaser.TilemapLayer.prototype, "scrollX", {
    
    get: function () {
        return this._x;
    },

    set: function (value) {

        // if (value !== this._x && value >= 0 && this.layer && this.layer.widthInPixels > this.width)
        if (value !== this._x && value >= 0 && this.layer.widthInPixels > this.width)
        {
            this._x = value;
    
            if (this._x > (this.layer.widthInPixels - this.width))
            {
                this._x = this.layer.widthInPixels - this.width;
            }

            this._startX = this.game.math.floor(this._x / this.map.tileWidth);

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

/**
* @name Phaser.TilemapLayer#scrollY
* @property {number} scrollY - Scrolls the map vertically or returns the current y position.
*/
Object.defineProperty(Phaser.TilemapLayer.prototype, "scrollY", {
    
    get: function () {
        return this._y;
    },

    set: function (value) {

        // if (value !== this._y && value >= 0 && this.layer && this.heightInPixels > this.renderHeight)
        if (value !== this._y && value >= 0 && this.layer.heightInPixels > this.height)
        {
            this._y = value;

            if (this._y > (this.layer.heightInPixels - this.height))
            {
                this._y = this.layer.heightInPixels - this.height;
            }

            this._startY = this.game.math.floor(this._y / this.map.tileHeight);

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

/**
* @name Phaser.TilemapLayer#collisionWidth
* @property {number} collisionWidth - The width of the collision tiles.
*/
Object.defineProperty(Phaser.TilemapLayer.prototype, "collisionWidth", {
    
    get: function () {
        return this._cw;
    },

    set: function (value) {

        this._cw = value;

        this.dirty = true;

    }

});

/**
* @name Phaser.TilemapLayer#collisionHeight
* @property {number} collisionHeight - The height of the collision tiles.
*/
Object.defineProperty(Phaser.TilemapLayer.prototype, "collisionHeight", {
    
    get: function () {
        return this._ch;
    },

    set: function (value) {

        this._ch = value;

        this.dirty = true;

    }

});
