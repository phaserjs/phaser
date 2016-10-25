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
Phaser.Renderer.WebGL.BatchManager = function (renderer, batchSize)
{
    this.renderer = renderer;

    this.gl = null;

    //  Total number of objects we'll batch before flushing and rendering
    this.maxBatchSize = batchSize;

    this.halfBatchSize = this.maxBatchSize / 2;

    //  Vertex Data Size is calculated by adding together:
    //
    //  Position (vec2) = 4 * 2 = 8 bytes
    //  UV (vec2) = 4 * 2 = 8 bytes
    //  Texture Index (float) = 4 bytes
    //  Tint Color (float) = 4 bytes
    //  BG Color (float) = 4 bytes

    this.vertSize = (4 * 2) + (4 * 2) + (4) + (4) + (4);

    var numVerts = this.vertSize * this.maxBatchSize * 4;

    this.vertices = new ArrayBuffer(numVerts);

    //  Number of total quads allowed in the batch * 6
    //  6 because there are 2 triangles per quad, and each triangle has 3 indices
    this.indices = new Uint16Array(this.maxBatchSize * 6);

    //  View on the vertices as a Float32Array
    this.positions = new Float32Array(this.vertices);

    //  View on the vertices as a Uint32Array
    this.colors = new Uint32Array(this.vertices);

    this.currentBatchSize = 0;

    this.dirty = true;

    this.list = [];

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
    */
    this.vertexSrc = [
        'attribute vec2 aVertexPosition;',
        'attribute vec2 aTextureCoord;',
        'attribute float aTextureIndex;',
        'attribute vec4 aTintColor;',
        'attribute vec4 aBgColor;',

        'uniform vec2 projectionVector;',
        'uniform vec2 offsetVector;',

        'varying vec2 vTextureCoord;',
        'varying vec4 vTintColor;',
        'varying vec4 vBgColor;',
        'varying float vTextureIndex;',

        'const vec2 center = vec2(-1.0, 1.0);',

        'void main(void) {',
        '   if (aTextureIndex > 0.0) gl_Position = vec4(0.0);',
        '   gl_Position = vec4(((aVertexPosition + offsetVector) / projectionVector) + center, 0.0, 1.0);',
        '   vTextureCoord = aTextureCoord;', // pass the texture coordinate to the fragment shader, the GPU will interpolate the points
        '   vTintColor = vec4(aTintColor.rgb * aTintColor.a, aTintColor.a);',
        '   vBgColor = aBgColor;',
        '   vTextureIndex = aTextureIndex;',
        '}'
    ];

    /**
     * The fragment shader.
     * @property fragmentSrc
     * @type Array
    */
    this.fragmentSrc = [
        'precision lowp float;',

        'varying vec2 vTextureCoord;', // the texture coords passed in from the vertex shader
        'varying vec4 vTintColor;', //  the color value passed in from the vertex shader (texture color + alpha + tint)
        'varying vec4 vBgColor;', //  the bg color value passed in from the vertex shader
        'varying float vTextureIndex;',

        'uniform sampler2D uSampler;', // our texture

        'void main(void) {',
        '   vec4 pixel = texture2D(uSampler, vTextureCoord);', // get the color from the texture
        // '   vec4 pixel = texture2D(uSampler, vTextureCoord) * vTintColor;', // get the color from the texture
        // '   if (pixel.a == 0.0) pixel = vBgColor;', // if texture alpha is zero, use the bg color
        '   gl_FragColor = pixel;',
        '}'
    ];

    this.multiTextureFragmentSrc = null;

    //  @type {GLint}
    this.aVertexPosition;

    //  @type {GLint}
    this.aTextureCoord;

    //  @type {GLint}
    this.aTextureIndex;

    //  @type {GLint}
    this.aTintColor;

    //  @type {GLint}
    this.aBgColor;

    //  @type {WebGLUniformLocation }
    this.uSampler;

    //  @type {WebGLUniformLocation }
    this.projectionVector;

    //  @type {WebGLUniformLocation }
    this.offsetVector;

    this._i = 0;
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

        var fragmentSrc = this.fragmentSrc;

        if (this.renderer.multiTexture)
        {
            var multiFrag = [
                'precision lowp float;',

                'varying vec2 vTextureCoord;', // the texture coords passed in from the vertex shader
                'varying vec4 vTintColor;', //  the color value passed in from the vertex shader (texture color + alpha + tint)
                'varying vec4 vBgColor;', //  the bg color value passed in from the vertex shader
                'varying float vTextureIndex;',

                'uniform sampler2D uSamplerArray[' + this.renderer.maxTextures + '];',

                'const vec4 PINK = vec4(1.0, 0.0, 1.0, 1.0);',

                'void main(void) {',

                '   vec4 pixel;',
                '   if (vTextureIndex == 0.0) pixel = texture2D(uSamplerArray[0], vTextureCoord);'
            ];

            for (i = 1; i < this.renderer.maxTextures; i++)
            {
                multiFrag.push('   else if (vTextureIndex == ' + i + '.0) pixel = texture2D(uSamplerArray[' + i + '], vTextureCoord);');
            }

            multiFrag = multiFrag.concat([
                '   else pixel = PINK;',

                '   pixel *= vTintColor;',
                '   if (pixel.a == 0.0) pixel = vBgColor;', // if texture alpha is zero, use the bg color
                '   gl_FragColor = pixel;',
                '}'
            ]);

            this.multiTextureFragmentSrc = multiFrag;

            fragmentSrc = this.multiTextureFragmentSrc;
        }

        //  Compile the Shader
        var program = this.renderer.compileProgram(this.vertexSrc, fragmentSrc);

        //  Set Shader
        gl.useProgram(program);

        //  Get and store the attributes

        //  vertex position
        this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
        gl.enableVertexAttribArray(this.aVertexPosition);

        this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');
        gl.enableVertexAttribArray(this.aTextureCoord);

        this.aTextureIndex = gl.getAttribLocation(program, 'aTextureIndex');
        gl.enableVertexAttribArray(this.aTextureIndex);

        this.aTintColor = gl.getAttribLocation(program, 'aTintColor');
        gl.enableVertexAttribArray(this.aTintColor);

        this.aBgColor = gl.getAttribLocation(program, 'aBgColor');
        gl.enableVertexAttribArray(this.aBgColor);

        //  Get and store the uniforms for the shader
        if (this.renderer.multiTexture)
        {
            //  Bind empty multi-textures to avoid WebGL spam
            var indices = [];

            var tempTexture = this.renderer.createEmptyTexture(1, 1, 0);

            for (i = 0; i < this.renderer.maxTextures; i++)
            {
                gl.activeTexture(gl.TEXTURE0 + i);

                gl.bindTexture(gl.TEXTURE_2D, tempTexture);

                indices.push(i);
            }

            this.uSampler = gl.getUniformLocation(program, 'uSamplerArray[0]');

            gl.uniform1iv(this.uSampler, indices);
        }
        else
        {
            this.uSampler = gl.getUniformLocation(program, 'uSampler');
        }

        //  The projection vector (middle of the game world)
        this.projectionVector = gl.getUniformLocation(program, 'projectionVector');

        //  The offset vector (camera shake)
        this.offsetVector = gl.getUniformLocation(program, 'offsetVector');

        this.program = program;
    },

    begin: function ()
    {
        this._i = 0;
        this.dirty = true;
        this.currentBatchSize = 0;
    },

    end: function ()
    {
        if (this.currentBatchSize > 0)
        {
            this.flush();
        }
    },

    start: function ()
    {
        this._i = 0;
        this.dirty = true;
    },

    stop: function ()
    {
        if (this.currentBatchSize > 0)
        {
            this.flush();
        }

        this.dirty = true;
    },

    setCurrentTexture: function (textureSource)
    {
        if (this.renderer.textureArray[textureSource.glTextureIndex] !== textureSource)
        {
            if (this.currentBatchSize > 0)
            {
                this.flush();
            }

            var gl = this.gl;

            gl.activeTexture(gl.TEXTURE0 + textureSource.glTextureIndex);

            gl.bindTexture(gl.TEXTURE_2D, textureSource.glTexture);

            this.renderer.textureArray[textureSource.glTextureIndex] = textureSource;
        }
    },

    addToBatch: function (gameObject, verts, uvs, textureIndex, alpha, tintColors, bgColors)
    {
        // console.log('addToBatch', gameObject.frame.name);

        //  Check Batch Size and flush if needed
        if (this.currentBatchSize >= this.maxBatchSize)
        {
            this.flush();
        }

        var source = gameObject.frame.source;

        source.glLastUsed = this.renderer.startTime;

        //  Does this Game Objects texture need updating?
        if (source.glDirty)
        {
            //  Check Batch Size and flush if needed
            if (this.currentBatchSize > 0)
            {
                this.flush();
            }

            this.renderer.updateTexture(source);
        }

        //  Set the current texture (not if this sprite has its own shader?)
        if (this.renderer.textureArray[source.glTextureIndex] !== source)
        {
            var gl = this.gl;

            if (this.currentBatchSize > 0)
            {
                this.flush();
            }

            gl.activeTexture(gl.TEXTURE0 + source.glTextureIndex);

            gl.bindTexture(gl.TEXTURE_2D, source.glTexture);

            this.renderer.textureArray[source.glTextureIndex] = source;
        }

        //  These are TypedArray Views into the vertices ArrayBuffer
        var colors = this.colors;
        var positions = this.positions;

        var i = this._i;

        //  Top Left vert (xy, uv, color)
        positions[i++] = verts.x0;
        positions[i++] = verts.y0;
        positions[i++] = uvs.x0;
        positions[i++] = uvs.y0;
        positions[i++] = textureIndex;
        colors[i++] = tintColors.topLeft + alpha;
        colors[i++] = bgColors.topLeft;

        //  Top Right vert (xy, uv, color)
        positions[i++] = verts.x1;
        positions[i++] = verts.y1;
        positions[i++] = uvs.x1;
        positions[i++] = uvs.y1;
        positions[i++] = textureIndex;
        colors[i++] = tintColors.topRight + alpha;
        colors[i++] = bgColors.topRight;

        //  Bottom Right vert (xy, uv, color)
        positions[i++] = verts.x2;
        positions[i++] = verts.y2;
        positions[i++] = uvs.x2;
        positions[i++] = uvs.y2;
        positions[i++] = textureIndex;
        colors[i++] = tintColors.bottomRight + alpha;
        colors[i++] = bgColors.bottomRight;

        //  Bottom Left vert (xy, uv, color)
        positions[i++] = verts.x3;
        positions[i++] = verts.y3;
        positions[i++] = uvs.x3;
        positions[i++] = uvs.y3;
        positions[i++] = textureIndex;
        colors[i++] = tintColors.bottomLeft + alpha;
        colors[i++] = bgColors.bottomLeft;

        this._i = i;

        this.list[this.currentBatchSize++] = gameObject;
    },

    initShader: function ()
    {
        var gl = this.gl;

        //  Bind the buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        //  Set the projection vector. Defaults to the middle of the Game World, on negative y.
        //  I.e. if the world is 800x600 then the projection vector is 400 x -300
        gl.uniform2f(this.projectionVector, this.renderer.projection.x, this.renderer.projection.y);

        //  Set the offset vector.
        gl.uniform2f(this.offsetVector, this.renderer.offset.x, this.renderer.offset.y);

        //  The Vertex Position (x/y)
        //  2 FLOATS, 2 * 4 = 8 bytes. Index pos: 0 to 7
        //  final argument = the offset within the vertex input
        gl.vertexAttribPointer(this.aVertexPosition, 2, gl.FLOAT, false, this.vertSize, 0);

        //  The Texture Coordinate (uvx/uvy)
        //  2 FLOATS, 2 * 4 = 8 bytes. Index pos: 8 to 15
        gl.vertexAttribPointer(this.aTextureCoord, 2, gl.FLOAT, false, this.vertSize, 8);

        //  Texture Index
        //  1 FLOAT, 4 bytes. Index pos: 16 to 19
        gl.vertexAttribPointer(this.aTextureIndex, 1, gl.FLOAT, false, this.vertSize, 16);

        //  Tint color
        //  4 UNSIGNED BYTES, 4 bytes. Index pos: 20 to 23
        //  Attributes will be interpreted as unsigned bytes and normalized
        gl.vertexAttribPointer(this.aTintColor, 4, gl.UNSIGNED_BYTE, true, this.vertSize, 20);

        //  Background Color
        //  4 UNSIGNED BYTES, 4 bytes. Index pos: 24 to 27
        //  Attributes will be interpreted as unsigned bytes and normalized
        gl.vertexAttribPointer(this.aBgColor, 4, gl.UNSIGNED_BYTE, true, this.vertSize, 24);

        this.dirty = false;
    },

    flush: function ()
    {
        //  Always dirty the first pass through but subsequent calls may be clean
        if (this.dirty)
        {
            this.initShader();
        }

        var gl = this.gl;

        //  Upload the vertex data to the GPU - is this cheaper (overall) than creating a new TypedArray view?
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);

        /*
        if (this.currentBatchSize > this.halfBatchSize)
        {
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);
        }
        else
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

            //  This creates a brand new Typed Array - what's the cost of this vs. just uploading all vert data?
            var view = this.positions.subarray(0, this.currentBatchSize * this.vertSize);

            gl.bufferSubData(gl.ARRAY_BUFFER, 0, view);
        }
        */

        var sprite;

        var start = 0;
        var currentSize = 0;

        for (var i = 0; i < this.currentBatchSize; i++)
        {
            sprite = this.list[i];

            if (sprite.blendMode !== this.renderer.currentBlendMode)
            {
                if (currentSize > 0)
                {
                    gl.drawElements(gl.TRIANGLES, currentSize * 6, gl.UNSIGNED_SHORT, start * 6 * 2);
                    this.renderer.drawCount++;
                }

                this.renderer.setBlendMode(sprite.blendMode);
            }

            //  TODO: Check for shader here

            //  If either blend or shader set, we need to drawElements and swap

            currentSize++;
        }

        if (currentSize > 0)
        {
            gl.drawElements(gl.TRIANGLES, currentSize * 6, gl.UNSIGNED_SHORT, start * 6 * 2);
            this.renderer.drawCount++;
        }

        //  Reset the batch
        this.currentBatchSize = 0;
        this._i = 0;
    },

    destroy: function ()
    {
        this.vertices = null;
        this.indices = null;

        this.gl.deleteBuffer(this.vertexBuffer);
        this.gl.deleteBuffer(this.indexBuffer);

        this.renderer = null;
        this.gl = null;
    }

};
