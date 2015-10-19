/**
 * @author Mat Groves
 * 
 * Big thanks to the very clever Matt DesLauriers <mattdesl> https://github.com/mattdesl/
 * for creating the original pixi version!
 * Also a thanks to https://github.com/bchevalier for tweaking the tint and alpha so that they now share 4 bytes on the vertex buffer
 * 
 * Heavily inspired by LibGDX's WebGLSpriteBatch:
 * https://github.com/libgdx/libgdx/blob/master/gdx/src/com/badlogic/gdx/graphics/g2d/WebGLSpriteBatch.java
 */

 /**
 *
 * @class WebGLSpriteBatch
 * @private
 * @constructor
 */
PIXI.WebGLSpriteBatch = function()
{
    /**
     * @property vertSize
     * @type Number
     */
    this.vertSize = 5;

    /**
     * The number of images in the SpriteBatch before it flushes
     * @property size
     * @type Number
     */
    this.size = 2000;//Math.pow(2, 16) /  this.vertSize;

    //the total number of bytes in our batch
    var numVerts = this.size * 4 * 4 * this.vertSize;
    //the total number of indices in our batch
    var numIndices = this.size * 6;

    /**
    * Holds the vertices
    *
    * @property vertices
    * @type ArrayBuffer
    */
    this.vertices = new PIXI.ArrayBuffer(numVerts);

    /**
    * View on the vertices as a Float32Array
    *
    * @property positions
    * @type Float32Array
    */
    this.positions = new PIXI.Float32Array(this.vertices);

    /**
    * View on the vertices as a Uint32Array
    *
    * @property colors
    * @type Uint32Array
    */
    this.colors = new PIXI.Uint32Array(this.vertices);

    /**
     * Holds the indices
     *
     * @property indices
     * @type Uint16Array
     */
    this.indices = new PIXI.Uint16Array(numIndices);
    
    /**
     * @property lastIndexCount
     * @type Number
     */
    this.lastIndexCount = 0;

    for (var i=0, j=0; i < numIndices; i += 6, j += 4)
    {
        this.indices[i + 0] = j + 0;
        this.indices[i + 1] = j + 1;
        this.indices[i + 2] = j + 2;
        this.indices[i + 3] = j + 0;
        this.indices[i + 4] = j + 2;
        this.indices[i + 5] = j + 3;
    }

    /**
     * @property drawing
     * @type Boolean
     */
    this.drawing = false;

    /**
     * @property currentBatchSize
     * @type Number
     */
    this.currentBatchSize = 0;

    /**
     * @property currentBaseTexture
     * @type BaseTexture
     */
    this.currentBaseTexture = null;

    /**
     * @property dirty
     * @type Boolean
     */
    this.dirty = true;

    /**
     * @property textures
     * @type Array
     */
    this.textures = [];

    /**
     * @property blendModes
     * @type Array
     */
    this.blendModes = [];

    /**
     * @property shaders
     * @type Array
     */
    this.shaders = [];

    /**
     * @property sprites
     * @type Array
     */
    this.sprites = [];

    /**
     * @property defaultShader
     * @type AbstractFilter
     */
    this.defaultShader = new PIXI.AbstractFilter([
        'precision lowp float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform sampler2D uSampler;',
        'void main(void) {',
        '   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;',
        '}'
    ]);
};

/**
* @method setContext
* @param gl {WebGLContext} the current WebGL drawing context
*/
PIXI.WebGLSpriteBatch.prototype.setContext = function(gl)
{
    this.gl = gl;

    // create a couple of buffers
    this.vertexBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();

    // 65535 is max index, so 65535 / 6 = 10922.

    //upload the index data
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

    this.currentBlendMode = 99999;

    var shader = new PIXI.PixiShader(gl);

    shader.fragmentSrc = this.defaultShader.fragmentSrc;
    shader.uniforms = {};
    shader.init();

    this.defaultShader.shaders[gl.id] = shader;
};

/**
* @method begin
* @param renderSession {Object} The RenderSession object
*/
PIXI.WebGLSpriteBatch.prototype.begin = function(renderSession)
{
    this.renderSession = renderSession;
    this.shader = this.renderSession.shaderManager.defaultShader;

    this.start();
};

/**
* @method end
*/
PIXI.WebGLSpriteBatch.prototype.end = function()
{
    this.flush();
};

/**
* @method render
* @param sprite {Sprite} the sprite to render when using this spritebatch
* @param {Matrix} [matrix] - Optional matrix. If provided the Display Object will be rendered using this matrix, otherwise it will use its worldTransform.
*/
PIXI.WebGLSpriteBatch.prototype.render = function(sprite, matrix)
{
    var texture = sprite.texture;

    //  They provided an alternative rendering matrix, so use it
    var wt = sprite.worldTransform;

    if (matrix)
    {
        wt = matrix;
    }

    // check texture..
    if (this.currentBatchSize >= this.size)
    {
        this.flush();
        this.currentBaseTexture = texture.baseTexture;
    }

    // get the uvs for the texture
    var uvs = texture._uvs;

    // if the uvs have not updated then no point rendering just yet!
    if (!uvs)
    {
        return;
    }

    var aX = sprite.anchor.x;
    var aY = sprite.anchor.y;

    var w0, w1, h0, h1;
        
    if (texture.trim)
    {
        // if the sprite is trimmed then we need to add the extra space before transforming the sprite coords.
        var trim = texture.trim;

        w1 = trim.x - aX * trim.width;
        w0 = w1 + texture.crop.width;

        h1 = trim.y - aY * trim.height;
        h0 = h1 + texture.crop.height;
    }
    else
    {
        w0 = (texture.frame.width) * (1-aX);
        w1 = (texture.frame.width) * -aX;

        h0 = texture.frame.height * (1-aY);
        h1 = texture.frame.height * -aY;
    }

    var i = this.currentBatchSize * 4 * this.vertSize;
    var resolution = texture.baseTexture.resolution;

    var a = wt.a / resolution;
    var b = wt.b / resolution;
    var c = wt.c / resolution;
    var d = wt.d / resolution;
    var tx = wt.tx;
    var ty = wt.ty;

    var colors = this.colors;
    var positions = this.positions;

    if (this.renderSession.roundPixels)
    {
        // xy
        positions[i] = a * w1 + c * h1 + tx | 0;
        positions[i+1] = d * h1 + b * w1 + ty | 0;

        // xy
        positions[i+5] = a * w0 + c * h1 + tx | 0;
        positions[i+6] = d * h1 + b * w0 + ty | 0;

         // xy
        positions[i+10] = a * w0 + c * h0 + tx | 0;
        positions[i+11] = d * h0 + b * w0 + ty | 0;

        // xy
        positions[i+15] = a * w1 + c * h0 + tx | 0;
        positions[i+16] = d * h0 + b * w1 + ty | 0;
    }
    else
    {
        // xy
        positions[i] = a * w1 + c * h1 + tx;
        positions[i+1] = d * h1 + b * w1 + ty;

        // xy
        positions[i+5] = a * w0 + c * h1 + tx;
        positions[i+6] = d * h1 + b * w0 + ty;

         // xy
        positions[i+10] = a * w0 + c * h0 + tx;
        positions[i+11] = d * h0 + b * w0 + ty;

        // xy
        positions[i+15] = a * w1 + c * h0 + tx;
        positions[i+16] = d * h0 + b * w1 + ty;
    }
    
    // uv
    positions[i+2] = uvs.x0;
    positions[i+3] = uvs.y0;

    // uv
    positions[i+7] = uvs.x1;
    positions[i+8] = uvs.y1;

     // uv
    positions[i+12] = uvs.x2;
    positions[i+13] = uvs.y2;

    // uv
    positions[i+17] = uvs.x3;
    positions[i+18] = uvs.y3;

    // color and alpha
    var tint = sprite.tint;

    colors[i+4] = colors[i+9] = colors[i+14] = colors[i+19] = (tint >> 16) + (tint & 0xff00) + ((tint & 0xff) << 16) + (sprite.worldAlpha * 255 << 24);

    // increment the batchsize
    this.sprites[this.currentBatchSize++] = sprite;

};

/**
* Renders a TilingSprite using the spriteBatch.
* 
* @method renderTilingSprite
* @param sprite {TilingSprite} the sprite to render
*/
PIXI.WebGLSpriteBatch.prototype.renderTilingSprite = function(sprite)
{
    var texture = sprite.tilingTexture;

    // check texture..
    if (this.currentBatchSize >= this.size)
    {
        this.flush();
        this.currentBaseTexture = texture.baseTexture;
    }

    // set the textures uvs temporarily
    if (!sprite._uvs)
    {
        sprite._uvs = new PIXI.TextureUvs();
    }

    var uvs = sprite._uvs;

    var w = texture.baseTexture.width;
    var h = texture.baseTexture.height;

    // var w = sprite._frame.sourceSizeW;
    // var h = sprite._frame.sourceSizeH;

    // w = 16;
    // h = 16;

    sprite.tilePosition.x %= w * sprite.tileScaleOffset.x;
    sprite.tilePosition.y %= h * sprite.tileScaleOffset.y;

    var offsetX = sprite.tilePosition.x / (w * sprite.tileScaleOffset.x);
    var offsetY = sprite.tilePosition.y / (h * sprite.tileScaleOffset.y);

    var scaleX = (sprite.width / w) / (sprite.tileScale.x * sprite.tileScaleOffset.x);
    var scaleY = (sprite.height / h) / (sprite.tileScale.y * sprite.tileScaleOffset.y);

    uvs.x0 = 0 - offsetX;
    uvs.y0 = 0 - offsetY;

    uvs.x1 = (1 * scaleX) - offsetX;
    uvs.y1 = 0 - offsetY;

    uvs.x2 = (1 * scaleX) - offsetX;
    uvs.y2 = (1 * scaleY) - offsetY;

    uvs.x3 = 0 - offsetX;
    uvs.y3 = (1 * scaleY) - offsetY;

    //  Get the sprites current alpha and tint and combine them into a single color
    var tint = sprite.tint;
    var color = (tint >> 16) + (tint & 0xff00) + ((tint & 0xff) << 16) + (sprite.worldAlpha * 255 << 24);

    var positions = this.positions;
    var colors = this.colors;

    var width = sprite.width;
    var height = sprite.height;

    // TODO trim??
    var aX = sprite.anchor.x;
    var aY = sprite.anchor.y;
    var w0 = width * (1-aX);
    var w1 = width * -aX;

    var h0 = height * (1-aY);
    var h1 = height * -aY;

    var i = this.currentBatchSize * 4 * this.vertSize;

    var resolution = texture.baseTexture.resolution;

    var wt = sprite.worldTransform;

    var a = wt.a / resolution;
    var b = wt.b / resolution;
    var c = wt.c / resolution;
    var d = wt.d / resolution;
    var tx = wt.tx;
    var ty = wt.ty;

    // xy
    positions[i++] = a * w1 + c * h1 + tx;
    positions[i++] = d * h1 + b * w1 + ty;
    // uv
    positions[i++] = uvs.x0;
    positions[i++] = uvs.y0;
    // color
    colors[i++] = color;

    // xy
    positions[i++] = (a * w0 + c * h1 + tx);
    positions[i++] = d * h1 + b * w0 + ty;
    // uv
    positions[i++] = uvs.x1;
    positions[i++] = uvs.y1;
    // color
    colors[i++] = color;
    
    // xy
    positions[i++] = a * w0 + c * h0 + tx;
    positions[i++] = d * h0 + b * w0 + ty;
    // uv
    positions[i++] = uvs.x2;
    positions[i++] = uvs.y2;
    // color
    colors[i++] = color;

    // xy
    positions[i++] = a * w1 + c * h0 + tx;
    positions[i++] = d * h0 + b * w1 + ty;
    // uv
    positions[i++] = uvs.x3;
    positions[i++] = uvs.y3;
    // color
    colors[i++] = color;

    // increment the batchsize
    this.sprites[this.currentBatchSize++] = sprite;
};

/**
* Renders the content and empties the current batch.
*
* @method flush
*/
PIXI.WebGLSpriteBatch.prototype.flush = function()
{
    // If the batch is length 0 then return as there is nothing to draw
    if (this.currentBatchSize === 0)
    {
        return;
    }

    var gl = this.gl;
    var shader;

    if (this.dirty)
    {
        this.dirty = false;

        // bind the main texture
        gl.activeTexture(gl.TEXTURE0);

        // bind the buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        shader = this.defaultShader.shaders[gl.id];

        // this is the same for each shader?
        var stride = this.vertSize * 4;
        gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, stride, 0);
        gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, stride, 2 * 4);

        // color attributes will be interpreted as unsigned bytes and normalized
        gl.vertexAttribPointer(shader.colorAttribute, 4, gl.UNSIGNED_BYTE, true, stride, 4 * 4);
    }

    // upload the verts to the buffer  
    if (this.currentBatchSize > (this.size * 0.5))
    {
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);
    }
    else
    {
        var view = this.positions.subarray(0, this.currentBatchSize * 4 * this.vertSize);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, view);
    }

    var nextTexture, nextBlendMode, nextShader;
    var batchSize = 0;
    var start = 0;

    var currentBaseTexture = null;
    var currentBlendMode = this.renderSession.blendModeManager.currentBlendMode;
    var currentShader = null;

    var blendSwap = false;
    var shaderSwap = false;
    var sprite;

    for (var i = 0, j = this.currentBatchSize; i < j; i++) {
        
        sprite = this.sprites[i];

        if (sprite.tilingTexture)
        {
            nextTexture = sprite.tilingTexture.baseTexture;
        }
        else
        {
            nextTexture = sprite.texture.baseTexture;
        }

        nextBlendMode = sprite.blendMode;
        nextShader = sprite.shader || this.defaultShader;

        blendSwap = currentBlendMode !== nextBlendMode;
        shaderSwap = currentShader !== nextShader; // should I use _UIDS???

        if ((currentBaseTexture !== nextTexture && !nextTexture.skipRender) || blendSwap || shaderSwap)
        {
            this.renderBatch(currentBaseTexture, batchSize, start);

            start = i;
            batchSize = 0;
            currentBaseTexture = nextTexture;

            if (blendSwap)
            {
                currentBlendMode = nextBlendMode;
                this.renderSession.blendModeManager.setBlendMode(currentBlendMode);
            }

            if (shaderSwap)
            {
                currentShader = nextShader;
                
                shader = currentShader.shaders[gl.id];

                if (!shader)
                {
                    shader = new PIXI.PixiShader(gl);

                    shader.fragmentSrc = currentShader.fragmentSrc;
                    shader.uniforms = currentShader.uniforms;
                    shader.init();

                    currentShader.shaders[gl.id] = shader;
                }

                // set shader function???
                this.renderSession.shaderManager.setShader(shader);

                if (shader.dirty)
                {
                    shader.syncUniforms();
                }
                
                // both these only need to be set if they are changing..
                // set the projection
                var projection = this.renderSession.projection;
                gl.uniform2f(shader.projectionVector, projection.x, projection.y);

                // TODO - this is temporary!
                var offsetVector = this.renderSession.offset;
                gl.uniform2f(shader.offsetVector, offsetVector.x, offsetVector.y);

                // set the pointers
            }
        }

        batchSize++;
    }

    this.renderBatch(currentBaseTexture, batchSize, start);

    // then reset the batch!
    this.currentBatchSize = 0;
};

/**
* @method renderBatch
* @param texture {Texture}
* @param size {Number}
* @param startIndex {Number}
*/
PIXI.WebGLSpriteBatch.prototype.renderBatch = function(texture, size, startIndex)
{
    if (size === 0)
    {
        return;
    }

    var gl = this.gl;

    // check if a texture is dirty..
    if (texture._dirty[gl.id])
    {
        if (!this.renderSession.renderer.updateTexture(texture))
        {
            //  If updateTexture returns false then we cannot render it, so bail out now
            return;
        }
    }
    else
    {
        // bind the current texture
        gl.bindTexture(gl.TEXTURE_2D, texture._glTextures[gl.id]);
    }

    // now draw those suckas!
    gl.drawElements(gl.TRIANGLES, size * 6, gl.UNSIGNED_SHORT, startIndex * 6 * 2);
    
    // increment the draw count
    this.renderSession.drawCount++;
};

/**
* @method stop
*/
PIXI.WebGLSpriteBatch.prototype.stop = function()
{
    this.flush();
    this.dirty = true;
};

/**
* @method start
*/
PIXI.WebGLSpriteBatch.prototype.start = function()
{
    this.dirty = true;
};

/**
* Destroys the SpriteBatch.
* 
* @method destroy
*/
PIXI.WebGLSpriteBatch.prototype.destroy = function()
{
    this.vertices = null;
    this.indices = null;
    
    this.gl.deleteBuffer(this.vertexBuffer);
    this.gl.deleteBuffer(this.indexBuffer);
    
    this.currentBaseTexture = null;
    
    this.gl = null;
};