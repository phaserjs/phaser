

PIXI.Tilemap = function(texture, map)
{
    PIXI.DisplayObjectContainer.call(this);

    /**
     * The texture of the Tilemap
     *
     * @property texture
     * @type Texture
     */
    this.texture = texture;

    /**
     * The tilemap object
     *
     * @property map
     * @type Object
     */
    this.map = map;

    // faster access to the tile dimensions
    this.tileWide = this.map.tilewidth;
    this.tileHigh = this.map.tileheight;

    // precalculate the width of the source texture in entire tile units
    this.texTilesWide = Math.ceil(this.texture.width / this.tileWide);
    this.texTilesHigh = Math.ceil(this.texture.height / this.tileHigh);

    // proportion of texture used by one tile (uv coordinate scales)
    this.sx = this.tileWide / this.texture.width;
    this.sy = this.tileHigh / this.texture.height;

    // TODO: switch here to create DisplayObjectContainer at correct size for the render mode
    this.width = this.map.width * this.tileWide;
    this.height = this.map.height * this.tileHigh;

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
     * The blend mode to be applied to the sprite. Set to PIXI.blendModes.NORMAL to remove any blend mode.
     *
     * @property blendMode
     * @type Number
     * @default PIXI.blendModes.NORMAL;
     */
    this.blendMode = PIXI.blendModes.NORMAL;

    // create buffer with all data required by shader to draw this object
    this.buffer = new PIXI.Float32Array(16);

    /**
     * create buffer data for the webgl rendering of this tile
     * the buffer has parts of it overwritten for each tile
     * but other parts remain constant throughout
     */
    
    // screen destination position of tile corners relative to 0,0 (constant)
    // l, b,    0,1
    // l, t,    4,5
    // r, b,    8,9
    // r, t,    12,13
    var l = 0;
    var r = l + this.tileWide;
    var t = 0;
    var b = t + this.tileHigh;

    this.buffer[ 0 ] = this.buffer[ 4 ] = l;
    this.buffer[ 1 ] = this.buffer[ 9 ] = b;
    this.buffer[ 8 ] = this.buffer[ 12] = r;
    this.buffer[ 5 ] = this.buffer[ 13] = t;

    // texture source position for the whole texture (uv coordinates adjusted for each tile)
    // l, b,    2,3
    // l, t,    6,7
    // r, b,    10,11
    // r, t,    14,15
    this.buffer[ 2 ] = this.buffer[ 6 ] = 0;
    this.buffer[ 3 ] = this.buffer[ 11] = 1;
    this.buffer[ 10] = this.buffer[ 14] = 1;
    this.buffer[ 7 ] = this.buffer[ 15] = 0;
};

// constructor
PIXI.Tilemap.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
PIXI.Tilemap.prototype.constructor = PIXI.Tilemap;

PIXI.Tilemap.prototype.update = function() {};
PIXI.Tilemap.prototype.postUpdate = function() {};


PIXI.Tilemap.prototype._renderWebGL = function(renderSession)
{
    // if the sprite is not visible or the alpha is 0 then no need to render this element
    if(!this.visible || this.alpha <= 0)
    {
        return;
    }

    renderSession.spriteBatch.stop();

    // init! init!
    if(!this._vertexBuffer)
    {
      this._initWebGL(renderSession);
    }

    renderSession.shaderManager.setShader(renderSession.shaderManager.tilemapShader);

    // TODO: switch to the appropriate rendering mode function here (rebuild all, part, edges, none)
    this._renderWholeTilemap(renderSession);

    renderSession.spriteBatch.start();
};


PIXI.Tilemap.prototype._initWebGL = function(renderSession)
{
    var gl = renderSession.gl;

    this._vertexBuffer = gl.createBuffer();
    this._indexBuffer = gl.createBuffer();
    this._uvBuffer = gl.createBuffer();
    this._colorBuffer = gl.createBuffer();

    // create a GL buffer to transfer all the vertex position data through
    this.positionBuffer = gl.createBuffer();
    // bind the buffer to the RAM resident positionBuffer
    gl.bindBuffer( gl.ARRAY_BUFFER, this.positionBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, this.buffer, gl.STATIC_DRAW );
};


PIXI.Tilemap.prototype.makeProjection = function(_width, _height)
{
  // project coordinates into a 2x2 number range, starting at (-1, 1)
  var m = new PIXI.Float32Array(9);
  m[0] = 2 / _width;
  m[1] = 0;
  m[2] = 0;

  m[3] = 0;
  m[4] = -2 / _height;
  m[5] = 0;
  
  m[6] = -1;
  m[7] = 1;
  m[8] = 1;
  return m;
};


/*
PIXI.Tilemap.prototype.makeTransform = function(_x, _y, _angleInRadians, _scaleX, _scaleY)
{
  var c = Math.cos( _angleInRadians );
  var s = Math.sin( _angleInRadians );
  var m = new Float32Array(9);
  m[0] = c * _scaleX;
  m[1] = -s * _scaleY;
  m[2] = 0;
  m[3] = s * _scaleX;
  m[4] = c * _scaleY;
  m[5] = 0;
  m[6] = _x;
  m[7] = _y;
  m[8] = 1;
  return m;
};


/**
 * render the entire tilemap, one layer at a time, one tile at a time
 * using a fast webgl tile render
 *
 * @param  {[type]} renderSession [description]
 */
PIXI.Tilemap.prototype._renderWholeTilemap = function(renderSession)
{
  var gl = renderSession.gl;
  var shader = renderSession.shaderManager.tilemapShader;

  renderSession.blendModeManager.setBlendMode(this.blendMode);

  // set the uniforms and texture
  gl.uniformMatrix3fv( shader.uProjectionMatrix, false, this.makeProjection(gl.drawingBufferWidth, gl.drawingBufferHeight) );
  gl.uniform1i( shader.uImageSampler, 0 );
  gl.activeTexture(gl.TEXTURE0);
  gl.uniform2f(shader.uTileSize, this.tileWide, this.tileHigh);

  // check if a texture is dirty..
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
  gl.bindBuffer( gl.ARRAY_BUFFER, this.positionBuffer );

  // draw all map layers
  for(var l = 0; l < this.map.layers.length; l++)
  {
    // draw an entire map layer
    this._renderLayer(l, renderSession);
  }
};


PIXI.Tilemap.prototype._renderLayer = function( _which, renderSession )
{
  var gl = renderSession.gl;
  var shader = renderSession.shaderManager.tilemapShader;

  var layer = this.map.layers[_which];
  if ( layer )
  {
    var wide = layer.width, high = layer.height;
    for(var y = 0; y < high; y++)
    {
      for(var x = 0; x < wide; x++)
      {
        this._renderTile(gl, shader, x * this.tileWide, y * this.tileHigh, layer.data[x + y * wide] - 1);
      }
    }

  }
};


PIXI.Tilemap.prototype._renderTile = function(gl, shader, x, y, tile)
{
  // if repeating same tile, skip almost everything...
  if ( tile != this.lastTile )
  {
    // tile coordinates in the source texture
    var tx = tile % this.texTilesWide;
    var ty = Math.floor(tile / this.texTilesWide);

    var l = tx * this.sx;
    var r = l + this.sx;
    var t = ty * this.sy;
    var b = t + this.sy;
    // texture source position for this tile (uv values)
    // l, b,    2,3
    // l, t,    6,7
    // r, b,    10,11
    // r, t,    14,15
    this.buffer[ 2 ] = this.buffer[ 6 ] = l;
    this.buffer[ 3 ] = this.buffer[ 11] = b;
    this.buffer[ 10] = this.buffer[ 14] = r;
    this.buffer[ 7 ] = this.buffer[ 15] = t;

    this.lastTile = tile;
  }

  // send the latest buffer
  gl.bufferData( gl.ARRAY_BUFFER, this.buffer, gl.STATIC_DRAW );
  gl.vertexAttribPointer( shader.aPosition, 4, gl.FLOAT, false, 0, 0 );

  gl.uniform2f(shader.uScreenPosition, x, y);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

/*
PIXI.Tilemap.prototype.updateTransform = function()
{
  PIXI.DisplayObjectContainer.prototype.updateTransform.call( this );
};
*/

/**
 * When the texture is updated, this event will fire to update the scale and frame
 *
 * @method onTextureUpdate
 * @param event
 * @private
 */

PIXI.Tilemap.prototype.onTextureUpdate = function()
{
    this.updateFrame = true;
};

/**
 * Returns the bounds of the map as a rectangle. The bounds calculation takes the worldTransform into account.
 *
 * @method getBounds
 * @param matrix {Matrix} the transformation matrix of the sprite
 * @return {Rectangle} the framing rectangle
 */
PIXI.Tilemap.prototype.getBounds = function(matrix)
{
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
      this.map.width * this.tileWide, 0,
      this.map.width * this.tileWide, this.map.height * this.tileHigh,
      0, this.map.height * this.tileHigh
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

