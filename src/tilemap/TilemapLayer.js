/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A TilemapLayer is a Phaser.Image/Sprite that renders a specific TileLayer of a Tilemap.
*
* Since a TilemapLayer is a Sprite it can be moved around the display, added to other groups or display objects, etc.
* By default TilemapLayers have fixedToCamera set to `true`. Changing this will break Camera follow and scrolling behaviour.
*
* @class Phaser.TilemapLayer
* @extends {Phaser.Image}
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
* @param {Phaser.Tilemap} tilemap - The tilemap to which this layer belongs.
* @param {integer} index - The index of the TileLayer to render within the Tilemap.
* @param {integer} width - Width of the renderable area of the layer (in pixels).
* @param {integer} height - Height of the renderable area of the layer (in pixels).
*/
Phaser.TilemapLayer = function (game, tilemap, index, width, height) {

    width |= 0;
    height |= 0;

    /**
    * A reference to the currently running Game.
    * @property {Phaser.Game} game
    * @protected
    * @readonly
    */
    this.game = game;

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
    * @property {Phaser.TileLayer} layer
    * @protected
    * @readonly
    */
    this.layer = tilemap.layers[index];

    /**
    * The canvas to which this TilemapLayer draws.
    * @property {HTMLCanvasElement} canvas
    * @protected
    */
    this.canvas = Phaser.Canvas.create(width, height, '', true);

    /**
    * The 2d context of the canvas.
    * @property {CanvasRenderingContext2D} context
    * @private
    */
    this.context = this.canvas.getContext('2d');

    /**
    * Required Pixi var.
    * @property {PIXI.BaseTexture} baseTexture
    * @protected
    */
    this.baseTexture = new PIXI.BaseTexture(this.canvas);

    /**
    * Required Pixi var.
    * @property {PIXI.Texture} texture
    * @protected
    */
    this.texture = new PIXI.Texture(this.baseTexture);

    /**
    * Dimensions of the renderable area.
    * @property {Phaser.Frame} textureFrame
    * @protected
    */
    this.textureFrame = new Phaser.Frame(0, 0, 0, width, height, 'tilemapLayer', game.rnd.uuid());

    Phaser.Image.call(this, this.game, 0, 0, this.texture, this.textureFrame);

    /**
    * The name of the layer.
    * @property {string} name
    */
    this.name = '';

    /**
    * The const type of this object.
    * @property {number} type
    * @readonly
    * @protected
    * @default Phaser.TILEMAPLAYER
    */
    this.type = Phaser.TILEMAPLAYER;

    /**
    * An object that is fixed to the camera ignores the position of any ancestors in the display list and uses its x/y coordinates as offsets from the top left of the camera.
    * @property {boolean} fixToCamera
    * @default
    */
    this.fixedToCamera = true;

    /**
    * If this object is fixed to the camera then use this Point to specify how far away from the Camera x/y it's rendered.
    * @property {Phaser.Point} cameraOffset
    */
    this.cameraOffset = new Phaser.Point(0, 0);

    /**
    * Settings that control standard (non-diagnostic) rendering.
    *
    * @public
    * @property {boolean} enableScrollDelta - When enabled, only new newly exposed areas of the layer are redraw after scrolling. This can greatly improve scrolling rendering performance, especially when there are many small tiles.
    * @default
    */
    this.renderSettings = {

        enableScrollDelta: true,
        overdrawRatio: 0.20

    };

    /**
    * Enable an additional "debug rendering" pass to display collision information.
    *
    * @property {boolean} debug
    * @default
    */
    this.debug = false;

    /**
    * Settings used for debugging and diagnostics.
    *
    * @property {?string} missingImageFill - A tile is rendered as a rectangle using the following fill if a valid tileset/image cannot be found. A value of `null` prevents additional rendering for tiles without a valid tileset image. _This takes effect even when debug rendering for the layer is not enabled._
    *
    * @property {?string} debuggedTileOverfill - If a Tile has `Tile#debug` true then, after normal tile image rendering, a rectangle with the following fill is drawn above/over it. _This takes effect even when debug rendering for the layer is not enabled._
    *
    * @property {boolean} forceFullRedraw - When debug rendering (`debug` is true), and this option is enabled, the a full redraw is forced and rendering optimization is suppressed.
    *
    * @property {number} debugAlpha - When debug rendering (`debug` is true), the tileset is initially rendered with this alpha level. This can make the tile edges clearer.
    *
    * @property {?string} facingEdgeStroke - When debug rendering (`debug` is true), this color/stroke is used to draw "face" edges. A value of `null` disables coloring facing edges.
    *
    * @property {?string} collidingTileOverfill - When debug rendering (`debug` is true), this fill is used for tiles that are collidable. A value of `null` disables applying the additional overfill.
    *
    */
    this.debugSettings = {

        missingImageFill: 'rgb(255,255,255)',
        debuggedTileOverfill: 'rgba(0,255,0,0.4)',

        forceFullRedraw: true,

        debugAlpha: 0.5,
        facingEdgeStroke: 'rgba(0,255,0,1)',
        collidingTileOverfill: 'rgba(0,255,0,0.2)'

    };

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
    this._mc = {

        // Used to bypass rendering without reliance on `dirty` and detect changes.
        scrollX: 0,
        scrollY: 0,
        renderWidth: 0,
        renderHeight: 0,

        tileWidth: tilemap.tileWidth,
        tileHeight: tilemap.tileHeight,

        // Collision width/height (pixels)
        // What purpose do these have? Most things use tile width/height directly.
        // This also only extends collisions right and down.       
        cw: tilemap.tileWidth,
        ch: tilemap.tileHeight,

        // Cached tilesets from index -> Tileset
        tilesets: []

    };

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

};

Phaser.TilemapLayer.prototype = Object.create(Phaser.Image.prototype);
Phaser.TilemapLayer.prototype.constructor = Phaser.TilemapLayer;

/**
* If no valid tileset/image can be found for a tile, the tile is rendered as a rectangle using this as a fill value.
*
* Set to `null` to disable rendering anything for tiles without value tileset images.
*
* @property {?string} tileColor
* @memberof Phaser.TilemapLayer
* @default 'rgb(255, 255, 255)'
* @deprecated Use `debugSettings.missingImageFill` instead.
*/
Object.defineProperty(Phaser.TilemapLayer.prototype, 'tileColor', {

    get: function () {
        return this.debugSettings.missingImageFill;
    },
    set: function (value) {
        this.debugSettings.missingImageFill = value;
    }

});

/**
* Automatically called by World.postUpdate. Handles cache updates.
*
* @method Phaser.TilemapLayer#postUpdate
* @protected
*/
Phaser.TilemapLayer.prototype.postUpdate = function () {

    Phaser.Image.prototype.postUpdate.call(this);

    //  Stops you being able to auto-scroll the camera if it's not following a sprite
    var camera = this.game.camera;
    this.scrollX = camera.x * this.scrollFactorX;
    this.scrollY = camera.y * this.scrollFactorY;

    this.render();

    //  Fixed to Camera?
    if (this._cache[7] === 1)
    {
        this.position.x = (camera.view.x + this.cameraOffset.x) / camera.scale.x;
        this.position.y = (camera.view.y + this.cameraOffset.y) / camera.scale.y;
    }

    //  Update any Children
    // for (var i = 0, len = this.children.length; i < len; i++)
    // {
        // this.children[i].postUpdate();
    // }

};

/**
* Sets the world size to match the size of this layer.
*
* @method Phaser.TilemapLayer#resizeWorld
* @public
*/
Phaser.TilemapLayer.prototype.resizeWorld = function () {

    this.game.world.setBounds(0, 0, this.layer.widthInPixels, this.layer.heightInPixels);

};

/**
* Take an x coordinate that doesn't account for scrollFactorX and 'fix' it into a scrolled local space.
*
* @method Phaser.TilemapLayer#_fixX
* @private
* @param {number} x - x coordinate in camera space
* @return {number} x coordinate in scrollFactor-adjusted dimensions
*/
Phaser.TilemapLayer.prototype._fixX = function (x) {

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
* @method Phaser.TilemapLayer#_unfixX
* @private
* @param {number} x - x coordinate in scrollFactor-adjusted dimensions
* @return {number} x coordinate in camera space
*/
Phaser.TilemapLayer.prototype._unfixX = function (x) {

    if (this.scrollFactorX === 1)
    {
        return x;
    }

    return (this._scrollX / this.scrollFactorX) + (x - this._scrollX);

};

/**
* Take a y coordinate that doesn't account for scrollFactorY and 'fix' it into a scrolled local space.
*
* @method Phaser.TilemapLayer#_fixY
* @private
* @param {number} y - y coordinate in camera space
* @return {number} y coordinate in scrollFactor-adjusted dimensions
*/
Phaser.TilemapLayer.prototype._fixY = function (y) {

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
* @method Phaser.TilemapLayer#_unfixY
* @private
* @param {number} y - y coordinate in scrollFactor-adjusted dimensions
* @return {number} y coordinate in camera space
*/
Phaser.TilemapLayer.prototype._unfixY = function (y) {

    if (this.scrollFactorY === 1)
    {
        return y;
    }

    return (this._scrollY / this.scrollFactorY) + (y - this._scrollY);

};

/**
* Convert a pixel value to a tile coordinate.
*
* @method Phaser.TilemapLayer#getTileX
* @public
* @param {number} x - X position of the point in target tile (in pixels).
* @return {integer} The X map location of the tile.
*/
Phaser.TilemapLayer.prototype.getTileX = function (x) {

    // var tileWidth = this.tileWidth * this.scale.x;
    return Math.floor(this._fixX(x) / this._mc.tileWidth);

};

/**
* Convert a pixel value to a tile coordinate.
*
* @method Phaser.TilemapLayer#getTileY
* @public
* @param {number} y - Y position of the point in target tile (in pixels).
* @return {integer} The Y map location of the tile.
*/
Phaser.TilemapLayer.prototype.getTileY = function (y) {

    // var tileHeight = this.tileHeight * this.scale.y;
    return Math.floor(this._fixY(y) / this._mc.tileHeight);

};

/**
* Convert a pixel coordinate to a tile coordinate.
*
* @method Phaser.TilemapLayer#getTileXY
* @public
* @param {number} x - X position of the point in target tile (in pixels).
* @param {number} y - Y position of the point in target tile (in pixels).
* @param {(Phaser.Point|object)} point - The Point/object to update.
* @return {(Phaser.Point|object)} A Point/object with its `x` and `y` properties set.
*/
Phaser.TilemapLayer.prototype.getTileXY = function (x, y, point) {

    point.x = this.getTileX(x);
    point.y = this.getTileY(y);

    return point;

};

/**
* Gets all tiles that intersect with the given line.
*
* @method Phaser.TilemapLayer#getRayCastTiles
* @public
* @param {Phaser.Line} line - The line used to determine which tiles to return.
* @param {integer} [stepRate=(rayStepRate)] - How many steps through the ray will we check? Defaults to `rayStepRate`.
* @param {boolean} [collides=false] - If true, _only_ return tiles that collide on one or more faces.
* @param {boolean} [interestingFace=false] - If true, _only_ return tiles that have interesting faces.
* @return {Phaser.Tile[]} An array of Phaser.Tiles.
*/
Phaser.TilemapLayer.prototype.getRayCastTiles = function (line, stepRate, collides, interestingFace) {

    if (!stepRate) { stepRate = this.rayStepRate; }
    if (typeof collides === 'undefined') { collides = false; }
    if (typeof interestingFace === 'undefined') { interestingFace = false; }

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
* @method Phaser.TilemapLayer#getTiles
* @public
* @param {number} x - X position of the top left corner (in pixels).
* @param {number} y - Y position of the top left corner (in pixels).
* @param {number} width - Width of the area to get (in pixels).
* @param {number} height - Height of the area to get (in pixels).
* @param {boolean} [collides=false] - If true, _only_ return tiles that collide on one or more faces.
* @param {boolean} [interestingFace=false] - If true, _only_ return tiles that have interesting faces.
* @return {array<Phaser.Tile>} An array of Tiles.
*/
Phaser.TilemapLayer.prototype.getTiles = function (x, y, width, height, collides, interestingFace) {

    //  Should we only get tiles that have at least one of their collision flags set? (true = yes, false = no just get them all)
    if (typeof collides === 'undefined') { collides = false; }
    if (typeof interestingFace === 'undefined') { interestingFace = false; }

    var fetchAll = !(collides || interestingFace);

    //  Adjust the x,y coordinates for scrollFactor
    x = this._fixX(x);
    y = this._fixY(y);

    var tw = this._mc.tileWidth;
    var th = this._mc.tileHeight;

    //  Convert the pixel values into tile coordinates
    var tx = Math.floor(x / this._mc.cw);
    var ty = Math.floor(y / this._mc.ch);
    //  Don't just use ceil(width/cw) to allow account for x/y diff within cell
    var tw = Math.ceil((x + width) / this._mc.cw) - tx;
    var th = Math.ceil((y + height) / this._mc.ch) - ty;

    while (this._results.length)
    {
        this._results.pop();
    }

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

    return this._results;

};

/**
* Flag controlling if the layer tiles wrap at the edges. Only works if the World size matches the Map size.
*
* @property {boolean} wrap
* @memberof Phaser.TilemapLayer
* @public
* @default false
*/
Object.defineProperty(Phaser.TilemapLayer.prototype, "wrap", {

    get: function () {
        return this._wrap;
    },

    set: function (value) {
        this._wrap = value;
        this.dirty = true;
    }

});

/**
* Returns the appropriate tileset for the index, updating the internal cache as required. This should only be called if `tilesets[index]` evaluates to undefined.
*
* @method Phaser.TilemapLayer#resolveTileset
* @private
* @param {integer} Tile index
* @return {Phaser.Tileset|null} Returns the associated tileset or null if there is no such mapping.
*/
Phaser.TilemapLayer.prototype.resolveTileset = function (tileIndex)
{
    var tilesets = this._mc.tilesets;

    //  Try for dense array if reasonable
    if (tileIndex < 2000) {
        while (tilesets.length < tileIndex) {
            tilesets.push(undefined);
        }
    }

    var setIndex = this.map.tiles[tileIndex] && this.map.tiles[tileIndex][2];

    if (setIndex != null) // number: not null or undefined
    {
        var tileset = this.map.tilesets[setIndex];
        if (tileset && tileset.containsTileIndex(tileIndex))
        {
            return (tilesets[tileIndex] = tileset);
        }
    }

    return (tilesets[tileIndex] = null);

};

/**
* The TilemapLayer caches tileset look-ups. Call this method of clear the cache if tilesets have been added or updated after the layer has been rendered.
*
* @method Phaser.TilemapLayer#resetTilesetCache
* @public
*/
Phaser.TilemapLayer.prototype.resetTilesetCache = function ()
{

    var tilesets = this._mc.tilesets;
    while (tilesets.length) {
        tilesets.pop();
    }

};

/**
* Shifts the contents of the canvas - does extra math so that different browsers agree on the result. The specified (x/y) will be shifted to (0,0) after the copy. The newly exposed canvas area will need to be filled in. This method is problematic for transparent tiles.
*
* @method Phaser.TilemapLayer#shiftCanvas
* @private
* @param {CanvasRenderingContext2D} context - The context to shift
* @param {integer} x
* @param {integer} y
*/
Phaser.TilemapLayer.prototype.shiftCanvas = function (context, x, y)
{

    var canvas = context.canvas;
    var copyW = canvas.width - Math.abs(x);
    var copyH = canvas.height - Math.abs(y);

    //  When x/y non-negative
    var dx = 0;
    var dy = 0;
    var sx = x;
    var sy = y;

    if (x < 0)
    {
        dx = -x;
        sx = 0;
    }

    if (y < 0)
    {
        dy = -y;
        sy = 0;
    }

    context.save();
    context.globalCompositeOperation = 'copy';
    context.drawImage(canvas, dx, dy, copyW, copyH, sx, sy, copyW, copyH);
    context.restore();
};

/**
* Render tiles in the given area given by the virtual tile coordinates biased by the given scroll factor.
* This will constrain the tile coordinates based on wrapping but not physical coordinates.
*
* @method Phaser.TilemapLayer#renderRegion
* @private
* @param {integer} scrollX - Render x offset/scroll.
* @param {integer} scrollY - Render y offset/scroll.
* @param {integer} left - Leftmost column to render.
* @param {integer} top - Topmost row to render.
* @param {integer} right - Rightmost column to render.
* @param {integer} bottom - Bottommost row to render.
*/
Phaser.TilemapLayer.prototype.renderRegion = function (scrollX, scrollY, left, top, right, bottom) {

    var context = this.context;

    var width = this.layer.width;
    var height = this.layer.height;
    var tw = this._mc.tileWidth;
    var th = this._mc.tileHeight;

    var tilesets = this._mc.tilesets;
    var lastAlpha = NaN;

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

    context.fillStyle = this.tileColor;

    for (y = normStartY, ymax = bottom - top, ty = baseY;
        ymax >= 0;
        y++, ymax--, ty += th)
    {

        if (y >= height) { y -= height; }

        var row = this.layer.data[y];

        for (x = normStartX, xmax = right - left, tx = baseX;
            xmax >= 0;
            x++, xmax--, tx += tw)
        {

            if (x >= width) { x -= width; }

            var tile = row[x];
            if (!tile || tile.index < 0)
            {
                continue;
            }

            var index = tile.index;

            var set = tilesets[index];
            if (set === undefined)
            {
                set = this.resolveTileset(index);
            }

            //  Setting the globalAlpha is "surprisingly expensive" in Chrome (38)
            if (tile.alpha !== lastAlpha && !this.debug)
            {
                context.globalAlpha = tile.alpha;
                lastAlpha = tile.alpha;
            }

            if (set)
            {
                set.draw(context, tx, ty, index);
            }
            else if (this.debugSettings.missingImageFill)
            {
                context.fillStyle = this.debugSettings.missingImageFill;
                context.fillRect(tx, ty, tw, th);
            }

            if (tile.debug && this.debugSettings.debuggedTileOverfill)
            {
                context.fillStyle = this.debugSettings.debuggedTileOverfill;
                context.fillRect(tx, ty, tw, th);
            }
           
        }

    }

};

/**
* Shifts the canvas and render damaged edge tiles.
*
* @method Phaser.TilemapLayer#renderDeltaScroll
* @private
*/
Phaser.TilemapLayer.prototype.renderDeltaScroll = function (shiftX, shiftY) {

    var scrollX = this._mc.scrollX;
    var scrollY = this._mc.scrollY;

    var renderW = this.canvas.width;
    var renderH = this.canvas.height;

    var tw = this._mc.tileWidth;
    var th = this._mc.tileHeight;

    // Only cells with coordinates in the "plus" formed by `left <= x <= right` OR `top <= y <= bottom` are drawn. These coordinates may be outside the layer bounds.

    // Start in pixels
    var left = 0;
    var right = -tw;
    var top = 0;
    var bottom = -th;

    if (shiftX < 0) // layer moving left, damage right
    {
        left = renderW + shiftX; // shiftX neg.
        right = renderW - 1;
    }
    else if (shiftX > 0)
    {
        // left -> 0
        right = shiftX;
    }

    if (shiftY < 0) // layer moving down, damage top
    {
        top = renderH + shiftY; // shiftY neg.
        bottom = renderH - 1;
    }
    else if (shiftY > 0)
    {
        // top -> 0
        bottom = shiftY;
    }

    this.shiftCanvas(this.context, shiftX, shiftY);

    // Transform into tile-space
    left = Math.floor((left + scrollX) / tw);
    right = Math.floor((right + scrollX) / tw);
    top = Math.floor((top + scrollY) / th);
    bottom = Math.floor((bottom + scrollY) / th);

    if (left <= right)
    {
        // Clear left or right edge
        this.context.clearRect(((left * tw) - scrollX), 0, (right - left + 1) * tw, renderH);

        var trueTop = Math.floor((0 + scrollY) / th);
        var trueBottom = Math.floor((renderH - 1 + scrollY) / th);
        this.renderRegion(scrollX, scrollY, left, trueTop, right, trueBottom);
    }
    if (top <= bottom)
    {
        // Clear top or bottom edge
        this.context.clearRect(0, ((top * th) - scrollY), renderW, (bottom - top + 1) * th);

        var trueLeft = Math.floor((0 + scrollX) / tw);
        var trueRight = Math.floor((renderW - 1 + scrollX) / tw);
        this.renderRegion(scrollX, scrollY, trueLeft, top, trueRight, bottom);
    }

};

/**
* Clear and render the entire canvas.
*
* @method Phaser.TilemapLayer#renderFull
* @private
*/
Phaser.TilemapLayer.prototype.renderFull = function ()
{
    
    var scrollX = this._mc.scrollX;
    var scrollY = this._mc.scrollY;

    var renderW = this.canvas.width;
    var renderH = this.canvas.height;

    var tw = this._mc.tileWidth;
    var th = this._mc.tileHeight;

    var left = Math.floor(scrollX / tw);
    var right = Math.floor((renderW - 1 + scrollX) / tw);
    var top = Math.floor(scrollY / th);
    var bottom = Math.floor((renderH - 1 + scrollY) / th);

    this.context.clearRect(0, 0, renderW, renderH);

    this.renderRegion(scrollX, scrollY, left, top, right, bottom);

};

/**
* Renders the tiles to the layer canvas and pushes to the display.
*
* @method Phaser.TilemapLayer#render
* @protected
*/
Phaser.TilemapLayer.prototype.render = function () {

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

    var renderWidth = this.canvas.width; // Use Sprite.width/height?
    var renderHeight = this.canvas.height;

    //  Scrolling bias; whole pixels only
    var scrollX = this._scrollX | 0;
    var scrollY = this._scrollY | 0;

    var mc = this._mc;
    var shiftX = mc.scrollX - scrollX; // Negative when scrolling right/down
    var shiftY = mc.scrollY - scrollY;

    if (!redrawAll &&
        shiftX === 0 && shiftY === 0 &&
        mc.renderWidth === renderWidth && mc.renderHeight === renderHeight)
    {
        //  No reason to redraw map, looking at same thing and not invalidated.
        return;
    }

    mc.scrollX = scrollX;
    mc.scrollY = scrollY;

    if (mc.renderWidth !== renderWidth || mc.renderHeight !== renderHeight)
    {
        //  Could support automatic canvas resizing
        mc.renderWidth = renderWidth;
        mc.renderHeight = renderHeight;
    }

    if (this.debug)
    {
        this.context.globalAlpha = this.debugSettings.debugAlpha;
        if (this.debugSettings.forceFullRedraw)
        {
            redrawAll = true;
        }
    }

    if (!redrawAll &&
        this.renderSettings.enableScrollDelta &&
        (Math.abs(shiftX) + Math.abs(shiftY)) < Math.min(renderWidth, renderHeight))
    {
        this.renderDeltaScroll(shiftX, shiftY);
    }
    else
    {
        // Too much change or otherwise requires full render
        this.renderFull();
    }

    if (this.debug)
    {
        this.context.globalAlpha = 1;
        this.renderDebug();
    }

    this.baseTexture.dirty();

    this.dirty = false;

    return true;

};

/**
* Renders a debug overlay on-top of the canvas. Called automatically by render when `debug` is true.
*
* See `debugSettings` for assorted configuration options.
*
* @method Phaser.TilemapLayer#renderDebug
* @private
*/
Phaser.TilemapLayer.prototype.renderDebug = function () {

    var scrollX = this._mc.scrollX;
    var scrollY = this._mc.scrollY;

    var context = this.context;
    var renderW = this.canvas.width;
    var renderH = this.canvas.height;

    var width = this.layer.width;
    var height = this.layer.height;
    var tw = this._mc.tileWidth;
    var th = this._mc.tileHeight;

    var left = Math.floor(scrollX / tw);
    var right = Math.floor((renderW - 1 + scrollX) / tw);
    var top = Math.floor(scrollY / th);
    var bottom = Math.floor((renderH - 1 + scrollY) / th);

    var baseX = (left * tw) - scrollX;
    var baseY = (top * th) - scrollY;

    var normStartX = (left + ((1 << 20) * width)) % width;
    var normStartY = (top + ((1 << 20) * height)) % height;

    var tx, ty, x, y, xmax, ymax;

    context.strokeStyle = this.debugSettings.facingEdgeStroke;

    for (y = normStartY, ymax = bottom - top, ty = baseY;
        ymax >= 0;
        y++, ymax--, ty += th)
    {

        if (y >= height) { y -= height; }

        var row = this.layer.data[y];

        for (x = normStartX, xmax = right - left, tx = baseX;
            xmax >= 0;
            x++, xmax--, tx += tw)
        {

            if (x >= width) { x -= width; }

            var tile = row[x];
            if (!tile || tile.index < 0 || !tile.collides)
            {
                continue;
            }

            if (this.debugSettings.collidingTileOverfill)
            {
                context.fillStyle = this.debugSettings.collidingTileOverfill;
                context.fillRect(tx, ty, this._mc.cw, this._mc.ch);
            }

            if (this.debugSettings.facingEdgeStroke)
            {
                context.beginPath();

                if (tile.faceTop)
                {
                    context.moveTo(tx, ty);
                    context.lineTo(tx + this._mc.cw, ty);
                }

                if (tile.faceBottom)
                {
                    context.moveTo(tx, ty + this._mc.ch);
                    context.lineTo(tx + this._mc.cw, ty + this._mc.ch);
                }

                if (tile.faceLeft)
                {
                    context.moveTo(tx, ty);
                    context.lineTo(tx, ty + this._mc.ch);
                }

                if (tile.faceRight)
                {
                    context.moveTo(tx + this._mc.cw, ty);
                    context.lineTo(tx + this._mc.cw, ty + this._mc.ch);
                }

                context.stroke();
            }
           
        }

    }

};

/**
* Scrolls the map horizontally or returns the current x position.
*
* @property {number} scrollX
* @memberof Phaser.TilemapLayer
* @public
*/
Object.defineProperty(Phaser.TilemapLayer.prototype, "scrollX", {

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
* @memberof Phaser.TilemapLayer
* @public
*/
Object.defineProperty(Phaser.TilemapLayer.prototype, "scrollY", {

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
* @memberof Phaser.TilemapLayer
* @public
*/
Object.defineProperty(Phaser.TilemapLayer.prototype, "collisionWidth", {

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
* @memberof Phaser.TilemapLayer
* @public
*/
Object.defineProperty(Phaser.TilemapLayer.prototype, "collisionHeight", {

    get: function () {
        return this._mc.ch;
    },

    set: function (value) {
        this._mc.ch = value | 0;
        this.dirty = true;
    }

});
