/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Frame Buffer Object with drawing quad + shader
*
* @class Phaser.Renderer.Canvas
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
*/
Phaser.Renderer.WebGL.QuadFBO = function (renderer, x, y, width, height)
{
    this.renderer = renderer;

    this.gl = null;

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

    this.vbo;
    this.ibo;
    this.verticesTextureBuffer;
    this.vertices;

    this.frameTexture;
    this.renderbuffer;
    this.framebuffer;

    this.program;
    this.aVertexPosition;
    this.aTextureCoord;
};

Phaser.Renderer.WebGL.QuadFBO.prototype.constructor = Phaser.Renderer.WebGL.QuadFBO;

Phaser.Renderer.WebGL.QuadFBO.prototype = {

    init: function ()
    {
        this.gl = this.renderer.gl;

        var gl = this.gl;

        this.vbo = gl.createBuffer();
        this.ibo = gl.createBuffer();
        this.verticesTextureBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([ 0, 1, 2, 2, 1, 3 ]), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        this.vertices = new Float32Array(8);

        this.updateVerts();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesTextureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ 0, 0, 1, 0, 0, 1, 1, 1 ]), gl.STATIC_DRAW);

        this.frameTexture = this.renderer.createEmptyTexture(this.width, this.height);

        this.renderbuffer = gl.createRenderbuffer();

        gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);

        this.framebuffer = gl.createFramebuffer();

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.frameTexture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer);

        var fbStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

        if (fbStatus !== gl.FRAMEBUFFER_COMPLETE)
        {
            window.console.error('FrameBuffer Error: ', this.renderer._fbErrors[fbStatus]);
        }

        //  Reset back to defaults
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

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
            'varying vec2 vTextureCoord;',

            'void main(void) {',
            '   gl_FragColor = texture2D(uSampler, vTextureCoord);',
            '}'
        ];

        //  This compiles, attaches and links the shader
        this.program = this.renderer.compileProgram(vertexSrc, fragmentSrc);

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

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    },

    render: function ()
    {
        var gl = this.gl;
        var program = this.program;

        gl.useProgram(program);

        gl.activeTexture(gl.TEXTURE0 + this.textureIndex);
        gl.bindTexture(gl.TEXTURE_2D, this.frameTexture);
        gl.uniform1i(gl.getUniformLocation(program, 'uSampler'), 0);

        gl.enableVertexAttribArray(this.aTextureCoord);
        gl.enableVertexAttribArray(this.aVertexPosition);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo); // vertex buffer object
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);
        gl.vertexAttribPointer(this.aVertexPosition, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesTextureBuffer); // texture buffer
        gl.vertexAttribPointer(this.aTextureCoord, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo); // index buffer
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

        this.renderer.textureArray[this.textureIndex] = this.frameTexture;
    },

    destroy: function ()
    {

        //  TODO!

    }

};

Object.defineProperties(Phaser.Renderer.WebGL.QuadFBO.prototype, {

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
