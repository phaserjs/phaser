/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Mat Groves (@Doormat23)
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* New version of PIXI.WebGLSpriteBatch
*
* @class Phaser.Renderer.Canvas
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
*/
Phaser.Renderer.WebGL.BatchManager = function (renderer)
{
    this.renderer = renderer;

    this.gl = null;

    //  Total number of objects we'll batch before flushing and rendering
    this.maxBatchSize = 2000;

    this.halfBatchSize = this.maxBatchSize / 2;

    //  Vertex Data Size is calculated by adding together:
    //
    //  Position (vec2) = 4 * 2 bytes
    //  UV (vec2) = 4 * 2 bytes
    //  Color (float) = 4 bytes
    //  Texture Index (float) OR tint (float) = 4 bytes

    this.vertSize = (4 * 2) + (4 * 2) + (4);

    var numVerts = this.vertSize * this.maxBatchSize * 4;

    this.vertices = new ArrayBuffer(numVerts);

    //  Number of total quads allowed in the batch * 6
    //  6 because there are 2 triangles per quad, and each triangle has 3 indices
    this.indices = new Uint16Array(this.maxBatchSize * 6);

    //  View on the vertices as a Float32Array
    this.positions = new Float32Array(this.vertices);

    //  View on the vertices as a Uint32Array
    this.colors = new Uint32Array(this.vertices);

    this.currentTextureSource = null;

    this.currentBatchSize = 0;
    this.dirty = true;
    this.sprites = [];

    /**
     * The WebGL program.
     * @property program
     * @type Any
     */
    this.program = null;

    /**
    * The Default Vertex shader source.
    *
    * @property defaultVertexSrc
    * @type String
    this.multivertexSrc = [
        'attribute vec2 aVertexPosition;',
        'attribute vec2 aTextureCoord;',
        'attribute vec4 aColor;',
        'attribute float aTextureIndex;',

        'uniform vec2 projectionVector;',
        'uniform vec2 offsetVector;',

        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'varying float vTextureIndex;',

        'const vec2 center = vec2(-1.0, 1.0);',

        'void main(void) {',
        '   if (aTextureIndex > 0.0) gl_Position = vec4(0.0);',
        '   gl_Position = vec4( ((aVertexPosition + offsetVector) / projectionVector) + center, 0.0, 1.0);',
        '   vTextureCoord = aTextureCoord;',
        '   vColor = vec4(aColor.rgb * aColor.a, aColor.a);',
        '   vTextureIndex = aTextureIndex;',
        '}'
    ];
    */

    this.vertexSrc = [
        'attribute vec2 aVertexPosition;',
        'attribute vec2 aTextureCoord;',
        'attribute vec4 aColor;',

        'uniform vec2 projectionVector;',

        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',

        'const vec2 center = vec2(-1.0, 1.0);',

        'void main(void) {',
        '   gl_Position = vec4((aVertexPosition / projectionVector) + center, 0.0, 1.0);',
        '   vTextureCoord = aTextureCoord;', // pass the texture coordinate to the fragment shader, the GPU will interpolate the points
        '   vColor = vec4(aColor.rgb * aColor.a, aColor.a);',
        '}'
    ];

    /**
     * The fragment shader.
     * @property fragmentSrc
     * @type Array
    */
    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;', // the texture coords passed in from the vertex shader
        'varying vec4 vColor;', //  the color value passed in from the vertex shader (texture color + alpha + tint)
        'varying float vTextureIndex;',
        'uniform sampler2D uSampler;', // our texture
        'const vec4 PINK = vec4(1.0, 0.0, 1.0, 1.0);',
        'void main(void) {',
        '   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor;', // get the color from the texture
        // '   gl_FragColor = PINK;', // debugging
        '}'
    ];

    //  @type {WebGLUniformLocation }
    this.uSampler;

    //  @type {WebGLUniformLocation }
    this.projectionVector;

    //  @type {WebGLUniformLocation }
    // this.offsetVector;

    //  @type {GLint}
    this.colorAttribute;

    //  @type {GLint}
    this.aTextureIndex;

    //  @type {GLint}
    this.aVertexPosition;

    //  @type {GLint}
    this.aTextureCoord;
};

Phaser.Renderer.WebGL.BatchManager.prototype.constructor = Phaser.Renderer.WebGL.BatchManager;

Phaser.Renderer.WebGL.BatchManager.prototype = {

    init: function ()
    {
        this.gl = this.renderer.gl;

        //  Our static index buffer, calculated once at the start of our game

        //  This contains the indices data for the quads.
        //  
        //  A quad is made up of 2 triangles (A and B in the image below)
        //  
        //  0 = Top Left
        //  1 = Top Right
        //  2 = Bottom Right
        //  3 = Bottom Left
        //
        //  0----1
        //  |\  A|
        //  | \  |
        //  |  \ |
        //  | B \|
        //  |    \
        //  3----2
        //
        //  Because triangles A and B share 2 points (0 and 2) the vertex buffer only stores
        //  4 sets of data (top-left, top-right, bottom-left and bottom-right), which is why
        //  the indices offsets uses the j += 4 iteration. Indices array has to contain 3
        //  entries for every triangle (so 6 for every quad), but our vertex data compacts
        //  that down, as we don't want to fill it with loads of DUPLICATE data, so the
        //  indices array is a look-up table, telling WebGL where in the vertex buffer to look
        //  for that triangles indice data.

        //  batchSize * vertSize = 2000 * 6 (because we store 6 pieces of vertex data per triangle)
        //  and up to a maximum of 2000 entries in the batch

        for (var i = 0, j = 0; i < (this.maxBatchSize * this.vertSize); i += 6, j += 4)
        {
            //  Triangle 1
            this.indices[i + 0] = j + 0;    //  Top Left
            this.indices[i + 1] = j + 1;    //  Top Right
            this.indices[i + 2] = j + 2;    //  Bottom Right

            //  Triangle 2
            this.indices[i + 3] = j + 0;    //  Top Left
            this.indices[i + 4] = j + 2;    //  Bottom Right
            this.indices[i + 5] = j + 3;    //  Bottom Left
        }

        if (this.renderer.enableMultiTextureToggle)
        {
            // this.initMultitexShader();
        }

        var gl = this.gl;

        //  Create indices buffer
        this.indexBuffer = gl.createBuffer();

        //  Bind it
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        //  Set the source of the buffer data (this.indices array)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        //  Create Vertex Data buffer
        this.vertexBuffer = gl.createBuffer();

        //  Bind it
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        //  Set the source of the buffer data (this.vertices array)
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

        //  initShader

        var program = this.renderer.compileProgram(this.vertexSrc, this.fragmentSrc);

        //  Set Shader
        gl.useProgram(program);

        //  Get and store the attributes
        this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
        this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');
        this.colorAttribute = gl.getAttribLocation(program, 'aColor');
        // this.aTextureIndex = gl.getAttribLocation(program, 'aTextureIndex');

        //  Get and store the uniforms for the shader
        //  this part is different for multi-textures
        this.uSampler = gl.getUniformLocation(program, 'uSampler');

        //  vertex position
        gl.enableVertexAttribArray(0);

        //  texture coordinate
        gl.enableVertexAttribArray(1);

        //  color attribute
        gl.enableVertexAttribArray(2);

        //  texture index
        // gl.enableVertexAttribArray(3);

        //  The projection vector (middle of the game world)
        this.projectionVector = gl.getUniformLocation(program, 'projectionVector');
        // this.offsetVector = gl.getUniformLocation(program, 'offsetVector');

        this.program = program;
    },

    initMultiTextureShader: function ()
    {
        this.gl = this.renderer.gl;

        // var gl = this.gl;

        //  New Fragment Source ...

        /*
        if (this.renderer.enableMultiTextureToggle)
        {
            var dynamicIfs = '\tif (vTextureIndex == 0.0) gl_FragColor = texture2D(uSamplerArray[0], vTextureCoord) * vColor;\n';

            for (var index = 1; index < this.MAX_TEXTURES; ++index)
            {
                dynamicIfs += '\telse if (vTextureIndex == ' +
                    index + '.0) gl_FragColor = texture2D(uSamplerArray[' +
                    index + '], vTextureCoord) * vColor;\n';
            }

            //  Does this need the vTextureIndex varying? Doesn't look like it

            this.defaultShader = new Phaser.Filter(
                this.renderer.game,
                undefined,
                [
                    'precision lowp float;',
                    'varying vec2 vTextureCoord;',
                    'varying vec4 vColor;',
                    'varying float vTextureIndex;',
                    'uniform sampler2D uSamplerArray[' + this.MAX_TEXTURES + '];',
                    'void main(void) {',
                    dynamicIfs,
                    '\telse gl_FragColor = texture2D(uSamplerArray[0], vTextureCoord) * vColor;',
                    '}'
                ]);
        }
        else
        {
            //  Does this need the vTextureIndex varying? Doesn't look like it

            this.defaultShader = new Phaser.Filter(
                this.renderer.game,
                undefined,
                [
                    'precision lowp float;',
                    'varying vec2 vTextureCoord;',
                    'varying vec4 vColor;',
                    'varying float vTextureIndex;',
                    'uniform sampler2D uSampler;',
                    'void main(void) {',
                    '   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor;',
                    '}'
                ]);
        }
        */
    },

    begin: function ()
    {
        this.start();
    },

    start: function ()
    {
        this.dirty = true;
    },

    end: function ()
    {
        this.flush();
    },

    stop: function ()
    {
        this.flush();
        this.dirty = true;
    },

    render: function (sprite)
    {
        var frame = sprite.frame;
        var source = frame.source;

        //  Check TextureSource
        if (this.currentTextureSource !== source)
        // if (this.renderer.textureArray[source.glTextureIndex] !== source)
        {
            if (this.currentBatchSize > 0)
            {
                this.flush();
            }

            var gl = this.gl;

            gl.activeTexture(gl.TEXTURE0 + source.glTextureIndex);
            gl.bindTexture(gl.TEXTURE_2D, source.glTexture);

            // this.renderer.textureArray[source.glTextureIndex] = source;
            this.currentTextureSource = source;
        }

        //  Check Batch Size
        if (this.currentBatchSize >= this.maxBatchSize)
        {
            this.flush();
            this.currentTextureSource = source;
        }

        // Get the Texture UVs
        var uvs = frame.uvs;

        var aX = sprite.anchorX;
        var aY = sprite.anchorY;

        var w0, w1, h0, h1;

        /*
        if (texture.trim)
        {
            //  If the sprite is trimmed, add the extra space before transforming
            var trim = texture.trim;

            w1 = trim.x - (aX * trim.width);
            w0 = w1 + texture.crop.width;

            h1 = trim.y - (aY * trim.height);
            h0 = h1 + texture.crop.height;
        }
        else
        {
            w0 = (texture.frame.width) * (1 - aX);
            w1 = (texture.frame.width) * -aX;

            h0 = texture.frame.height * (1 - aY);
            h1 = texture.frame.height * -aY;
        }
        */

        w0 = (frame.width) * (1 - aX);
        w1 = (frame.width) * -aX;

        h0 = frame.height * (1 - aY);
        h1 = frame.height * -aY;

        var resolution = source.resolution;
        var textureIndex = source.glTextureIndex;

        var wt = sprite.transform.world;

        var a = wt.a / resolution;
        var b = wt.b / resolution;
        var c = wt.c / resolution;
        var d = wt.d / resolution;
        var tx = wt.tx;
        var ty = wt.ty;

        // var cw = frame.cutWidth;
        // var ch = frame.cutHeight;

        /*
        if (texture.rotated)
        {
            var a0 = wt.a;
            var b0 = wt.b;
            var c0 = wt.c;
            var d0 = wt.d;
            var _w1 = w1;
            var _w0 = w0;

            // Offset before rotating
            tx = wt.c * ch + tx;
            ty = wt.d * ch + ty;
            
            // Rotate matrix by 90 degrees
            // We use precalculated values for sine and cosine of rad(90)
            a = a0 * 6.123233995736766e-17 + -c0;
            b = b0 * 6.123233995736766e-17 + -d0;
            c = a0 + c0 * 6.123233995736766e-17;
            d = b0 + d0 * 6.123233995736766e-17;

            // Update UV coordinates
            texture._updateUvsInverted();

            // Rotate dimensions
            w0 = h0;
            w1 = h1;
            h0 = _w0;
            h1 = _w1;
        }
        */

        //  These are just views into the same typed array
        var colors = this.colors;
        var positions = this.positions;

        if (this.renderer.roundPixels)
        {
            tx |= 0;
            ty |= 0;
        }

        var i = this.currentBatchSize * this.vertSize;

        //  Top Left vert (xy, uv, color)
        positions[i++] = a * w1 + c * h1 + tx;
        positions[i++] = d * h1 + b * w1 + ty;
        positions[i++] = uvs.x0;
        positions[i++] = uvs.y0;
        colors[i++] = sprite.color._glTint.topLeft + (sprite.color.worldAlpha * 255 << 24);
        // positions[i++] = textureIndex;

        //  Top Right vert (xy, uv, color)
        positions[i++] = a * w0 + c * h1 + tx;
        positions[i++] = d * h1 + b * w0 + ty;
        positions[i++] = uvs.x1;
        positions[i++] = uvs.y1;
        colors[i++] = sprite.color._glTint.topRight + (sprite.color.worldAlpha * 255 << 24);
        // positions[i++] = textureIndex;

        //  Bottom Right vert (xy, uv, color)
        positions[i++] = a * w0 + c * h0 + tx;
        positions[i++] = d * h0 + b * w0 + ty;
        positions[i++] = uvs.x2;
        positions[i++] = uvs.y2;
        colors[i++] = sprite.color._glTint.bottomRight + (sprite.color.worldAlpha * 255 << 24);
        // positions[i++] = textureIndex;

        //  Bottom Left vert (xy, uv, color)
        positions[i++] = a * w1 + c * h0 + tx;
        positions[i++] = d * h0 + b * w1 + ty;
        positions[i++] = uvs.x3;
        positions[i++] = uvs.y3;
        colors[i++] = sprite.color._glTint.bottomLeft + (sprite.color.worldAlpha * 255 << 24);
        // positions[i++] = textureIndex;

        this.sprites[this.currentBatchSize++] = sprite;
    },

    flush: function ()
    {
        // If the batch is length 0 then return as there is nothing to draw
        if (this.currentBatchSize === 0)
        {
            return;
        }

        var gl = this.gl;

        if (this.dirty)
        {
            //  Always dirty the first pass through but subsequent calls may be clean
            this.dirty = false;

            // bind the main texture
            gl.activeTexture(gl.TEXTURE0);

            // bind the buffers
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

            //  set the projection vector (defaults to middle of game world on negative y)
            gl.uniform2f(this.projectionVector, this.renderer.projection.x, this.renderer.projection.y);

            //  set the vertex position
            gl.vertexAttribPointer(this.aVertexPosition, 2, gl.FLOAT, false, this.vertSize, 0);

            //  set the texture coordinate
            gl.vertexAttribPointer(this.aTextureCoord, 2, gl.FLOAT, false, this.vertSize, 8);

            // color attributes will be interpreted as unsigned bytes and normalized
            gl.vertexAttribPointer(this.colorAttribute, 4, gl.UNSIGNED_BYTE, true, this.vertSize, 16);

            //  texture index
            // gl.vertexAttribPointer(this.aTextureIndex, 2, gl.FLOAT, false, this.vertSize, 20);
        }

        //  Upload verts to the buffer
        if (this.currentBatchSize > this.halfBatchSize)
        {
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);
        }
        else
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

            var view = this.positions.subarray(0, this.currentBatchSize * this.vertSize);

            gl.bufferSubData(gl.ARRAY_BUFFER, 0, view);
        }

        var sprite;

        var start = 0;
        var currentSize = 0;

        var nextSource = null;

        var blend = 0;
        var nextBlend = null;

        for (var i = 0; i < this.currentBatchSize; i++)
        {
            sprite = this.sprites[i];

            nextBlend = sprite.blendMode;

            if (blend !== nextBlend)
            {
                //  Unrolled for speed
                /*
                if (nextBlend === this.renderer.blendModes.NORMAL)
                {
                    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                }
                else if (nextBlend === BlendModes.ADD)
                {
                    gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);
                }
                else if (nextBlend === BlendModes.MULTIPLY)
                {
                    gl.blendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
                }
                else if (nextBlend === BlendModes.SCREEN)
                {
                    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
                }
                */
            }

            nextSource = sprite.frame.source;

            if (nextSource !== this.currentTextureSource)
            {
                if (currentSize > 0)
                {
                    this.renderBatch(this.currentTextureSource, currentSize, start);
                }

                start = i;
                currentSize = 0;
                this.currentTextureSource = nextSource;
            }

            currentSize++;
        }

        if (currentSize > 0)
        {
            this.renderBatch(this.currentTextureSource, currentSize, start);
        }

        //  Reset the batch
        this.currentBatchSize = 0;
    },

    renderBatch: function (source, size, startIndex)
    {
        if (size === 0)
        {
            return;
        }

        var gl = this.gl;

        if (source.glDirty)
        {
            if (!this.renderer.updateTexture(source))
            {
                //  If updateTexture returns false then we cannot render it, so bail out now
                return;
            }
        }

        gl.drawElements(gl.TRIANGLES, size * 6, gl.UNSIGNED_SHORT, startIndex * 6 * 2);

        this.renderer.drawCount++;
    },

    destroy: function ()
    {
        this.vertices = null;
        this.indices = null;

        this.gl.deleteBuffer(this.vertexBuffer);
        this.gl.deleteBuffer(this.indexBuffer);

        this.currentBaseTexture = null;

        this.renderer = null;
        this.gl = null;
    }

};
