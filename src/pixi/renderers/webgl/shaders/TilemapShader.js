
/**
* @class TilemapShader
* @constructor
* @param gl {WebGLContext} the current WebGL drawing context
*/
PIXI.TilemapShader = function(gl)
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

    /**
     * The fragment shader.
     * @property fragmentSrc
     * @type Array
     */
    this.fragmentSrc = [
        "  precision mediump float;",
        "  uniform sampler2D uImageSampler;",
        "  varying vec2 vTexCoord;",
        "  void main(void) {",
        "    gl_FragColor = texture2D(uImageSampler, vTexCoord);",
        "  }"
    ];
    
    /**
     * The vertex shader.
     * @property vertexSrc
     * @type Array
     */
    this.vertexSrc = [
        "  attribute vec4 aPosition;",
        "  uniform mat3 uProjectionMatrix;",
        "  uniform mat3 uModelMatrix;",
        "  varying vec2 vTexCoord;",
        "  void main(void) {",
        "    vec3 pos = uProjectionMatrix * uModelMatrix * vec3(aPosition.xy, 1);",
        "    gl_Position = vec4(pos.xy, 1, 1);",
        "    vTexCoord = aPosition.zw;",
        "  }"
    ];  
      
    /**
     * A local texture counter for multi-texture shaders.
     * @property textureCount
     * @type Number
     */
    this.textureCount = 0;

    this.init();
};

PIXI.TilemapShader.prototype.constructor = PIXI.TilemapShader;

/**
* Initialises the shader.
* 
* @method init
*/
PIXI.TilemapShader.prototype.init = function()
{
    var gl = this.gl;

    var program = PIXI.compileProgram(gl, this.vertexSrc, this.fragmentSrc);
    gl.useProgram(program);

    // get and store the attributes
    this.aPosition = gl.getAttribLocation(program, 'aPosition');
    this.uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
    this.uModelMatrix = gl.getUniformLocation(program, 'uModelMatrix');
    this.uSampler = gl.getUniformLocation(program, 'uImageSampler');

    this.attributes = [this.aPosition, this.uProjectionMatrix, this.uModelMatrix, this.uSampler];

    this.program = program;
};

/**
* Destroys the shader.
* 
* @method destroy
*/
PIXI.TilemapShader.prototype.destroy = function()
{
    this.gl.deleteProgram( this.program );
    this.uniforms = null;
    this.gl = null;

    this.attributes = null;
};
