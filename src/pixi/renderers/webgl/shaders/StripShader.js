/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
* @class StripShader
* @constructor
* @param gl {WebGLContext} the current WebGL drawing context
*/
PIXI.StripShader = function(gl)
{
    /**
     * @property _UID
     * @type Number
     * @private
     */
    this._UID = PIXI._UID++;
    
    /**
     * @property gl
     * @type WebGLContext
     */
    this.gl = gl;

    /**
     * The WebGL program.
     * @property program
     * @type Any
     */
    this.program = null;

    var gl = this.gl;
    this.MAX_TEXTURES = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
    var dynamicIfs = '\tif (vTextureIndex == 0.0) gl_FragColor = texture2D(uSamplerArray[0], vTextureCoord);\n'
    for (var index = 1; index < this.MAX_TEXTURES; ++index)
    {
        dynamicIfs += '\telse if (vTextureIndex == ' + 
                    index + '.0) gl_FragColor = texture2D(uSamplerArray[' + 
                    index + '], vTextureCoord) ;\n'
    }


    /**
     * The fragment shader.
     * @property fragmentSrc
     * @type Array
     */
    this.fragmentSrc = [
        '//StripShader Fragment Shader.',
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying float vTextureIndex;',
     //   'varying float vColor;',
        'uniform float alpha;',
        'uniform sampler2D uSamplerArray[' + this.MAX_TEXTURES + '];',
        'const vec4 PINK = vec4(1.0, 0.0, 1.0, 1.0);',
        'const vec4 GREEN = vec4(0.0, 1.0, 0.0, 1.0);',
        'void main(void) {',
        dynamicIfs,
        'else gl_FragColor = PINK;',
        '}'
    ];

    /**
     * The vertex shader.
     * @property vertexSrc
     * @type Array
     */
    this.vertexSrc  = [
        '//StripShader Vertex Shader.',
        'attribute vec2 aVertexPosition;',
        'attribute vec2 aTextureCoord;',
        'attribute float aTextureIndex;',
        'uniform mat3 translationMatrix;',
        'uniform vec2 projectionVector;',
        'uniform vec2 offsetVector;',
      //  'uniform float alpha;',
       // 'uniform vec3 tint;',
        'varying vec2 vTextureCoord;',
        'varying float vTextureIndex;',
      //  'varying vec4 vColor;',

        'void main(void) {',
        '   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);',
        '   v -= offsetVector.xyx;',
        '   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);',
        '   vTextureCoord = aTextureCoord;',
        '   vTextureIndex = aTextureIndex;',
       // '   vColor = aColor * vec4(tint * alpha, alpha);',
        '}'
    ];

    this.init();
};

PIXI.StripShader.prototype.constructor = PIXI.StripShader;

/**
* Initialises the shader.
* 
* @method init
*/
PIXI.StripShader.prototype.init = function()
{
    var gl = this.gl;
    var program = PIXI.compileProgram(gl, this.vertexSrc, this.fragmentSrc);
    gl.useProgram(program);

    // get and store the uniforms for the shader
    // get and store the uniforms for the shader
    this.uSampler = gl.getUniformLocation(program, 'uSamplerArray[0]');

    var indices = [];
    for (var i = 0; i < this.MAX_TEXTURES; ++i) {
        indices.push(i);
    }
    // NOTE:!!!
    // If textures are not bound
    // then we'll get a bunch of warnings like:
    // "WARNING: there is no texture bound to the unit X"
    // Don't be scared, everything will be alright.
    gl.uniform1iv(this.uSampler, indices);

    this.projectionVector = gl.getUniformLocation(program, 'projectionVector');
    this.offsetVector = gl.getUniformLocation(program, 'offsetVector');
    this.colorAttribute = gl.getAttribLocation(program, 'aColor');
    this.aTextureIndex = gl.getAttribLocation(program, 'aTextureIndex');
    //this.dimensions = gl.getUniformLocation(this.program, 'dimensions');

    // get and store the attributes
    this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');

    this.attributes = [this.aVertexPosition, this.aTextureCoord, this.aTextureIndex];

    this.translationMatrix = gl.getUniformLocation(program, 'translationMatrix');
    this.alpha = gl.getUniformLocation(program, 'alpha');

    this.program = program;
};

/**
* Destroys the shader.
* 
* @method destroy
*/
PIXI.StripShader.prototype.destroy = function()
{
    this.gl.deleteProgram( this.program );
    this.uniforms = null;
    this.gl = null;

    this.attribute = null;
};
