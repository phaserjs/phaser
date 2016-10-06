/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Mat Groves (@Doormat23)
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* New version of PIXI.WebGLShaderManager
*
* @class Phaser.Renderer.Canvas
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
*/
Phaser.Renderer.WebGL.ShaderManager = function (renderer)
{
    this.renderer = renderer;

    this.gl = null;

    this.maxAttribs = 10;

    this.attribState = [];

    this.tempAttribState = [];

    this.stack = [];

    this._currentId = -1;
    this.currentShader = null;

    this.primitiveShader = null;
    this.complexPrimitiveShader = null;
    this.defaultShader = null;
    this.fastShader = null;
    this.stripShader = null;

    for (var i = 0; i < this.maxAttribs; i++)
    {
        this.attribState[i] = false;
    }

};

Phaser.Renderer.WebGL.ShaderManager.prototype.constructor = Phaser.Renderer.WebGL.ShaderManager;

Phaser.Renderer.WebGL.ShaderManager.prototype = {

    init: function ()
    {
        this.gl = this.renderer.gl;

        // this shader is used for the default sprite rendering
        this.defaultShader = new Phaser.Renderer.WebGL.Shaders.Sprite(this.renderer);

        // this shader is used for the fast sprite rendering
        this.fastShader = new Phaser.Renderer.WebGL.Shaders.SpriteBatch(this.renderer);

        // the next one is used for rendering triangle strips
        this.stripShader = new Phaser.Renderer.WebGL.Shaders.Strip(this.renderer);

        // the next one is used for rendering primitives
        this.primitiveShader = new Phaser.Renderer.WebGL.Shaders.PrimitiveGraphics(this.renderer);

        // the next one is used by the stencil buffer manager when Graphics.mode = 1
        this.complexPrimitiveShader = new Phaser.Renderer.WebGL.Shaders.ComplexPrimitiveGraphics(this);

        this.setShader(this.defaultShader);
    },

    setAttribs: function (attribs)
    {
        // reset temp state
        var i;

        for (i = 0; i < this.tempAttribState.length; i++)
        {
            this.tempAttribState[i] = false;
        }

        // set the new attribs
        for (i = 0; i < attribs.length; i++)
        {
            var attribId = attribs[i];
            this.tempAttribState[attribId] = true;
        }

        for (i = 0; i < this.attribState.length; i++)
        {
            if (this.attribState[i] !== this.tempAttribState[i])
            {
                this.attribState[i] = this.tempAttribState[i];

                if (this.tempAttribState[i])
                {
                    this.gl.enableVertexAttribArray(i);
                }
                else
                {
                    this.gl.disableVertexAttribArray(i);
                }
            }
        }
    },

    setShader: function (shader)
    {
        if (this._currentId === shader._UID)
        {
            return false;
        }
        
        this._currentId = shader._UID;

        this.currentShader = shader;

        this.gl.useProgram(shader.program);

        this.setAttribs(shader.attributes);

        return true;
    },

    destroy: function ()
    {
        this.renderer = null;
        this.gl = null;

        this.attribState = [];
        this.tempAttribState = [];
        this.stack = [];

        this.currentShader = null;

        this.primitiveShader.destroy();
        this.complexPrimitiveShader.destroy();
        this.defaultShader.destroy();
        this.fastShader.destroy();
        this.stripShader.destroy();
    }

};
