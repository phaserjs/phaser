/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Pete Baron <pete@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* This shader is used to render a batch of tiles stored as a tri-strip with
* degenerate triangles at the end of each row, or group of tiles (A group is a
* row of tiles with content followed by one or more empty tiles which are not
* drawn).
*
* Settings available are:
* 
* uAlpha - the alpha blending factor for a batch draw
* uCentreOffset - the offset to the center of the drawing area, in WebGL units (-1...1)
* uScale - the scaling factor for a batch draw
* uImageSampler - the source texture containing the tile images
* aPosition - the attribute set by the batch data for drawing location
* 
* @class TilemapShader
* @constructor
* @param gl {WebGLContext} the current WebGL drawing context
*/
PIXI.TilemapShader = function (gl) {

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
        'precision lowp float;',
        'uniform sampler2D uImageSampler;',
        'uniform float uAlpha;',
        'varying vec2 vTexCoord;',
        'void main(void) {',
        '  gl_FragColor = texture2D(uImageSampler, vTexCoord) * uAlpha;',
        '}'
    ];

    this.vertexSrc = [
        'precision lowp float;',
        'uniform vec2 uCentreOffset;',
        'uniform vec2 uScale;',
        'attribute vec4 aPosition;',
        'varying vec2 vTexCoord;',
        'void main(void) {',
        '  gl_Position.zw = vec2(1, 1);',
        '  gl_Position.xy = (aPosition.xy + uCentreOffset) * uScale - uCentreOffset;',
        '  vTexCoord = aPosition.zw;',
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

PIXI.TilemapShader.prototype.constructor = PIXI.TilemapShader;

/**
* Initialises the shader.
* 
* @method init
*/
PIXI.TilemapShader.prototype.init = function () {

    var gl = this.gl;

    var program = PIXI.compileProgram(gl, this.vertexSrc, this.fragmentSrc);
    gl.useProgram(program);

    // get and store the attributes
    this.aPosition = gl.getAttribLocation(program, 'aPosition');
    this.uSampler = gl.getUniformLocation(program, 'uImageSampler');
    this.uCentreOffset = gl.getUniformLocation(program, 'uCentreOffset');
    this.uAlpha = gl.getUniformLocation(program, 'uAlpha');
    this.uScale = gl.getUniformLocation(program, 'uScale');

    this.attributes = [this.aPosition];
    this.uniforms = [this.uCentreOffset, this.uAlpha, this.uScale, this.uSampler];

    this.program = program;

};

/**
* Destroys the shader.
* 
* @method destroy
*/
PIXI.TilemapShader.prototype.destroy = function () {

    this.gl.deleteProgram(this.program);
    this.gl = null;

    this.uniforms = null;
    this.attributes = null;

};
