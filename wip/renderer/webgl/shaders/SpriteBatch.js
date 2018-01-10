/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Mat Groves (@Doormat23)
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* New version of PIXI.PixiFastShader
*
* @class Phaser.Renderer.Canvas
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
*/
Phaser.Renderer.WebGL.Shaders.SpriteBatch = function (renderer)
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
    this.uSampler;

    //  @type {WebGLUniformLocation }
    this.projectionVector;

    //  @type {WebGLUniformLocation }
    this.offsetVector;

    //  @type {WebGLUniformLocation }
    this.dimensions;

    //  @type {WebGLUniformLocation }
    this.uMatrix;

    //  @type {GLint}
    this.aVertexPosition;

    //  @type {GLint}
    this.aPositionCoord;

    //  @type {GLint}
    this.aScale;

    //  @type {GLint}
    this.aRotation;

    //  @type {GLint}
    this.aTextureCoord;

    //  @type {GLint}
    this.colorAttribute;

    //  @type {GLint}
    this.aTextureIndex;

    this.init();
};

Phaser.Renderer.WebGL.Shaders.SpriteBatch.prototype.constructor = Phaser.Renderer.WebGL.Shaders.SpriteBatch;

Phaser.Renderer.WebGL.Shaders.SpriteBatch.prototype = {

    init: function ()
    {
        if (this.renderer.enableMultiTextureToggle)
        {
            var dynamicIfs = '\tif (vTextureIndex == 0.0) gl_FragColor = texture2D(uSamplerArray[0], vTextureCoord) * vColor;\n';

            for (var index = 1; index < this.renderer.getMaxTextureUnits(); ++index)
            {
                dynamicIfs += '\telse if (vTextureIndex == ' +
                    index + '.0) gl_FragColor = texture2D(uSamplerArray[' +
                    index + '], vTextureCoord) * vColor;\n';
            }

            this.fragmentSrc = [
                'precision lowp float;',
                'varying vec2 vTextureCoord;',
                'varying float vColor;',
                'varying float vTextureIndex;',
                'uniform sampler2D uSamplerArray[' + this.renderer.getMaxTextureUnits() + '];',
                'const vec4 PINK = vec4(1.0, 0.0, 1.0, 1.0);',
                'const vec4 GREEN = vec4(0.0, 1.0, 0.0, 1.0);',
                'void main(void) {',
                dynamicIfs,
                'else gl_FragColor = PINK;',
                '}'
            ];
        }
        else
        {
            this.fragmentSrc = [
                'precision lowp float;',
                'varying vec2 vTextureCoord;',
                'varying float vColor;',
                'varying float vTextureIndex;',
                'uniform sampler2D uSampler;',
                'void main(void) {',
                '   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor;',
                '}'
            ];
        }

        this.vertexSrc = [
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
            '   gl_Position = vec4( ((aVertexPosition + offsetVector) / projectionVector) + center, 0.0, 1.0);',
            '   vTextureCoord = aTextureCoord;',
            '   vTextureIndex = aTextureIndex;',
            '   vColor = vec4(aColor.rgb * aColor.a, aColor.a);',
            '}'
        ];

            // '   vec3 color = mod(vec3(aColor.y / 65536.0, aColor.y / 256.0, aColor.y), 256.0) / 256.0;',
            // '   vColor = vec4(color * aColor.x, aColor.x);',


        /*
        this.vertexSrc = [
            'attribute vec2 aVertexPosition;',
            'attribute vec2 aPositionCoord;',
            'attribute vec2 aScale;',
            'attribute float aRotation;',
            'attribute vec2 aTextureCoord;',
            'attribute float aColor;',
            'attribute float aTextureIndex;',

            'uniform vec2 projectionVector;',
            'uniform vec2 offsetVector;',
            'uniform mat3 uMatrix;',

            'varying vec2 vTextureCoord;',
            'varying float vColor;',
            'varying float vTextureIndex;',

            'const vec2 center = vec2(-1.0, 1.0);',

            'void main(void) {',
            '   vec2 v;',
            '   vec2 sv = aVertexPosition * aScale;',
            '   v.x = (sv.x) * cos(aRotation) - (sv.y) * sin(aRotation);',
            '   v.y = (sv.x) * sin(aRotation) + (sv.y) * cos(aRotation);',
            '   v = (uMatrix * vec3(v + aPositionCoord , 1.0)).xy ;',
            '   gl_Position = vec4((v / projectionVector) + center , 0.0, 1.0);',
            '   vTextureCoord = aTextureCoord;',
            '   vTextureIndex = aTextureIndex;',
            '   vColor = aColor;',
            '}'
        ];
        */

        var program = this.renderer.compileProgram(this.vertexSrc, this.fragmentSrc);

        var gl = this.gl;

        gl.useProgram(program);

        // get and store the uniforms for the shader
        this.uSampler = (this.renderer.enableMultiTextureToggle) ? gl.getUniformLocation(program, 'uSamplerArray[0]') : gl.getUniformLocation(program, 'uSampler');

        if (this.renderer.enableMultiTextureToggle)
        {
            var indices = [];

            // HACK: we bind an empty texture to avoid WebGL warning spam.
            var tempTexture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, tempTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, null);

            for (var i = 0; i < this.renderer.getMaxTextureUnits(); ++i)
            {
                gl.activeTexture(gl.TEXTURE0 + i);
                gl.bindTexture(gl.TEXTURE_2D, tempTexture);
                indices.push(i);
            }

            gl.activeTexture(gl.TEXTURE0);
            gl.uniform1iv(this.uSampler, indices); 
        }
       
        this.projectionVector = gl.getUniformLocation(program, 'projectionVector');
        this.offsetVector = gl.getUniformLocation(program, 'offsetVector');
        this.dimensions = gl.getUniformLocation(program, 'dimensions');
        this.uMatrix = gl.getUniformLocation(program, 'uMatrix');

        // get and store the attributes
        this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
        this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');

        this.aScale = gl.getAttribLocation(program, 'aScale');
        this.aRotation = gl.getAttribLocation(program, 'aRotation');

        this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');
        this.colorAttribute = gl.getAttribLocation(program, 'aColor');

        this.aTextureIndex = gl.getAttribLocation(program, 'aTextureIndex');

        this.attributes = [
            this.aVertexPosition,
            this.aPositionCoord,
            this.aScale,
            this.aRotation,
            this.aTextureCoord,
            this.colorAttribute,
            this.aTextureIndex
        ];

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
