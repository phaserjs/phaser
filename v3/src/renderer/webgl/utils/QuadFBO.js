/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var CreateEmptyTexture = require('./CreateEmptyTexture');

/**
* Frame Buffer Object with drawing quad + shader
*
* @class Phaser.Renderer.Canvas
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
*/
var QuadFBO = function (renderer, parent, x, y, width, height)
{
    this.renderer = renderer;

    this.parent = parent;

    this.gl = renderer.gl;

    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;

    this.textureIndex = 0;

    this.clipX = function (x)
    {
        return (renderer.clipUnitX * x) - 1;
    };

    this.clipY = function (y)
    {
        return 1 - (renderer.clipUnitY * y);
    };

    this.vertexBuffer;
    this.indexBuffer;
    this.textureBuffer;

    this.vertices;

    this.texture;
    this.renderBuffer;
    this.frameBuffer;

    this.program;
    this.aVertexPosition;
    this.aTextureCoord;

    this._normal;
    this._twirl;

    this.init();
};

QuadFBO.prototype.constructor = QuadFBO;

QuadFBO.prototype = {

    init: function ()
    {
        var gl = this.gl;

        //  An FBO quad is made up of 2 triangles (A and B in the image below)
        //
        //  0 = Bottom Left (-1, -1)
        //  1 = Bottom Right (1, -1)
        //  2 = Top Left (-1, 1)
        //  3 = Top Right (1, 1)
        //
        //  2----3
        //  |\  B|
        //  | \  |
        //  |  \ |
        //  | A \|
        //  |    \
        //  0----1

        var width = this.renderer.width;
        var height = this.renderer.height;

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([ 0, 1, 2, 2, 1, 3 ]), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        this.vertices = new Float32Array(8);

        this.updateVerts();

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

        this.textureBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ 0, 0, 1, 0, 0, 1, 1, 1 ]), gl.STATIC_DRAW);

        //  Create a texture for our color buffer
        this.texture = CreateEmptyTexture(gl, width, height, 0, 0);

        //  The FBO's depth buffer
        this.renderBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);

        this.frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);

        //  May need to optionally be: gl.DEPTH_STENCIL_ATTACHMENT
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderBuffer);

        var fbStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

        if (fbStatus !== gl.FRAMEBUFFER_COMPLETE)
        {
            window.console.error('FrameBuffer Error: ', this.renderer._fbErrors[fbStatus]);
        }

        this.createShader();
    },

    //  This whole function ought to be split out into the Shader Manager
    //    so they can easily change the shader being used for an FBO.
    //  This class will have to expose those shader attribs though.
    createShader: function ()
    {
        //  Create the quad shader

        var gl = this.gl;

        var vertexSrc = [
            'attribute vec2 aVertexPosition;',
            'attribute vec2 aTextureCoord;',

            'varying vec2 vTextureCoord;',

            'void main(void) {',
            '   vTextureCoord = aTextureCoord;',
            '   gl_Position = vec4(aVertexPosition, 0.0, 1.0);',
            '}'
        ];

        var fragmentSrc = [
            'precision mediump float;',

            'uniform sampler2D uSampler;',
            'uniform float time;',

            'varying vec2 vTextureCoord;',

            'void main(void) {',
            '   gl_FragColor = texture2D(uSampler, vTextureCoord);',
            '}'
        ];

        var twirlFragmentSrc = [
            'precision mediump float;',

            'uniform sampler2D uSampler;',
            'uniform float time;',

            'varying vec2 vTextureCoord;',

            'const float radius = 0.5;',
            'const float angle = 5.0;',
            'const vec2 offset = vec2(0.5, 0.5);',

            'void main(void) {',
            '   vec2 coord = vTextureCoord - offset;',
            '   float distance = length(coord);',

            '   if (distance < radius) {',
            '       float ratio = (radius - distance) / radius;',
            '       float angleMod = ratio * ratio * angle;',
            '       float s = sin(angleMod);',
            '       float c = cos(angleMod);',
            '       coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);',
            '   }',

            '   gl_FragColor = texture2D(uSampler, coord + offset);',
            '}'
        ];

        var plasmaFragmentSrc = [

            'precision mediump float;',

            'uniform sampler2D uSampler;',
            'uniform float time;',

            'varying vec2 vTextureCoord;',

            '// Oldskool plasm shader. (c) Victor Korsun, bitekas@gmail.com; 1996-2013.',
            '//',
            '// Attribution-ShareAlike CC License.',

            '//----------------',
            'const int ps = 2; // use values > 1..10 for oldskool',
            'const vec2 resolution = vec2(1280.0, 720.0);',
            '//----------------',

            'void main(void) {',

            'float x = gl_FragCoord.x / resolution.x * 1280.0;',
            'float y = gl_FragCoord.y / resolution.y * 720.0;',

            'if (ps > 0)',
            '{',
            'x = float(int(x / float(ps)) * ps);',
            'y = float(int(y / float(ps)) * ps);',
            '}',

            'float mov0 = x+y+sin(time)*10.+sin(x/90.)*70.+time*2.;',
            'float mov1 = (mov0 / 5. + sin(mov0 / 30.))/ 10. + time * 3.;',
            'float mov2 = mov1 + sin(mov1)*5. + time*1.0;',
            'float cl1 = sin(sin(mov1/4. + time)+mov1);',
            'float c1 = cl1 +mov2/2.-mov1-mov2+time;',
            'float c2 = sin(c1+sin(mov0/100.+time)+sin(y/57.+time/50.)+sin((x+y)/200.)*2.);',
            'float c3 = abs(sin(c2+cos((mov1+mov2+c2) / 10.)+cos((mov2) / 10.)+sin(x/80.)));',

            'float dc = float(16-ps);',

            'if (ps > 0)',
            '{',
            'cl1 = float(int(cl1*dc))/dc;',
            'c2 = float(int(c2*dc))/dc;',
            'c3 = float(int(c3*dc))/dc;',
            '}',

            'gl_FragColor = vec4(cl1, c2, c3, 1.0);',

            '}'
        ];


        //  This compiles, attaches and links the shader
        this._normal = this.renderer.compileProgram(vertexSrc, fragmentSrc);
        // this._twirl = this.renderer.compileProgram(vertexSrc, twirlFragmentSrc);
        this._twirl = this.renderer.compileProgram(vertexSrc, plasmaFragmentSrc);

        this.program = this._normal;

        this.aVertexPosition = gl.getAttribLocation(this.program, 'aVertexPosition');
        this.aTextureCoord = gl.getAttribLocation(this.program, 'aTextureCoord');
    },

    setPosition: function (x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        if (x !== this._x || y !== this._y)
        {
            this._x = x;
            this._y = y;

            this.updateVerts();
        }
    },

    setSize: function (width, height)
    {
        if (width === undefined) { width = this.renderer.width; }
        if (height === undefined) { height = this.renderer.height; }

        if (width !== this._width || height !== this._height)
        {
            this._width = width;
            this._height = height;

            this.updateVerts();
        }
    },

    updateVerts: function ()
    {
        var x = this._x;
        var y = this._y;

        var width = this._width;
        var height = this._height;

        //  Bottom Left
        this.vertices[0] = this.clipX(x);
        this.vertices[1] = this.clipY(y + height);

        //  Bottom Right
        this.vertices[2] = this.clipX(x + width);
        this.vertices[3] = this.clipY(y + height);

        //  Top Left
        this.vertices[4] = this.clipX(x);
        this.vertices[5] = this.clipY(y);

        //  Top Right
        this.vertices[6] = this.clipX(x + width);
        this.vertices[7] = this.clipY(y);
    },

    activate: function ()
    {
        var gl = this.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);

        //  FBO textures always use index zero
        this.renderer.textureArray[0] = this.texture;
    },

    bindShader: function ()
    {
        var program = this.program;

        var gl = this.gl;

        gl.useProgram(program);

        gl.uniform1i(gl.getUniformLocation(program, 'uSampler'), 0);
        gl.uniform1f(gl.getUniformLocation(program, 'time'), this.parent.sys.mainloop.frameDelta);

        gl.enableVertexAttribArray(this.aTextureCoord);
        gl.enableVertexAttribArray(this.aVertexPosition);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);
        gl.vertexAttribPointer(this.aVertexPosition, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.vertexAttribPointer(this.aTextureCoord, 2, gl.FLOAT, false, 0, 0);
    },

    //  destinationBuffer MUST be set, even if just to 'null'
    render: function (destinationBuffer)
    {
        var gl = this.gl;

        //  Set the framebuffer to render to
        gl.bindFramebuffer(gl.FRAMEBUFFER, destinationBuffer);

        //  Bind the texture we rendered to, for reading, always TEXTURE0
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        //  The shader that will read from the fbo texture
        if (this.renderer.shaderManager.setShader(this.program))
        {
            this.bindShader();
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

        this.renderer.drawCount++;
    },

    destroy: function ()
    {

        //  TODO!

    }

};

Object.defineProperties(QuadFBO.prototype, {

    x: {

        enumerable: true,

        get: function ()
        {
            return this._x;
        },

        set: function (value)
        {
            if (value !== this._x)
            {
                this._x = value;
                this.updateVerts();
            }
        }

    },

    y: {

        enumerable: true,

        get: function ()
        {
            return this._y;
        },

        set: function (value)
        {
            if (value !== this._y)
            {
                this._y = value;
                this.updateVerts();
            }
        }

    },

    width: {

        enumerable: true,

        get: function ()
        {
            return this._width;
        },

        set: function (value)
        {
            if (value !== this._width)
            {
                this._width = value;
                this.updateVerts();
            }
        }

    },

    height: {

        enumerable: true,

        get: function ()
        {
            return this._height;
        },

        set: function (value)
        {
            if (value !== this._height)
            {
                this._height = value;
                this.updateVerts();
            }
        }

    }

});

module.exports = QuadFBO;
