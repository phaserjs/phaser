/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Mat Groves (@Doormat23)
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* New version of PIXI.DefaultShader
*
* @class Phaser.Renderer.Canvas
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
*/
Phaser.Renderer.WebGL.Shaders.Sprite = function (renderer)
{
    this.renderer = renderer;

    //  WebGLContext
    this.gl = renderer.gl;

    /**
     * @property _UID
     * @type Number
     * @private
     */
    this._UID = Phaser._UID++;

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
    this.fragmentSrc = null;

    // this.vertexSrc = [];

    /**
     * Uniform attributes cache.
     * @property attributes
     * @type Array
     * @private
     */
    this.attributes = [];

    /**
     * A local texture counter for multi-texture shaders.
     * @property textureCount
     * @type Number
     */
    this.textureCount = 0;

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

    this.defaultVertexSrc = [];

    this.init();
};

Phaser.Renderer.WebGL.Shaders.Sprite.prototype.constructor = Phaser.Renderer.WebGL.Shaders.Sprite;

Phaser.Renderer.WebGL.Shaders.Sprite.prototype = {

    init: function (usingFilter)
    {
        //  Externalize these, so devs can change them
        this.defaultVertexSrc = [
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
            '   if (aTextureIndex > 0.0) gl_Position = vec4(0.0);',
            '   gl_Position = vec4( ((aVertexPosition + offsetVector) / projectionVector) + center , 0.0, 1.0);',
            '   vTextureCoord = aTextureCoord;',
            '   vColor = vec4(aColor.rgb * aColor.a, aColor.a);',
            '   vTextureIndex = aTextureIndex;',
            '}'
        ];

        if (this.renderer.enableMultiTextureToggle && !usingFilter)
        {
            this.initMultitexShader();
        }
        else
        {
            this.initDefaultShader();
        }  
    },

    initDefaultShader: function ()
    {
        if (this.fragmentSrc === null)
        {
            this.fragmentSrc = [
                'precision lowp float;',
                'varying vec2 vTextureCoord;',
                'varying vec4 vColor;',
                'varying float vTextureIndex;',
                'uniform sampler2D uSampler;',
                'void main(void) {',
                '   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;',
                '}'
            ];
        }

        var gl = this.gl;

        var program = this.renderer.compileProgram(this.vertexSrc || this.defaultVertexSrc, this.fragmentSrc);

        gl.useProgram(program);

        // get and store the uniforms for the shader
        this.uSampler = gl.getUniformLocation(program, 'uSampler');
        this.projectionVector = gl.getUniformLocation(program, 'projectionVector');
        this.offsetVector = gl.getUniformLocation(program, 'offsetVector');
        this.dimensions = gl.getUniformLocation(program, 'dimensions');

        // get and store the attributes
        this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
        this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');
        this.colorAttribute = gl.getAttribLocation(program, 'aColor');
        this.aTextureIndex = gl.getAttribLocation(program, 'aTextureIndex');

        this.attributes = [this.aVertexPosition, this.aTextureCoord, this.colorAttribute, this.aTextureIndex];

        // add those custom shaders!
        for (var key in this.uniforms)
        {
            // get the uniform locations..
            this.uniforms[key].uniformLocation = gl.getUniformLocation(program, key);
        }

        this.initUniforms();

        this.program = program;
    },

    initUniforms: function ()
    {
        this.textureCount = 1;
        var gl = this.gl;
        var uniform;

        for (var key in this.uniforms)
        {
            uniform = this.uniforms[key];

            switch (uniform.type)
            {
                case 'sampler2D':

                    uniform._init = false;

                    if (uniform.value !== null)
                    {
                        this.initSampler2D(uniform);
                    }
                    
                    break;

                case 'mat2':

                    uniform.glMatrix = true;
                    uniform.glValueLength = 1;
                    uniform.glFunc = gl.uniformMatrix2fv;
                    break;

                case 'mat3':

                    uniform.glMatrix = true;
                    uniform.glValueLength = 1;
                    uniform.glFunc = gl.uniformMatrix3fv;
                    break;

                case 'mat4':

                    uniform.glMatrix = true;
                    uniform.glValueLength = 1;
                    uniform.glFunc = gl.uniformMatrix4fv;
                    break;

                default:

                    //  GL function reference
                    uniform.glFunc = gl['uniform' + uniform.type];

                    if (uniform.type === '2f' || uniform.type === '2i')
                    {
                        uniform.glValueLength = 2;
                    }
                    else if (uniform.type === '3f' || uniform.type === '3i')
                    {
                        uniform.glValueLength = 3;
                    }
                    else if (uniform.type === '4f' || uniform.type === '4i')
                    {
                        uniform.glValueLength = 4;
                    }
                    else
                    {
                        uniform.glValueLength = 1;
                    }
            }
        }

    },

    /**
    * Initialises a Sampler2D uniform (which may only be available later on after initUniforms once the texture has loaded)
    *
    * @method initSampler2D
    */
    initSampler2D: function (uniform)
    {
        if (!uniform.value || !uniform.value.baseTexture || !uniform.value.baseTexture.hasLoaded)
        {
            return;
        }

        var gl = this.gl;

        // No need to do string manipulation for this.
        gl.activeTexture(gl.TEXTURE0 + this.textureCount);
        gl.bindTexture(gl.TEXTURE_2D, uniform.value.baseTexture._glTextures[gl.id]);

        //  Extended texture data
        if (uniform.textureData)
        {
            var data = uniform.textureData;

            // GLTexture = mag linear, min linear_mipmap_linear, wrap repeat + gl.generateMipmap(gl.TEXTURE_2D);
            // GLTextureLinear = mag/min linear, wrap clamp
            // GLTextureNearestRepeat = mag/min NEAREST, wrap repeat
            // GLTextureNearest = mag/min nearest, wrap clamp
            // AudioTexture = whatever + luminance + width 512, height 2, border 0
            // KeyTexture = whatever + luminance + width 256, height 2, border 0

            //  magFilter can be: gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR or gl.NEAREST
            //  wrapS/T can be: gl.CLAMP_TO_EDGE or gl.REPEAT

            var magFilter = (data.magFilter) ? data.magFilter : gl.LINEAR;
            var minFilter = (data.minFilter) ? data.minFilter : gl.LINEAR;
            var wrapS = (data.wrapS) ? data.wrapS : gl.CLAMP_TO_EDGE;
            var wrapT = (data.wrapT) ? data.wrapT : gl.CLAMP_TO_EDGE;
            var format = (data.luminance) ? gl.LUMINANCE : gl.RGBA;

            if (data.repeat)
            {
                wrapS = gl.REPEAT;
                wrapT = gl.REPEAT;
            }

            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, !!data.flipY);

            if (data.width)
            {
                var width = (data.width) ? data.width : 512;
                var height = (data.height) ? data.height : 2;
                var border = (data.border) ? data.border : 0;

                // void texImage2D(GLenum target, GLint level, GLenum internalformat, GLsizei width, GLsizei height, GLint border, GLenum format, GLenum type, ArrayBufferView? pixels);
                gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, border, format, gl.UNSIGNED_BYTE, null);
            }
            else
            {
                //  void texImage2D(GLenum target, GLint level, GLenum internalformat, GLenum format, GLenum type, ImageData? pixels);
                gl.texImage2D(gl.TEXTURE_2D, 0, format, gl.RGBA, gl.UNSIGNED_BYTE, uniform.value.baseTexture.source);
            }

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
        }

        gl.uniform1i(uniform.uniformLocation, this.textureCount);

        uniform._init = true;

        this.textureCount++;
    },

    /**
    * Updates the shader uniform values.
    *
    * @method syncUniforms
    */
    syncUniforms: function ()
    {
        this.textureCount = 1;
        var uniform;
        var gl = this.gl;

        //  This would probably be faster in an array and it would guarantee key order
        for (var key in this.uniforms)
        {
            uniform = this.uniforms[key];

            if (uniform.glValueLength === 1)
            {
                if (uniform.glMatrix === true)
                {
                    uniform.glFunc.call(gl, uniform.uniformLocation, uniform.transpose, uniform.value);
                }
                else
                {
                    uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value);
                }
            }
            else if (uniform.glValueLength === 2)
            {
                uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y);
            }
            else if (uniform.glValueLength === 3)
            {
                uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y, uniform.value.z);
            }
            else if (uniform.glValueLength === 4)
            {
                uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y, uniform.value.z, uniform.value.w);
            }
            else if (uniform.type === 'sampler2D')
            {
                if (uniform._init)
                {
                    gl.activeTexture(gl['TEXTURE' + this.textureCount]);

                    if(uniform.value.baseTexture._dirty[gl.id])
                    {
                        PIXI.instances[gl.id].updateTexture(uniform.value.baseTexture);
                    }
                    else
                    {
                        // bind the current texture
                        gl.bindTexture(gl.TEXTURE_2D, uniform.value.baseTexture._glTextures[gl.id]);
                    }

                    //  gl.bindTexture(gl.TEXTURE_2D, uniform.value.baseTexture._glTextures[gl.id] || PIXI.createWebGLTexture( uniform.value.baseTexture, gl));
                    gl.uniform1i(uniform.uniformLocation, this.textureCount);
                    this.textureCount++;
                }
                else
                {
                    this.initSampler2D(uniform);
                }
            }
        }

    },


/*
PIXI.PixiShader.prototype.initMultitexShader = function () {
    var gl = this.gl;
    this.MAX_TEXTURES = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
    var dynamicIfs = '\tif (vTextureIndex == 0.0) gl_FragColor = texture2D(uSamplerArray[0], vTextureCoord) * vColor;\n'
    for (var index = 1; index < this.MAX_TEXTURES; ++index)
    {
        dynamicIfs += '\telse if (vTextureIndex == ' + 
                    index + '.0) gl_FragColor = texture2D(uSamplerArray[' + 
                    index + '], vTextureCoord) * vColor;\n'
    }
    this.fragmentSrc = [
        '// PixiShader Fragment Shader.',
        'precision lowp float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'varying float vTextureIndex;',
        'uniform sampler2D uSamplerArray[' + this.MAX_TEXTURES + '];',
        'const vec4 PINK = vec4(1.0, 0.0, 1.0, 1.0);',
        'const vec4 GREEN = vec4(0.0, 1.0, 0.0, 1.0);',
        'void main(void) {',
        dynamicIfs,
        'else gl_FragColor = PINK;',
        '}'
    ];

    var program = PIXI.compileProgram(gl, this.vertexSrc || PIXI.PixiShader.defaultVertexSrc, this.fragmentSrc);

    gl.useProgram(program);

    // get and store the uniforms for the shader
    //this.uSampler = gl.getUniformLocation(program, 'uSampler');
    this.uSamplerArray = gl.getUniformLocation(program, 'uSamplerArray[0]');
    this.projectionVector = gl.getUniformLocation(program, 'projectionVector');
    this.offsetVector = gl.getUniformLocation(program, 'offsetVector');
    this.dimensions = gl.getUniformLocation(program, 'dimensions');

    // get and store the attributes
    this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');
    this.colorAttribute = gl.getAttribLocation(program, 'aColor');
    this.aTextureIndex = gl.getAttribLocation(program, 'aTextureIndex');

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
    gl.uniform1iv(this.uSamplerArray, indices);

    // Begin worst hack eva //

    // WHY??? ONLY on my chrome pixel the line above returns -1 when using filters?
    // maybe its something to do with the current state of the gl context.
    // I'm convinced this is a bug in the chrome browser as there is NO reason why this should be returning -1 especially as it only manifests on my chrome pixel
    // If theres any webGL people that know why could happen please help :)
    if(this.colorAttribute === -1)
    {
        this.colorAttribute = 2;
    }

    this.attributes = [this.aVertexPosition, this.aTextureCoord, this.colorAttribute, this.aTextureIndex];

    // End worst hack eva //

    // add those custom shaders!
    for (var key in this.uniforms)
    {
        // get the uniform locations..
        this.uniforms[key].uniformLocation = gl.getUniformLocation(program, key);
    }

    this.initUniforms();

    this.program = program;
};
*/

    destroy: function ()
    {
        this.gl.deleteProgram(this.program);
        this.uniforms = null;
        this.gl = null;
        this.renderer = null;
        this.attributes = null;
    }

};
