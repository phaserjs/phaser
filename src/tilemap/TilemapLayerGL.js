/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Pete Baron <pete@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A TilemapLayerGL is a PIXI.Tilemap that renders a specific TileLayer of a Tilemap using the PIXI WebGL renderer.
* 
* NOTE: This is a close duplicate of Phaser.TilemapLayer class, modified to support WebGL rendering, it may be possible to merge the two classes
* although that will probably incur performance penalties due to some fundamental differences in the set-up before rendering.
* 
* Since a PIXI.Tilemap is a PIXI.DisplayObjectContainer it can be moved around the display list, added to other groups, or display objects, etc.
*
* By default TilemapLayers have fixedToCamera set to `true`. Changing this will break Camera follow and scrolling behavior.
*
* @class Phaser.TilemapLayerGL
* @extends Phaser.Sprite
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
* @param {Phaser.Tilemap} tilemap - The tilemap to which this layer belongs.
* @param {integer} index - The index of the TileLayer to render within the Tilemap.
* @param {integer} width - Width of the renderable area of the layer (in pixels).
* @param {integer} height - Height of the renderable area of the layer (in pixels).
*/
Phaser.TilemapLayerGL = function (game, tilemap, index, width, height) {

    this.game = game;

    width |= 0;
    height |= 0;

    /**
    * The Tilemap to which this layer is bound.
    * @property {Phaser.Tilemap} map
    * @protected
    * @readonly
    */
    this.map = tilemap;

    /**
    * The index of this layer within the Tilemap.
    * @property {number} index
    * @protected
    * @readonly
    */
    this.index = index;

    /**
    * The layer object within the Tilemap that this layer represents.
    * @property {object} layer
    * @protected
    * @readonly
    */
    this.layer = tilemap.layers[index];

    /**
    * The const type of this object.
    * @property {number} type
    * @readonly
    * @protected
    * @default Phaser.TILEMAPLAYER
    */
    this.type = Phaser.TILEMAPLAYER;

    /**
    * @property {number} physicsType - The const physics body type of this object.
    * @readonly
    */
    this.physicsType = Phaser.TILEMAPLAYER;

    /**
    * Settings that control standard (non-diagnostic) rendering.
    *
    * @property {float} [overdrawRatio=0.20] - Over Draw ratio.
    *
    * @default
    */
    this.renderSettings = {
        overdrawRatio: 0.20
    };

    /**
    * @property {boolean} exists - Controls if the core game loop and physics update this game object or not.
    */
    this.exists = true;

    /**
    * Speed at which this layer scrolls horizontally, relative to the camera (e.g. scrollFactorX of 0.5 scrolls half as quickly as the 'normal' camera-locked layers do).
    * @property {number} scrollFactorX
    * @public
    * @default
    */
    this.scrollFactorX = 1;

    /**
    * Speed at which this layer scrolls vertically, relative to the camera (e.g. scrollFactorY of 0.5 scrolls half as quickly as the 'normal' camera-locked layers do)
    * @property {number} scrollFactorY
    * @public
    * @default
    */
    this.scrollFactorY = 1;

    /**
    * If true tiles will be force rendered, even if such is not believed to be required.
    * @property {boolean} dirty
    * @protected
    */
    this.dirty = true;

    /**
    * When ray-casting against tiles this is the number of steps it will jump. For larger tile sizes you can increase this to improve performance.
    * @property {integer} rayStepRate
    * @default
    */
    this.rayStepRate = 4;

    /**
    * Flag controlling if the layer tiles wrap at the edges.
    * @property {boolean} _wrap
    * @private
    */
    this._wrap = false;

    /**
    * Local map data and calculation cache.
    * @property {object} _mc
    * @private
    */
    var tileset = this.layer.tileset || this.map.tilesets[0];

    this._mc = {

        // Used to bypass rendering without reliance on `dirty` and detect changes.
        scrollX: 0,
        scrollY: 0,
        renderWidth: 0,
        renderHeight: 0,

        // dimensions of tiles in the original tilemap (the one holding all the tile indices)
        tileWidth: tilemap.tileWidth,
        tileHeight: tilemap.tileHeight,

        // Collision width/height (pixels)
        // What purpose do these have? Most things use tile width/height directly.
        // This also only extends collisions right and down.

        // dimensions of tiles in this tileset (may not match the original tilemap)
        cw: tileset.tileWidth,
        ch: tileset.tileHeight,

        // the tileset for this layer
        tileset: tileset,

        // Cached tilesets from index -> Tileset
        tilesets: []

    };

    /**
     * The rendering mode (used by PIXI.Tilemap).  Modes are: 0 - render entire screen of tiles, 1 - render entire map of tiles
     * TODO: make some constants for the rendering modes
     * @property {number} _renderMode
     * @private
     */
    this._renderMode = 0;

    /**
    * The current canvas left after scroll is applied.
    * @property {number} _scrollX
    * @private
    */
    this._scrollX = 0;

    /**
    * The current canvas top after scroll is applied.
    * @propety {number} _scrollY
    * @private
    */
    this._scrollY = 0;

    /**
    * Used for caching the tiles / array of tiles.
    * @property {Phaser.Tile[]} _results
    * @private
    */
    this._results = [];

    // get PIXI textures for each tileset source image
    var baseTexture = new PIXI.BaseTexture(tileset.image);

    PIXI.Tilemap.call(this, new PIXI.Texture(baseTexture), this.map.width, this.map.height, this._mc.tileset.tileWidth, this._mc.tileset.tileHeight, this.layer);

    Phaser.Component.Core.init.call(this, game, 0, 0, null, null);

    // must be set *after* the Core.init
    this.fixedToCamera = true;

};

// constructor: extends PIXI.Tilemap
Phaser.TilemapLayerGL.prototype = Object.create(PIXI.Tilemap.prototype);
Phaser.TilemapLayerGL.prototype.constructor = Phaser.TilemapLayerGL;

//  Only one Phaser component used
Phaser.Component.Core.install.call(Phaser.TilemapLayerGL.prototype, [
    'FixedToCamera'
]);

Phaser.TilemapLayerGL.prototype.preUpdateCore = Phaser.Component.Core.preUpdate;

/**
* Automatically called by World.preUpdate.
*
* @method Phaser.TilemapLayerGL#preUpdate
*/
Phaser.TilemapLayerGL.prototype.preUpdate = function () {

    return this.preUpdateCore();

};

/**
* Automatically called by World.postUpdate. Handles camera scrolling.
*
* @method Phaser.TilemapLayerGL#postUpdate
* @protected
*/
Phaser.TilemapLayerGL.prototype.postUpdate = function () {

    Phaser.Component.FixedToCamera.postUpdate.call(this);

    //  Stops you being able to auto-scroll the camera if it's not following a sprite
    var camera = this.game.camera;

    this.scrollX = camera.x * this.scrollFactorX / this.scale.x;
    this.scrollY = camera.y * this.scrollFactorY / this.scale.y;

    this.render();

};

/**
* Destroys this TilemapLayerGL.
*
* @method Phaser.TilemapLayerGL#destroy
*/
Phaser.TilemapLayerGL.prototype.destroy = function() {

    Phaser.Component.Destroy.prototype.destroy.call(this);

};

/**
* Resizes the internal dimensions and texture frame used by this TilemapLayerGL.
*
* This is an expensive call, so don't bind it to a window resize event! But instead call it at carefully
* selected times.
*
* Be aware that no validation of the new sizes takes place and the current map scroll coordinates are not
* modified either. You will have to handle both of these things from your game code if required.
* 
* @method Phaser.TilemapLayerGL#resize
* @param {number} width - The new width of the TilemapLayerGL
* @param {number} height - The new height of the TilemapLayerGL
*/
Phaser.TilemapLayerGL.prototype.resize = function (width, height) {

    this.texture.frame.resize(width, height);

    this.texture.width = width;
    this.texture.height = height;

    this.texture.crop.width = width;
    this.texture.crop.height = height;

    this.texture.baseTexture.width = width;
    this.texture.baseTexture.height = height;

    this.texture.baseTexture.dirty();
    this.texture.requiresUpdate = true;

    this.texture._updateUvs();

    this.dirty = true;

};

/**
* Sets the world size to match the size of this layer.
*
* @method Phaser.TilemapLayerGL#resizeWorld
* @public
*/
Phaser.TilemapLayerGL.prototype.resizeWorld = function () {

    this.game.world.setBounds(0, 0, this.layer.widthInPixels * this.scale.x, this.layer.heightInPixels * this.scale.y);

};

/**
* Take an x coordinate that doesn't account for scrollFactorX and 'fix' it into a scrolled local space.
*
* @method Phaser.TilemapLayerGL#_fixX
* @private
* @param {number} x - x coordinate in camera space
* @return {number} x coordinate in scrollFactor-adjusted dimensions
*/
Phaser.TilemapLayerGL.prototype._fixX = function (x) {

    if (x < 0)
    {
        x = 0;
    }

    if (this.scrollFactorX === 1)
    {
        return x;
    }

    return this._scrollX + (x - (this._scrollX / this.scrollFactorX));

};

/**
* Take an x coordinate that _does_ account for scrollFactorX and 'unfix' it back to camera space.
*
* @method Phaser.TilemapLayerGL#_unfixX
* @private
* @param {number} x - x coordinate in scrollFactor-adjusted dimensions
* @return {number} x coordinate in camera space
*/
Phaser.TilemapLayerGL.prototype._unfixX = function (x) {

    if (this.scrollFactorX === 1)
    {
        return x;
    }

    return (this._scrollX / this.scrollFactorX) + (x - this._scrollX);

};

/**
* Take a y coordinate that doesn't account for scrollFactorY and 'fix' it into a scrolled local space.
*
* @method Phaser.TilemapLayerGL#_fixY
* @private
* @param {number} y - y coordinate in camera space
* @return {number} y coordinate in scrollFactor-adjusted dimensions
*/
Phaser.TilemapLayerGL.prototype._fixY = function (y) {

    if (y < 0)
    {
        y = 0;
    }

    if (this.scrollFactorY === 1)
    {
        return y;
    }

    return this._scrollY + (y - (this._scrollY / this.scrollFactorY));

};

/**
* Take a y coordinate that _does_ account for scrollFactorY and 'unfix' it back to camera space.
*
* @method Phaser.TilemapLayerGL#_unfixY
* @private
* @param {number} y - y coordinate in scrollFactor-adjusted dimensions
* @return {number} y coordinate in camera space
*/
Phaser.TilemapLayerGL.prototype._unfixY = function (y) {

    if (this.scrollFactorY === 1)
    {
        return y;
    }

    return (this._scrollY / this.scrollFactorY) + (y - this._scrollY);

};

/**
* Convert a pixel value to a tile coordinate.
*
* @method Phaser.TilemapLayerGL#getTileX
* @public
* @param {number} x - X position of the point in target tile (in pixels).
* @return {integer} The X map location of the tile.
*/
Phaser.TilemapLayerGL.prototype.getTileX = function (x) {

    // var tileWidth = this.tileWidth * this.scale.x;
    return Math.floor(this._fixX(x) / this._mc.tileWidth);

};

/**
* Convert a pixel value to a tile coordinate.
*
* @method Phaser.TilemapLayerGL#getTileY
* @public
* @param {number} y - Y position of the point in target tile (in pixels).
* @return {integer} The Y map location of the tile.
*/
Phaser.TilemapLayerGL.prototype.getTileY = function (y) {

    // var tileHeight = this.tileHeight * this.scale.y;
    return Math.floor(this._fixY(y) / this._mc.tileHeight);

};

/**
* Convert a pixel coordinate to a tile coordinate.
*
* @method Phaser.TilemapLayerGL#getTileXY
* @public
* @param {number} x - X position of the point in target tile (in pixels).
* @param {number} y - Y position of the point in target tile (in pixels).
* @param {(Phaser.Point|object)} point - The Point/object to update.
* @return {(Phaser.Point|object)} A Point/object with its `x` and `y` properties set.
*/
Phaser.TilemapLayerGL.prototype.getTileXY = function (x, y, point) {

    point.x = this.getTileX(x);
    point.y = this.getTileY(y);

    return point;

};

/**
* Gets all tiles that intersect with the given line.
*
* @method Phaser.TilemapLayerGL#getRayCastTiles
* @public
* @param {Phaser.Line} line - The line used to determine which tiles to return.
* @param {integer} [stepRate=(rayStepRate)] - How many steps through the ray will we check? Defaults to `rayStepRate`.
* @param {boolean} [collides=false] - If true, _only_ return tiles that collide on one or more faces.
* @param {boolean} [interestingFace=false] - If true, _only_ return tiles that have interesting faces.
* @return {Phaser.Tile[]} An array of Phaser.Tiles.
*/
Phaser.TilemapLayerGL.prototype.getRayCastTiles = function (line, stepRate, collides, interestingFace) {

    if (!stepRate) { stepRate = this.rayStepRate; }
    if (collides === undefined) { collides = false; }
    if (interestingFace === undefined) { interestingFace = false; }

    //  First get all tiles that touch the bounds of the line
    var tiles = this.getTiles(line.x, line.y, line.width, line.height, collides, interestingFace);

    if (tiles.length === 0)
    {
        return [];
    }

    //  Now we only want the tiles that intersect with the points on this line
    var coords = line.coordinatesOnLine(stepRate);
    var results = [];

    for (var i = 0; i < tiles.length; i++)
    {
        for (var t = 0; t < coords.length; t++)
        {
            var tile = tiles[i];
            var coord = coords[t];

            if (tile.containsPoint(coord[0], coord[1]))
            {
                results.push(tile);
                break;
            }
        }
    }

    return results;

};

/**
* Get all tiles that exist within the given area, defined by the top-left corner, width and height. Values given are in pixels, not tiles.
*
* @method Phaser.TilemapLayerGL#getTiles
* @public
* @param {number} x - X position of the top left corner (in pixels).
* @param {number} y - Y position of the top left corner (in pixels).
* @param {number} width - Width of the area to get (in pixels).
* @param {number} height - Height of the area to get (in pixels).
* @param {boolean} [collides=false] - If true, _only_ return tiles that collide on one or more faces.
* @param {boolean} [interestingFace=false] - If true, _only_ return tiles that have interesting faces.
* @return {array<Phaser.Tile>} An array of Tiles.
*/
Phaser.TilemapLayerGL.prototype.getTiles = function (x, y, width, height, collides, interestingFace) {

    //  Should we only get tiles that have at least one of their collision flags set? (true = yes, false = no just get them all)
    if (collides === undefined) { collides = false; }
    if (interestingFace === undefined) { interestingFace = false; }

    var fetchAll = !(collides || interestingFace);

    //  Adjust the x,y coordinates for scrollFactor
    x = this._fixX(x);
    y = this._fixY(y);

    //  Convert the pixel values into tile coordinates
    var tx = Math.floor(x / (this._mc.cw * this.scale.x));
    var ty = Math.floor(y / (this._mc.ch * this.scale.y));

    //  Don't just use ceil(width/cw) to allow account for x/y diff within cell
    var tw = Math.ceil((x + width) / (this._mc.cw * this.scale.x)) - tx;
    var th = Math.ceil((y + height) / (this._mc.ch * this.scale.y)) - ty;

    //  Discard old results before storing the new ones
    this._results = [];

    for (var wy = ty; wy < ty + th; wy++)
    {
        for (var wx = tx; wx < tx + tw; wx++)
        {
            var row = this.layer.data[wy];

            if (row && row[wx])
            {
                if (fetchAll || row[wx].isInteresting(collides, interestingFace))
                {
                    this._results.push(row[wx]);
                }
            }
        }
    }

    return this._results.slice();

};

/**
* The TilemapLayerGL caches tileset look-ups.
*
* Call this method of clear the cache if tilesets have been added or updated after the layer has been rendered.
*
* @method Phaser.TilemapLayerGL#resetTilesetCache
* @public
*/
Phaser.TilemapLayerGL.prototype.resetTilesetCache = function () {

    this._mc.tilesets = [];

};

/**
 * This method will set the scale of the tilemap as well as update the underlying block data of this layer.
 * 
 * @method Phaser.TilemapLayerGL#setScale
 * @param {number} [xScale=1] - The scale factor along the X-plane 
 * @param {number} [yScale] - The scale factor along the Y-plane
 */
Phaser.TilemapLayerGL.prototype.setScale = function (xScale, yScale) {

    xScale = xScale || 1;
    yScale = yScale || xScale;

    for (var y = 0; y < this.layer.data.length; y++)
    {
        var row = this.layer.data[y];

        for (var x = 0; x < row.length; x++)
        {
            var tile = row[x];

            tile.width = this.map.tileWidth * xScale;
            tile.height = this.map.tileHeight * yScale;

            tile.worldX = tile.x * tile.width;
            tile.worldY = tile.y * tile.height;
        }
    }

    this.scale.setTo(xScale, yScale);

};

/**
* Render tiles in the given area given by the virtual tile coordinates biased by the given scroll factor.
* This will constrain the tile coordinates based on wrapping but not physical coordinates.
*
* @method Phaser.TilemapLayerGL#renderRegion
* @private
* @param {integer} scrollX - Render x offset/scroll.
* @param {integer} scrollY - Render y offset/scroll.
* @param {integer} left - Leftmost column to render.
* @param {integer} top - Topmost row to render.
* @param {integer} right - Rightmost column to render.
* @param {integer} bottom - Bottommost row to render.
*/
Phaser.TilemapLayerGL.prototype.renderRegion = function (scrollX, scrollY, left, top, right, bottom, offx, offy) {

    var width = this.layer.width;
    var height = this.layer.height;
    var tw = this._mc.tileWidth;
    var th = this._mc.tileHeight;

    offx = offx || 0;
    offy = offy || 0;
    
    if (!this._wrap)
    {
        if (left <= right) // Only adjust if going to render
        {
            left = Math.max(0, left);
            right = Math.min(width - 1, right);
        }

        if (top <= bottom)
        {
            top = Math.max(0, top);
            bottom = Math.min(height - 1, bottom);
        }
    }
   
    // top-left pixel of top-left cell
    var baseX = (left * tw) - scrollX;
    var baseY = (top * th) - scrollY;

    // Fix normStartX/normStartY such it is normalized [0..width/height). This allows a simple conditional and decrement to always keep in range [0..width/height) during the loop. The major offset bias is to take care of negative values.
    var normStartX = (left + ((1 << 20) * width)) % width;
    var normStartY = (top + ((1 << 20) * height)) % height;

    // tx/ty - are pixel coordinates where tile is drawn
    // x/y - is cell location, normalized [0..width/height) in loop
    // xmax/ymax - remaining cells to render on column/row
    var tx, ty, x, y, xmax, ymax;

    for (y = normStartY, ymax = bottom - top, ty = baseY; ymax >= 0; y++, ymax--, ty += th)
    {
        if (y >= height)
        {
            y -= height;
        }

        var row = this.layer.data[y];

        for (x = normStartX, xmax = right - left, tx = baseX; xmax >= 0; x++, xmax--, tx += tw)
        {
            if (x >= width)
            {
                x -= width;
            }

            var tile = row[x];

            if (!tile || tile.index < 0)
            {
                // skipping some tiles, add a degenerate marker into the batch list
                this._mc.tileset.addDegenerate(this.glBatch);
                continue;
            }

            var index = tile.index;

            if (tile.rotation || tile.flipped)
            {
                this._mc.tileset.drawGl(this.glBatch, -tile.centerX + offx, -tile.centerY + offy, index, tile.alpha);
            }
            else
            {
                this._mc.tileset.drawGl(this.glBatch, tx + offx, ty + offy, index, tile.alpha);
            }
        }

        // at end of each row, add a degenerate marker into the batch drawing list
        this._mc.tileset.addDegenerate(this.glBatch);
    }

};

/**
* Clear and render the entire canvas.
*
* @method Phaser.TilemapLayerGL#renderFull
* @private
*/
Phaser.TilemapLayerGL.prototype.renderFull = function () {
    
    var scrollX = this._mc.scrollX;
    var scrollY = this._mc.scrollY;

    var renderW = this.game._width;     //this.canvas.width;
    var renderH = this.game._height;    //this.canvas.height;

    var tw = this._mc.tileWidth;
    var th = this._mc.tileHeight;

    var cw = this._mc.cw;
    var ch = this._mc.ch;

    var left = Math.floor((scrollX - (cw - tw)) / tw);
    var right = Math.floor((renderW - 1 + scrollX) / tw);
    var top = Math.floor((scrollY - (ch - th)) / th);
    var bottom = Math.floor((renderH - 1 + scrollY) / th);

    this.glBatch = [];
    this.renderRegion(scrollX, scrollY, left, top, right, bottom, 0, -(ch - th));

};

/**
* Renders the tiles to the layer canvas and pushes to the display.
*
* @method Phaser.TilemapLayerGL#render
* @protected
*/
Phaser.TilemapLayerGL.prototype.render = function () {

    var redrawAll = false;

    if (!this.visible)
    {
        return;
    }

    if (this.dirty || this.layer.dirty)
    {
        this.layer.dirty = false;
        redrawAll = true;
    }

    //  Scrolling bias; whole pixels only
    var scrollX = this._scrollX | 0;
    var scrollY = this._scrollY | 0;

    var mc = this._mc;
    var shiftX = mc.scrollX - scrollX; // Negative when scrolling right/down
    var shiftY = mc.scrollY - scrollY;

    if (!redrawAll && shiftX === 0 && shiftY === 0)
    {
        //  No reason to rebuild batch, looking at same thing and not invalidated.
        return;
    }

    mc.scrollX = scrollX;
    mc.scrollY = scrollY;

    this.renderFull();

    this.texture.baseTexture.dirty();

    this.dirty = false;

    return true;

};

/**
* Flag controlling if the layer tiles wrap at the edges. Only works if the World size matches the Map size.
*
* @property {boolean} wrap
* @memberof Phaser.TilemapLayerGL
* @public
* @default false
*/
Object.defineProperty(Phaser.TilemapLayerGL.prototype, "wrap", {

    get: function () {
        return this._wrap;
    },

    set: function (value) {
        this._wrap = value;
        this.dirty = true;
    }

});

/**
* Scrolls the map horizontally or returns the current x position.
*
* @property {number} scrollX
* @memberof Phaser.TilemapLayerGL
* @public
*/
Object.defineProperty(Phaser.TilemapLayerGL.prototype, "scrollX", {

    get: function () {
        return this._scrollX;
    },

    set: function (value) {
        this._scrollX = value;
    }

});

/**
* Scrolls the map vertically or returns the current y position.
*
* @property {number} scrollY
* @memberof Phaser.TilemapLayerGL
* @public
*/
Object.defineProperty(Phaser.TilemapLayerGL.prototype, "scrollY", {

    get: function () {
        return this._scrollY;
    },

    set: function (value) {
        this._scrollY = value;
    }

});

/**
* The width of the collision tiles (in pixels).
*
* @property {integer} collisionWidth
* @memberof Phaser.TilemapLayerGL
* @public
*/
Object.defineProperty(Phaser.TilemapLayerGL.prototype, "collisionWidth", {

    get: function () {
        return this._mc.cw;
    },

    set: function (value) {
        this._mc.cw = value | 0;
        this.dirty = true;
    }

});

/**
* The height of the collision tiles (in pixels).
*
* @property {integer} collisionHeight
* @memberof Phaser.TilemapLayerGL
* @public
*/
Object.defineProperty(Phaser.TilemapLayerGL.prototype, "collisionHeight", {

    get: function () {
        return this._mc.ch;
    },

    set: function (value) {
        this._mc.ch = value | 0;
        this.dirty = true;
    }

});
