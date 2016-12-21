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
    this._UID = Phaser._UID++;
    
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

    if (PIXI._enableMultiTextureToggle) {
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
            'bool isnan( float val ) {  return ( val < 0.0 || 0.0 < val || val == 0.0 ) ? false : true; }',
            'varying vec2 vTextureCoord;',
            'varying float vTextureIndex;',
         //   'varying float vColor;',
            'uniform float alpha;',
            'uniform sampler2D uSamplerArray[' + this.MAX_TEXTURES + '];',
            // Blue color means that you are trying to bound
            // a texture out of the limits of the hardware.
            'const vec4 BLUE = vec4(1.0, 0.0, 1.0, 1.0);',
            // If you get a red color means you are out of memory
            // or in some way corrupted the vertex buffer.
            'const vec4 RED = vec4(1.0, 0.0, 0.0, 1.0);',
            'void main(void) {',
            dynamicIfs,
            '   else if(vTextureIndex >= ' + this.MAX_TEXTURES + '.0) gl_FragColor = BLUE;',
            '   else if(isnan(vTextureIndex)) gl_FragColor = RED;',
            '}'
        ];    
    } else {
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
            'uniform sampler2D uSampler;',
            'void main(void) {',
            '   gl_FragColor = texture2D(uSampler, vTextureCoord);',
            '}'
        ]; 
    }

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
    this.uSampler = PIXI._enableMultiTextureToggle ?
                         gl.getUniformLocation(program, 'uSamplerArray[0]') : 
                         gl.getUniformLocation(program, 'uSampler');


    if (PIXI._enableMultiTextureToggle) {
        var indices = [];
        // HACK: we bind an empty texture to avoid WebGL warning spam.
        var tempTexture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tempTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
        for (var i = 0; i < this.MAX_TEXTURES; ++i) {
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
