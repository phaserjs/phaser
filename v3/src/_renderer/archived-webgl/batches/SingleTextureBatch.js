/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var BaseBatch = require('./BaseBatch');

/**
* Standard Image and Sprite Shader.
*
* @class Phaser.Renderer.WebGL.Batch.SingleTexture
* @constructor
* @param {Phaser.Renderer.WebGL} renderer - The WebGL Renderer.
*/
var SingleTextureBatch = function (manager, batchSize)
{
    //  Vertex Data Size is calculated by adding together:
    //
    //  Position (vec2) = 4 * 2 = 8 bytes
    //  UV (vec2) = 4 * 2 = 8 bytes
    //  Texture Index (float) = 4 bytes
    //  Tint Color (float) = 4 bytes
    //  BG Color (float) = 4 bytes
    //
    //  Total: 28 bytes (per vert) * 4 (4 verts per quad) (= 112 bytes) * maxSize (usually 2000) = 224 kilobytes sent to the GPU every frame

    var vertSize = (4 * 2) + (4 * 2) + (4) + (4) + (4);

    BaseBatch.call(this, manager, batchSize, vertSize);

    this.type = 1;

    //  View on the vertices as a Float32Array
    this.positions = new Float32Array(this.vertices);

    //  View on the vertices as a Uint32Array
    this.colors = new Uint32Array(this.vertices);

    //  Attributes and Uniforms specific to this Batch Shader

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

    //  @type {WebGLUniformLocation}
    this.uSampler;

    //  @type {WebGLUniformLocation}
    this.projectionVector;

    //  @type {WebGLUniformLocation}
    this.offsetVector;
};

SingleTextureBatch.prototype = Object.create(BaseBatch.prototype);

SingleTextureBatch.prototype.constructor = SingleTextureBatch;

SingleTextureBatch.prototype.init = function ()
{
    this.gl = this.renderer.gl;

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
        '   vTintColor = vec4(aTintColor.rgb * aTintColor.a, aTintColor.a);', // pre-multiply the alpha (all textures are pre-multiplied)
        '   vBgColor = aBgColor;',
        '   vTextureIndex = aTextureIndex;',
        '}'
    ];

    this.fragmentSrc = [
        'precision lowp float;',

        'varying vec2 vTextureCoord;', // the texture coords passed in from the vertex shader
        'varying vec4 vTintColor;', //  the color value passed in from the vertex shader (texture color + alpha + tint)
        'varying vec4 vBgColor;', //  the bg color value passed in from the vertex shader
        'varying float vTextureIndex;',

        'uniform sampler2D uSampler;', // our texture

        'void main(void) {',
        '   vec4 pixel = texture2D(uSampler, vTextureCoord) * vTintColor;', // get the color from the texture
        // '   if (pixel.a == 0.0) pixel = vBgColor;', // if texture alpha is zero, use the bg color
        '   gl_FragColor = pixel;',
        '}'
    ];

    //  Compile the Shader
    this.program = this.renderer.compileProgram(this.vertexSrc, this.fragmentSrc);

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

    for (var i = 0, j = 0; i < (this.maxSize * this.vertSize); i += 6, j += 4)
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

};

SingleTextureBatch.prototype.bindShader = function ()
{
    var gl = this.gl;
    var program = this.program;
    var vertSize = this.vertSize;

    //  Set Shader
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    //  Get and store the attributes

    //  vertex position
    this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    gl.enableVertexAttribArray(this.aVertexPosition);

    //  texture coordinate
    this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');
    gl.enableVertexAttribArray(this.aTextureCoord);

    //  texture index
    this.aTextureIndex = gl.getAttribLocation(program, 'aTextureIndex');
    gl.enableVertexAttribArray(this.aTextureIndex);

    //  tint / pixel color
    this.aTintColor = gl.getAttribLocation(program, 'aTintColor');
    gl.enableVertexAttribArray(this.aTintColor);

    //  background pixel color
    this.aBgColor = gl.getAttribLocation(program, 'aBgColor');
    gl.enableVertexAttribArray(this.aBgColor);

    //  The projection vector (middle of the game world)
    this.projectionVector = gl.getUniformLocation(program, 'projectionVector');

    //  The offset vector (camera shake)
    this.offsetVector = gl.getUniformLocation(program, 'offsetVector');

    //  The Texture Sampler
    this.uSampler = gl.getUniformLocation(this.program, 'uSampler');

    //  Set the projection vector. Defaults to the middle of the Game World, on negative y.
    //  I.e. if the world is 800x600 then the projection vector is 400 x -300
    gl.uniform2f(this.projectionVector, this.renderer.projection.x, this.renderer.projection.y);

    //  Set the offset vector.
    gl.uniform2f(this.offsetVector, this.renderer.offset.x, this.renderer.offset.y);

    //  The Vertex Position (x/y)
    //  2 FLOATS, 2 * 4 = 8 bytes. Index pos: 0 to 7
    //  final argument = the offset within the vertex input
    gl.vertexAttribPointer(this.aVertexPosition, 2, gl.FLOAT, false, vertSize, 0);

    //  The Texture Coordinate (uvx/uvy)
    //  2 FLOATS, 2 * 4 = 8 bytes. Index pos: 8 to 15
    gl.vertexAttribPointer(this.aTextureCoord, 2, gl.FLOAT, false, vertSize, 8);

    //  Texture Index
    //  1 FLOAT, 4 bytes. Index pos: 16 to 19
    gl.vertexAttribPointer(this.aTextureIndex, 1, gl.FLOAT, false, vertSize, 16);

    //  Tint color
    //  4 UNSIGNED BYTES, 4 bytes. Index pos: 20 to 23
    //  Attributes will be interpreted as unsigned bytes and normalized
    gl.vertexAttribPointer(this.aTintColor, 4, gl.UNSIGNED_BYTE, true, vertSize, 20);

    //  Background Color
    //  4 UNSIGNED BYTES, 4 bytes. Index pos: 24 to 27
    //  Attributes will be interpreted as unsigned bytes and normalized
    gl.vertexAttribPointer(this.aBgColor, 4, gl.UNSIGNED_BYTE, true, vertSize, 24);
};

SingleTextureBatch.prototype.add = function (verts, uvs, textureIndex, alpha, tintColors, bgColors)
{
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

    this.size++;
};

SingleTextureBatch.prototype.destroy = function ()
{
    this.vertices = null;
    this.indices = null;
    this.view = null;

    var gl = this.gl;

    gl.disableVertexAttribArray(this.aVertexPosition);
    gl.disableVertexAttribArray(this.aTextureCoord);
    gl.disableVertexAttribArray(this.aTextureIndex);
    gl.disableVertexAttribArray(this.aTintColor);
    gl.disableVertexAttribArray(this.aBgColor);

    gl.deleteBuffer(this.vertexBuffer);
    gl.deleteBuffer(this.indexBuffer);

    this.renderer.deleteProgram(this.program);

    this.renderer = null;

    this.gl = null;

    this.manager = null;
};

module.exports = SingleTextureBatch;
