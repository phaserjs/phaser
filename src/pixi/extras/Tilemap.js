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
 * @extends {DisplayObjectContainer}
 * @param {PIXI.Texture} texture - The tilemap texture.
 * @param {integer} mapwidth - The width of the map.
 * @param {integer} mapheight - The height of the map.
 * @param {integer} tilewidth 0- The width of a single tile.
 * @param {integer} tileheight - The height of a single tile.
 * @param {Array} layer - Tilemap layer data from the map, arranged in mapheight lists of mapwidth Phaser.Tile objects (2d array).
 */
PIXI.Tilemap = function (texture, mapwidth, mapheight, tilewidth, tileheight, layer) {

    PIXI.DisplayObjectContainer.call(this);

    /**
     * The texture of the Tilemap
     *
     * @property texture
     * @type Texture
     */
    this.texture = texture;

    // faster access to the tile dimensions
    this.tileWide = tilewidth;
    this.tileHigh = tileheight;
    this.mapWide = mapwidth;
    this.mapHigh = mapheight;

    // TODO: switch here to create DisplayObjectContainer at correct size for the render mode
    this.width = this.mapWide * this.tileWide;
    this.height = this.mapHigh * this.tileHigh;

    this.layer = layer;

    // store the list of batch drawing instructions (for use with WebGL rendering)
    this.glBatch = null;

    /**
     * Remember last tile drawn to avoid unnecessary set-up
     *
     * @type Integer
     */
    this.lastTile = -1;

    /**
     * Whether the Tilemap is dirty or not
     *
     * @property dirty
     * @type Boolean
     */
    this.dirty = true;

    /**
     * The blend mode to be applied to the tilemap. Set to PIXI.blendModes.NORMAL to remove any blend mode.
     *
     * @property blendMode
     * @type Number
     * @default PIXI.blendModes.NORMAL;
     */
    this.blendMode = PIXI.blendModes.NORMAL;

    /**
     * The size of a single data element in the batch drawing.
     * Each tile requires two triangles, each specified as:
     * float left, bottom, right, top - screen coordinates
     * float u, v, wide, high - source texture coordinates
     *
     * @type {Number}
     */
    this.batchDataElement = 16;

    // calculate total batch data size
    var dataSize = mapwidth * mapheight * this.batchDataElement;

    // create buffer data for the webgl rendering of this tile
    this.buffer = new PIXI.Float32Array(dataSize);

};

// constructor, this class extends PIXI.DisplayObjectContainer
PIXI.Tilemap.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
PIXI.Tilemap.prototype.constructor = PIXI.Tilemap;

// unused methods overridden to prevent default behavior
PIXI.Tilemap.prototype.update = function () {};
PIXI.Tilemap.prototype.postUpdate = function () {};

// override PIXI.DisplayObjectContainer _renderWebGL
PIXI.Tilemap.prototype._renderWebGL = function (renderSession) {

    // if the sprite is not visible or the alpha is 0 then no need to render this element
    if (!this.visible || this.alpha <= 0)
    {
        return;
    }

    // stop current render session batch drawing
    renderSession.spriteBatch.stop();

    if (!this._vertexBuffer)
    {
        this._initWebGL(renderSession);
    }

    renderSession.shaderManager.setShader(renderSession.shaderManager.tilemapShader);

    this._renderWholeTilemap(renderSession);

    // restart batch drawing now that this Tile layer has been rendered
    renderSession.spriteBatch.start();

};

PIXI.Tilemap.prototype._initWebGL = function (renderSession) {

    var gl = renderSession.gl;

    this._vertexBuffer = gl.createBuffer();
    this._indexBuffer = gl.createBuffer();
    this._uvBuffer = gl.createBuffer();
    this._colorBuffer = gl.createBuffer();

    // create a GL buffer to transfer all the vertex position data through
    this.positionBuffer = gl.createBuffer();

    // bind the buffer to the RAM resident positionBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.buffer, gl.STATIC_DRAW);

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

    // size of one tile in the source texture
    var srcWide = this.tileWide * iTextureWide;
    var srcHigh = this.tileHigh * iTextureHigh;

    // pre-calculate inverse half-buffer dimensions
    var iWide = 1.0 / screenWide2;
    var iHigh = 1.0 / screenHigh2;

    var wide = this.tileWide * 0.5 / screenWide2;
    var high = this.tileHigh * 0.5 / screenHigh2;

    var buffer = this.buffer;
    var oldR, oldT, uvl, uvt;

    // process entire glBatch into a single webGl draw buffer for a TRIANGLE_STRIP blit
    var c = 0;
    var degenerate = false;

    for (var i = 0, l = this.glBatch.length; i < l; i++)
    {
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
        buffer[ c     ] = buffer[ c + 4 ] = lft;
        buffer[ c + 1 ] = buffer[ c + 9 ] = bot;
        buffer[ c + 8 ] = buffer[ c + 12] = oldR = x + wide;
        buffer[ c + 5 ] = buffer[ c + 13] = oldT = y - high;

        // calculate the uv coordinates of the tile source image
        buffer[ c + 2 ] = buffer[ c + 6 ] = uvl;
        buffer[ c + 3 ] = buffer[ c + 11] = uvt;
        buffer[ c + 10] = buffer[ c + 14] = uvl + srcWide;
        buffer[ c + 7 ] = buffer[ c + 15] = uvt + srcHigh;

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
* render the entire tilemap using a fast webgl batched tile render
*
* @param  {[type]} renderSession [description]
*/
PIXI.Tilemap.prototype._renderWholeTilemap = function (renderSession) {

    var gl = renderSession.gl;

    var shader = renderSession.shaderManager.tilemapShader;

    renderSession.blendModeManager.setBlendMode(this.blendMode);

    // set the uniforms and texture

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

/**
 * When the texture is updated, this event will fire to update the scale and frame
 *
 * @method onTextureUpdate
 * @param event
 * @private
 */
PIXI.Tilemap.prototype.onTextureUpdate = function () {

    this.updateFrame = true;

};

/**
 * Returns the bounds of the map as a rectangle. The bounds calculation takes the worldTransform into account.
 *
 * @method getBounds
 * @param matrix {Matrix} the transformation matrix of the sprite
 * @return {Rectangle} the framing rectangle
 */
PIXI.Tilemap.prototype.getBounds = function (matrix) {

    var worldTransform = matrix || this.worldTransform;

    var a = worldTransform.a;
    var b = worldTransform.b;
    var c = worldTransform.c;
    var d = worldTransform.d;
    var tx = worldTransform.tx;
    var ty = worldTransform.ty;

    var maxX = -Infinity;
    var maxY = -Infinity;

    var minX = Infinity;
    var minY = Infinity;

    var vertices = [
        0, 0,
        this.mapWide * this.tileWide, 0,
        this.mapWide * this.tileWide, this.mapHigh * this.tileHigh,
        0, this.mapHigh * this.tileHigh
    ];

    for (var i = 0, n = vertices.length; i < n; i += 2)
    {
        var rawX = vertices[i], rawY = vertices[i + 1];
        var x = (a * rawX) + (c * rawY) + tx;
        var y = (d * rawY) + (b * rawX) + ty;

        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;

        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;
    }

    if (minX === -Infinity || maxY === Infinity)
    {
        return PIXI.EmptyRectangle;
    }

    var bounds = this._bounds;

    bounds.x = minX;
    bounds.width = maxX - minX;

    bounds.y = minY;
    bounds.height = maxY - minY;

    // store a reference so that if this function gets called again in the render cycle we do not have to recalculate
    this._currentBounds = bounds;

    return bounds;

};
