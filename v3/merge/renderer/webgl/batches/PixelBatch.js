/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Pixel Batch Shader.
*
* @class Phaser.Renderer.WebGL.Batch.Pixel
* @constructor
* @param {Phaser.Renderer.WebGL} renderer - The WebGL Renderer.
*/
Phaser.Renderer.WebGL.Batch.Pixel = function (manager, batchSize)
{
    //  Vertex Data Size is calculated by adding together:
    //
    //  Position (vec2) = 4 * 2 = 8 bytes
    //  Color (float) = 4 bytes
    //
    //  Total: 12 bytes (per vert) * 4 (4 verts per quad) (= 48 bytes) = 96 kilobytes per 2000 pixels sent to the GPU every frame

    var vertSize = (4 * 2) + (4);

    Phaser.Renderer.WebGL.Batch.call(this, manager, batchSize * 10, vertSize);

    this.type = 3;

    //  View on the vertices as a Float32Array
    this.positions = new Float32Array(this.vertices);

    //  View on the vertices as a Uint32Array
    this.colors = new Uint32Array(this.vertices);

    //  Attributes and Uniforms specific to this Batch Shader

    //  @type {GLint}
    this.aVertexPosition;

    //  @type {GLint}
    this.aColor;

    //  @type {WebGLUniformLocation}
    this.projectionVector;

    //  @type {WebGLUniformLocation}
    this.offsetVector;
};

Phaser.Renderer.WebGL.Batch.Pixel.prototype = Object.create(Phaser.Renderer.WebGL.Batch.prototype);

Phaser.Renderer.WebGL.Batch.Pixel.prototype.constructor = Phaser.Renderer.WebGL.Batch.Pixel;

Phaser.Renderer.WebGL.Batch.Pixel.prototype.init = function ()
{
    this.gl = this.renderer.gl;

    this.vertexSrc = [
        'attribute vec2 aVertexPosition;',
        'attribute vec4 aColor;',

        'uniform vec2 projectionVector;',
        'uniform vec2 offsetVector;',

        'varying vec4 vColor;',

        'const vec2 center = vec2(-1.0, 1.0);',

        'void main(void) {',
        '   gl_Position = vec4(((aVertexPosition + offsetVector) / projectionVector) + center, 0.0, 1.0);',
        '   vColor = aColor;',
        '}'
    ];

    this.fragmentSrc = [
        'precision lowp float;',

        'varying vec4 vColor;', //  the color value passed in from the vertex shader

        'void main(void) {',
        '   gl_FragColor = vColor;',
        '}'
    ];

    //  Compile the Shader
    this.program = this.renderer.compileProgram(this.vertexSrc, this.fragmentSrc);

    //  Our static index buffer, calculated once at the start of our game

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

Phaser.Renderer.WebGL.Batch.Pixel.prototype.bindShader = function ()
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

    //  pixel color
    this.aColor = gl.getAttribLocation(program, 'aColor');
    gl.enableVertexAttribArray(this.aColor);

    //  The projection vector (middle of the game world)
    this.projectionVector = gl.getUniformLocation(program, 'projectionVector');

    //  The offset vector (camera shake)
    this.offsetVector = gl.getUniformLocation(program, 'offsetVector');

    //  Set the projection vector. Defaults to the middle of the Game World, on negative y.
    //  I.e. if the world is 800x600 then the projection vector is 400 x -300
    gl.uniform2f(this.projectionVector, this.renderer.projection.x, this.renderer.projection.y);

    //  Set the offset vector.
    gl.uniform2f(this.offsetVector, this.renderer.offset.x, this.renderer.offset.y);

    //  The Vertex Position (x/y)
    //  2 FLOATS, 2 * 4 = 8 bytes. Index pos: 0 to 7
    //  final argument = the offset within the vertex input
    gl.vertexAttribPointer(this.aVertexPosition, 2, gl.FLOAT, false, vertSize, 0);

    //  Color
    //  4 UNSIGNED BYTES, 4 bytes. Index pos: 8 to 11
    //  Attributes will be interpreted as unsigned bytes and normalized
    gl.vertexAttribPointer(this.aColor, 4, gl.UNSIGNED_BYTE, true, vertSize, 8);
};

Phaser.Renderer.WebGL.Batch.Pixel.prototype.add = function (x0, y0, x1, y1, x2, y2, x3, y3, color)
{
    //  These are TypedArray Views into the vertices ArrayBuffer
    var colors = this.colors;
    var positions = this.positions;

    var i = this._i;

    //  Top Left vert (xy, color)
    positions[i++] = x0;
    positions[i++] = y0;
    colors[i++] = color;

    //  Top Right vert (xy, color)
    positions[i++] = x1;
    positions[i++] = y1;
    colors[i++] = color;

    //  Bottom Right vert (xy, color)
    positions[i++] = x2;
    positions[i++] = y2;
    colors[i++] = color;

    //  Bottom Left vert (xy, color)
    positions[i++] = x3;
    positions[i++] = y3;
    colors[i++] = color;

    this._i = i;

    this.size++;
};

Phaser.Renderer.WebGL.Batch.Pixel.prototype.destroy = function ()
{
    this.vertices = null;
    this.indices = null;
    this.view = null;

    this.gl.deleteBuffer(this.vertexBuffer);
    this.gl.deleteBuffer(this.indexBuffer);

    this.renderer.deleteProgram(this.program);

    this.renderer = null;

    this.gl = null;

    this.manager = null;
};
