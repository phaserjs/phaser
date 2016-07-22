/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Pete Baron <pete@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
 * A PIXI WebGL Tilemap.
 *
 * @class PIXI.Tilemap
 * @extends {PIXI.DisplayObject}
 * @param {PIXI.Texture} texture - The tilemap texture.
 * @param {integer} displayWidth - The width of the display area. Used as the clipping limit for the shader.
 * @param {integer} displayHeight - The height of the display area. Used as the clipping limit for the shader.
 * @param {integer} mapWidth - The width of the map.
 * @param {integer} mapHeight - The height of the map.
 * @param {integer} tileWidth - The width of a single tile.
 * @param {integer} tileHeight - The height of a single tile.
 * @param {Array} layer - Tilemap layer data from the map, arranged in mapHeight lists of mapWidth Phaser.Tile objects (2d array).
 */
PIXI.Tilemap = function (texture, displayWidth, displayHeight, mapWidth, mapHeight, tileWidth, tileHeight, layer) {

    PIXI.DisplayObject.call(this);

    /**
     * The texture of the Tilemap
     *
     * @property texture
     * @type Texture
     */
    this.texture = texture;

    /**
     * The clipping limit of the display area.
     *
     * @property _displayWidth
     * @type integer
     * @private
     */
    this._displayWidth = displayWidth;

    /**
     * The clipping limit of the display area.
     *
     * @property _displayHeight
     * @type integer
     * @private
     */
    this._displayHeight = displayHeight;

    /**
     * The width of a single tile in pixels.
     *
     * @property tileWidth
     * @type integer
     */
    this.tileWidth = tileWidth;

    /**
     * The height of a single tile in pixels.
     *
     * @property tileHeight
     * @type integer
     */
    this.tileHeight = tileHeight;

    /**
     * The width of the map in tiles.
     *
     * @property mapWidth
     * @type integer
     */
    this.mapWidth = mapWidth;

    /**
     * The height of the map in tiles.
     *
     * @property mapHeight
     * @type integer
     */
    this.mapHeight = mapHeight;

    /**
     * The width of the map in pixels.
     *
     * @property width
     * @type integer
     */
    this.pxWidth = this.mapWidth * this.tileWidth;

    /**
     * The height of the map in pixels.
     *
     * @property height
     * @type integer
     */
    this.pxHeight = this.mapHeight * this.tileHeight;

    /**
     * Tilemap layer data from the map, arranged in mapHeight lists of mapWidth tiles.
     * Contains Phaser.Tile objects (2d array).
     *
     * @property layer
     * @type Array
     */
    this.layer = layer;

    /**
     * Store the list of batch drawing instructions.
     *
     * @property glBatch
     * @type Array
     */
    this.glBatch = null;

    /**
     * Remember last tile drawn to avoid unnecessary set-up.
     *
     * @property lastTile
     * @type integer
     */
    this.lastTile = -1;

    /**
     * Whether the Tilemap is dirty or not.
     *
     * @property dirty
     * @type boolean
     */
    this.dirty = true;

    /**
     * The blend mode to be applied to the tilemap.
     * Set to PIXI.blendModes.NORMAL to remove any blend mode.
     *
     * @property blendMode
     * @type integer
     * @default PIXI.blendModes.NORMAL;
     */
    this.blendMode = PIXI.blendModes.NORMAL;

    /**
     * The size of a single data element in the batch drawing.
     * Each tile requires two triangles, each specified as:
     * float left, bottom, right, top - screen coordinates
     * float u, v, wide, high - source texture coordinates
     *
     * @property batchDataElement
     * @type integer
     */
    this.batchDataElement = 16;

    /**
     * Create the buffer data for the WebGL rendering of this tilemap.
     * Calculates the total batch data size.
     *
     * @property buffer
     * @type PIXI.Float32Array
     */
    this.buffer = new PIXI.Float32Array(mapWidth * mapHeight * this.batchDataElement);

    /**
     * A required but un-used array.
     * Do not add objects to this array, Tilemaps cannot have children.
     *
     * @property children
     * @type Array
     * @private
     */
    this.children = [];

};

PIXI.Tilemap.prototype = Object.create(PIXI.DisplayObject.prototype);
PIXI.Tilemap.prototype.constructor = PIXI.Tilemap;

PIXI.Tilemap.prototype.update = function () {};
PIXI.Tilemap.prototype.postUpdate = function () {};

PIXI.Tilemap.prototype._initWebGL = function (renderSession) {

    var gl = renderSession.gl;

    // create a GL buffer to transfer all the vertex position data through
    this.positionBuffer = gl.createBuffer();

    // bind the buffer to the RAM resident positionBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.buffer, gl.STATIC_DRAW);

};

// override PIXI.DisplayObjectContainer _renderWebGL
PIXI.Tilemap.prototype._renderWebGL = function (renderSession) {

    // if the sprite is not visible or the alpha is 0 then no need to render this element
    if (!this.visible || this.alpha <= 0)
    {
        return;
    }

    // stop current render session batch drawing
    renderSession.spriteBatch.stop();

    if (!this.positionBuffer)
    {
        this._initWebGL(renderSession);
    }

    renderSession.shaderManager.setShader(renderSession.shaderManager.tilemapShader);

    this._renderWholeTilemap(renderSession);

    // restart batch drawing now that this Tile layer has been rendered
    renderSession.spriteBatch.start();

};

PIXI.Tilemap.prototype._renderBatch = function (renderSession) {

    if (!this.glBatch)
    {
        return;
    }

    var gl = renderSession.gl;

    // TODO: should probably use destination buffer dimensions (halved)
    var screenWide2 = this.game.width * 0.5;
    var screenHigh2 = this.game.height * 0.5;

    // size of one pixel in the source texture
    var iTextureWide = 1.0 / this.texture.width;
    var iTextureHigh = 1.0 / this.texture.height;

    // pre-calculate inverse half-buffer dimensions
    var iWide = 1.0 / screenWide2;
    var iHigh = 1.0 / screenHigh2;

    var wide = this.tileWidth * 0.5 / screenWide2;
    var high = this.tileHeight * 0.5 / screenHigh2;

    var buffer = this.buffer;
    var oldR, oldT, uvl, uvt;

    // process entire glBatch into a single webGl draw buffer for a TRIANGLE_STRIP blit
    var c = 0;
    var degenerate = false;

    for (var i = 0, l = this.glBatch.length; i < l; i++)
    {
        // each object in this.glBatch has properties:
        // sx: this.drawCoords[coordIndex],
        // sy: this.drawCoords[coordIndex + 1],
        // sw: this.tileWidth,
        // sh: this.tileHeight,
        // dx: x,
        // dy: y,
        // dw: this.tileWidth,
        // dh: this.tileHeight
        var t = this.glBatch[i];

        if (!t)
        {
            // insert a degenerate triangle when null is found in the list of batch objects
            degenerate = true;

            // skip to end of loop, degenerate will be inserted when no more null objects are found
            continue;
        }

        var x = t.dx * iWide - 1;
        var y = 1 - t.dy * iHigh;

        var lft = x - wide;
        var bot = y + high;

        var uvl = t.sx * iTextureWide;
        var uvt = t.sy * iTextureHigh; 

        // insert a degenerate triangle to separate the tiles
        if (degenerate)
        {
            // add a degenerate triangle: repeat the last vertex
            buffer[ c     ] = oldR;
            buffer[ c + 1 ] = oldT;

            // then repeat the next vertex
            buffer[ c + 4 ] = lft;
            buffer[ c + 5 ] = bot;

            // pad with texture coordinates (probably not needed)
            buffer[ c + 2 ] = buffer[ c + 6 ] = uvl;
            buffer[ c + 3 ] = buffer[ c + 7 ] = uvt;

            // advance the buffer index for one single degenerate triangle
            c += 8;
            degenerate = false;
        }

        // calculate the destination location of the tile in screen units (-1..1)
        buffer[ c     ] = buffer[ c + 4  ] = lft;
        buffer[ c + 1 ] = buffer[ c + 9  ] = bot;
        buffer[ c + 8 ] = buffer[ c + 12 ] = oldR = x + wide;
        buffer[ c + 5 ] = buffer[ c + 13 ] = oldT = y - high;

        // calculate the uv coordinates of the tile source image
        if (t.fd === 1)
        {
            // flipped diagonally, swap x,y axes
            buffer[ c + 14 ] = buffer[ c + 6  ] = uvl;
            buffer[ c + 15 ] = buffer[ c + 11 ] = uvt;
            buffer[ c + 10 ] = buffer[ c + 2  ] = uvl + t.sw * iTextureWide;
            buffer[ c + 7  ] = buffer[ c + 3  ] = uvt + t.sh * iTextureHigh;
        }
        else
        {
            buffer[ c + 2  ] = buffer[ c + 6  ] = uvl;
            buffer[ c + 3  ] = buffer[ c + 11 ] = uvt;
            buffer[ c + 10 ] = buffer[ c + 14 ] = uvl + t.sw * iTextureWide;
            buffer[ c + 7  ] = buffer[ c + 15 ] = uvt + t.sh * iTextureHigh;
        }

        // advance the buffer index
        c += 16;
    }

    // if there's anything to draw...
    if (c > 0)
    {
        var shader = renderSession.shaderManager.tilemapShader;

        // upload the VBO
        gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);

        // prepare the shader attributes
        gl.vertexAttribPointer(shader.aPosition, 4, gl.FLOAT, false, 0, 0);

        // draw the entire VBO in one call
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, Math.floor(c / 4));
    }

};

/**
* Render the entire tilemap using a fast WebGL batched tile render.
*
* @param  {Object} renderSession - The PIXI RenderSession.
*/
PIXI.Tilemap.prototype._renderWholeTilemap = function (renderSession) {

    var gl = renderSession.gl;

    var shader = renderSession.shaderManager.tilemapShader;

    renderSession.blendModeManager.setBlendMode(this.blendMode);

    // set the uniforms and texture

    // set the global offset (e.g. screen shake)
    gl.uniform2f(shader.uOffset, renderSession.offset.x / this.game.width * 2, -renderSession.offset.y / this.game.height * 2);

    // set the clipping limits
    gl.uniform2f(shader.uClipOffset, this._mc.x / this.game.width * 2, this._mc.y / this.game.height * 2);
    gl.uniform2f(shader.uClipLoc, this._mc.x, this._mc.y);
    gl.uniform2f(shader.uClipLimit, this._mc.x + this._displayWidth, this.game.height - (this._mc.y + this._displayHeight));

    // set the offset in screen units to the center of the screen
    // and flip the GL y coordinate to be zero at the top
    gl.uniform2f(shader.uCentreOffset, 1, -1);

    // alpha value for whole batch
    gl.uniform1f(shader.uAlpha, this.alpha);

    // scale factors for whole batch
    gl.uniform2f(shader.uScale, this.worldScale.x, this.worldScale.y);

    // source texture unit
    gl.activeTexture(gl.TEXTURE0);

    // check if a texture is dirty...
    if(this.texture.baseTexture._dirty[gl.id])
    {
        renderSession.renderer.updateTexture(this.texture.baseTexture);
    }
    else
    {
        // bind the current texture
        gl.bindTexture(gl.TEXTURE_2D, this.texture.baseTexture._glTextures[gl.id]);
    }

    // bind the source buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

    // draw the batched tile list
    this._renderBatch(renderSession);

};
