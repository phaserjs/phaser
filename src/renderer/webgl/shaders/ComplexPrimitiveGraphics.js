/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Mat Groves (@Doormat23)
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* New version of PIXI.ComplexPrimitiveShader
*
* @class Phaser.Renderer.Canvas
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
*/
Phaser.Renderer.WebGL.Shaders.ComplexPrimitiveGraphics = function (renderer)
{
    this.renderer = renderer;

    //  WebGLContext
    this.gl = renderer.gl;

    /**
     * @property _UID
     * @type Number
     * @private
     */
    this._UID = renderer.getShaderID(this);

    /**
     * The WebGL program.
     * @property program
     * @type Any
     */
    this.program = null;

    /**
    * The vertex shader.
    * @property vertexSrc
    * @type Array
    */
    this.fragmentSrc = [];

    this.vertexSrc = [];

    this.attributes = [];

    //  @type {WebGLUniformLocation }
    this.projectionVector;

    //  @type {WebGLUniformLocation }
    this.offsetVector;

    //  @type {WebGLUniformLocation }
    this.tintColor;

    //  @type {WebGLUniformLocation }
    this.color;

    //  @type {WebGLUniformLocation }
    this.flipY;

    //  @type {GLint}
    this.aVertexPosition;

    //  @type {GLint}
    this.colorAttribute;

    //  @type {WebGLUniformLocation }
    this.translationMatrix;

    //  @type {WebGLUniformLocation }
    this.alpha;

    this.init();
};

Phaser.Renderer.WebGL.Shaders.ComplexPrimitiveGraphics.prototype.constructor = Phaser.Renderer.WebGL.Shaders.ComplexPrimitiveGraphics;

Phaser.Renderer.WebGL.Shaders.ComplexPrimitiveGraphics.prototype = {

    init: function ()
    {
        this.fragmentSrc = [
            'precision mediump float;',
            'varying vec4 vColor;',

            'void main(void) {',
            '   gl_FragColor = vColor;',
            '}'
        ];

        this.vertexSrc  = [
            'attribute vec2 aVertexPosition;',
            'uniform mat3 translationMatrix;',
            'uniform vec2 projectionVector;',
            'uniform vec2 offsetVector;',
            
            'uniform vec3 tint;',
            'uniform float alpha;',
            'uniform vec3 color;',
            'uniform float flipY;',
            'varying vec4 vColor;',

            'void main(void) {',
            '   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);',
            '   v -= offsetVector.xyx;',
            '   gl_Position = vec4( v.x / projectionVector.x -1.0, (v.y / projectionVector.y * -flipY) + flipY , 0.0, 1.0);',
            '   vColor = vec4(color * alpha * tint, alpha);',
            '}'
        ];

        var program = this.renderer.compileProgram(this.vertexSrc, this.fragmentSrc);

        var gl = this.gl;

        gl.useProgram(program);

        // get and store the uniforms for the shader
        this.projectionVector = gl.getUniformLocation(program, 'projectionVector');
        this.offsetVector = gl.getUniformLocation(program, 'offsetVector');
        this.tintColor = gl.getUniformLocation(program, 'tint');
        this.flipY = gl.getUniformLocation(program, 'flipY');
        this.color = gl.getUniformLocation(program, 'color');

        // get and store the attributes
        this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
        this.colorAttribute = gl.getAttribLocation(program, 'aColor');

        // this.attributes = [ this.aVertexPosition, this.colorAttribute ];
        this.attributes = [ this.aVertexPosition ];

        this.translationMatrix = gl.getUniformLocation(program, 'translationMatrix');
        this.alpha = gl.getUniformLocation(program, 'alpha');

        this.program = program;
    },

    destroy: function ()
    {
        this.gl.deleteProgram(this.program);
        this.gl = null;
        this.renderer = null;
        this.attributes = null;
    }

};
