/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

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

    this.fragmentSrc = [
        "  precision lowp float;",
        "  uniform sampler2D uImageSampler;",
        "  uniform float uAlpha;",
        "  varying vec2 vTexCoord;",
        "  void main(void) {",
        "    gl_FragColor = texture2D(uImageSampler, vTexCoord) * uAlpha;",
        "  }"
        ];

    this.vertexSrc = [
        "  precision lowp float;",
        "  uniform vec2 uScrollOffset;",
        "  attribute vec4 aPosition;",
        "  varying vec2 vTexCoord;",
        "  void main(void) {",
        "    gl_Position.zw = vec2(1, 1);",
        "    gl_Position.xy = aPosition.xy - uScrollOffset;",
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
    this.uSampler = gl.getUniformLocation(program, 'uImageSampler');
    this.uScrollOffset = gl.getUniformLocation(program, 'uScrollOffset');
    this.uAlpha = gl.getUniformLocation(program, 'uAlpha');

    this.attributes = [this.aPosition, this.uSampler];
    this.uniforms = [this.uScrollOffset, this.uAlpha];

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
