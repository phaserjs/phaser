/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Standard Image and Sprite Shader.
*
* @class Phaser.Renderer.WebGL.Shader.Image
* @constructor
* @param {Phaser.Renderer.WebGL} renderer - The WebGL Renderer.
*/
Phaser.Renderer.WebGL.Shader.Image = function (renderer)
{
    this.renderer = renderer;

    this.gl = null;

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
        '   vec4 pixel = texture2D(uSampler, vTextureCoord) * vTintColor;', // get the color from the texture
        // '   if (pixel.a == 0.0) pixel = vBgColor;', // if texture alpha is zero, use the bg color
        '   gl_FragColor = pixel;',
        '}'
    ];

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

Phaser.Renderer.WebGL.Shader.Image.prototype.constructor = Phaser.Renderer.WebGL.Shader.Image;

Phaser.Renderer.WebGL.Shader.Image.prototype = {

    init: function ()
    {
        this.gl = this.renderer.gl;

        //  Compile the Shader
        this.program = this.renderer.compileProgram(this.vertexSrc, this.fragmentSrc);

        this.initAttributes();

    },

    initAttributes: function ()
    {
        var gl = this.gl;

        var program = this.program;

        //  Set Shader
        gl.useProgram(program);

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
    },

    initShader: function ()
    {
        var gl = this.gl;

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
    },

    destroy: function ()
    {
        // this.vertices = null;
        // this.indices = null;

        // this.gl.deleteBuffer(this.vertexBuffer);
        // this.gl.deleteBuffer(this.indexBuffer);

        this.renderer.deleteProgram(this.program);

        this.renderer = null;

        this.gl = null;
    }

};
