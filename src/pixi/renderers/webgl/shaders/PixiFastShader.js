/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * @class PixiFastShader
 * @constructor
 * @param gl {WebGLContext} the current WebGL drawing context
 */
PIXI.PixiFastShader = function (gl) {
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
    var dynamicIfs = '\tif (vTextureIndex == 0.0) gl_FragColor = texture2D(uSamplerArray[0], vTextureCoord) * vColor;\n'
    for (var index = 1; index < this.MAX_TEXTURES; ++index)
    {
        dynamicIfs += '\telse if (vTextureIndex == ' + 
                    index + '.0) gl_FragColor = texture2D(uSamplerArray[' + 
                    index + '], vTextureCoord) * vColor;\n'
    }

    /**
     * The fragment shader.
     * @property fragmentSrc
     * @type Array
     */
    this.fragmentSrc = [
        '// PixiFastShader Fragment Shader.',
        'precision lowp float;',
        'varying vec2 vTextureCoord;',
        'varying float vColor;',
        'varying float vTextureIndex;',
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
    this.vertexSrc = [
        '// PixiFastShader Vertex Shader.',
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
        '   v = ( uMatrix * vec3(v + aPositionCoord , 1.0) ).xy ;',
        '   gl_Position = vec4( ( v / projectionVector) + center , 0.0, 1.0);',
        '   vTextureCoord = aTextureCoord;',
        '   vTextureIndex = aTextureIndex;',
        //  '   vec3 color = mod(vec3(aColor.y/65536.0, aColor.y/256.0, aColor.y), 256.0) / 256.0;',
        '   vColor = aColor;',
        '}'
    ];

    /**
     * A local texture counter for multi-texture shaders.
     * @property textureCount
     * @type Number
     */
    this.textureCount = 0;

    this.init();
};

PIXI.PixiFastShader.prototype.constructor = PIXI.PixiFastShader;

/**
 * Initialises the shader.
 * 
 * @method init
 */
PIXI.PixiFastShader.prototype.init = function () {

    var gl = this.gl;
    var program = PIXI.compileProgram(gl, this.vertexSrc, this.fragmentSrc);

    gl.useProgram(program);

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
    this.dimensions = gl.getUniformLocation(program, 'dimensions');
    this.uMatrix = gl.getUniformLocation(program, 'uMatrix');

    // get and store the attributes
    this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    this.aPositionCoord = gl.getAttribLocation(program, 'aPositionCoord');

    this.aScale = gl.getAttribLocation(program, 'aScale');
    this.aRotation = gl.getAttribLocation(program, 'aRotation');

    this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');
    this.colorAttribute = gl.getAttribLocation(program, 'aColor');

    this.aTextureIndex = gl.getAttribLocation(program, 'aTextureIndex');

    // Begin worst hack eva //

    // WHY??? ONLY on my chrome pixel the line above returns -1 when using filters?
    // maybe its somthing to do with the current state of the gl context.
    // Im convinced this is a bug in the chrome browser as there is NO reason why this should be returning -1 especially as it only manifests on my chrome pixel
    // If theres any webGL people that know why could happen please help :)
    if (this.colorAttribute === -1) {
        this.colorAttribute = 2;
    }

    this.attributes = [
        this.aVertexPosition,
        this.aPositionCoord,
        this.aScale,
        this.aRotation,
        this.aTextureCoord,
        this.colorAttribute,
        this.aTextureIndex
    ];

    // End worst hack eva //

    this.program = program;
};

/**
 * Destroys the shader.
 * 
 * @method destroy
 */
PIXI.PixiFastShader.prototype.destroy = function () {
    this.gl.deleteProgram(this.program);
    this.uniforms = null;
    this.gl = null;

    this.attributes = null;
};