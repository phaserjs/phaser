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
* uOffset - an offset for all tiles in this batch (e.g. screen shake)
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
        'uniform vec2 uClipLoc;',
        'uniform vec2 uClipLimit;',
        'varying vec2 vTexCoord;',
        'void main(void) {',
        '  if ( gl_FragCoord.x >= uClipLoc.x && gl_FragCoord.y >= uClipLoc.y && gl_FragCoord.x < uClipLimit.x && gl_FragCoord.y > uClipLimit.y )',
        '    gl_FragColor = texture2D(uImageSampler, vTexCoord) * uAlpha;',
        '}'
    ];

    this.vertexSrc = [
        'precision lowp float;',
        'uniform vec2 uOffset;',
        'uniform vec2 uCentreOffset;',
        'uniform vec2 uScale;',
        'uniform vec2 uClipOffset;',
        'attribute vec4 aPosition;',
        'varying vec2 vTexCoord;',
        'void main(void) {',
        '  gl_Position.zw = vec2(1, 1);',
        '  gl_Position.xy = (aPosition.xy + uClipOffset + uOffset + uCentreOffset) * uScale - uCentreOffset;',
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

    // clipping uniforms...

    // clipping start location (pixels)
    this.uClipLoc = gl.getUniformLocation(program, 'uClipLoc');
    // clipping width/height (pixels)
    this.uClipLimit = gl.getUniformLocation(program, 'uClipLimit');
    // clipping start location in webGl coordinates (-1...+1)
    this.uClipOffset = gl.getUniformLocation(program, 'uClipOffset');

    // offset for screen shake effect etc
    this.uOffset = gl.getUniformLocation(program, 'uOffset');

    // centre of a tile for offset before scaling (so tiles scale from the centre out)
    this.uCentreOffset = gl.getUniformLocation(program, 'uCentreOffset');
    // scale factor for tiles
    this.uScale = gl.getUniformLocation(program, 'uScale');

    // alpha blending
    this.uAlpha = gl.getUniformLocation(program, 'uAlpha');

    this.attributes = [this.aPosition];
    this.uniforms = [this.uClipOffset, this.uClipLoc, this.uClipLimit, this.uOffset, this.uCentreOffset, this.uAlpha, this.uScale, this.uSampler];

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
