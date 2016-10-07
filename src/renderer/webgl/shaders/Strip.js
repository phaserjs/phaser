/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Mat Groves (@Doormat23)
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* New version of PIXI.StripShader
*
* @class Phaser.Renderer.Canvas
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
*/
Phaser.Renderer.WebGL.Shaders.Strip = function (renderer)
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

    //  @type {GLint}
    this.colorAttribute;

    //  @type {GLint}
    this.aTextureIndex;

    //  @type {GLint}
    this.aVertexPosition;

    //  @type {GLint}
    this.aTextureCoord;

    //  @type {WebGLUniformLocation }
    this.translationMatrix;

    //  @type {WebGLUniformLocation }
    this.alpha;

    this.init();
};

Phaser.Renderer.WebGL.Shaders.Strip.prototype.constructor = Phaser.Renderer.WebGL.Shaders.Strip;

Phaser.Renderer.WebGL.Shaders.Strip.prototype = {

    init: function ()
    {
        if (this.renderer.enableMultiTextureToggle)
        {
            var dynamicIfs = '\tif (vTextureIndex == 0.0) gl_FragColor = texture2D(uSamplerArray[0], vTextureCoord);\n'

            for (var index = 1; index < this.renderer.getMaxTextureUnits(); ++index)
            {
                dynamicIfs += '\telse if (vTextureIndex == ' + 
                            index + '.0) gl_FragColor = texture2D(uSamplerArray[' + 
                            index + '], vTextureCoord) ;\n'
            }

            this.fragmentSrc = [
                'precision mediump float;',
                'varying vec2 vTextureCoord;',
                'varying float vTextureIndex;',
                'uniform float alpha;',
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
                'precision mediump float;',
                'varying vec2 vTextureCoord;',
                'varying float vTextureIndex;',
                'uniform float alpha;',
                'uniform sampler2D uSampler;',
                'void main(void) {',
                '   gl_FragColor = texture2D(uSampler, vTextureCoord);',
                '}'
            ]; 
        }  

        this.vertexSrc  = [
            'attribute vec2 aVertexPosition;',
            'attribute vec2 aTextureCoord;',
            'attribute float aTextureIndex;',
            'uniform mat3 translationMatrix;',
            'uniform vec2 projectionVector;',
            'uniform vec2 offsetVector;',
            'varying vec2 vTextureCoord;',
            'varying float vTextureIndex;',

            'void main(void) {',
            '   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);',
            '   v -= offsetVector.xyx;',
            '   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);',
            '   vTextureCoord = aTextureCoord;',
            '   vTextureIndex = aTextureIndex;',
            '}'
        ];

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
        this.colorAttribute = gl.getAttribLocation(program, 'aColor');
        this.aTextureIndex = gl.getAttribLocation(program, 'aTextureIndex');

        // get and store the attributes
        this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
        this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');

        this.attributes = [this.aVertexPosition, this.aTextureCoord, this.aTextureIndex];

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
