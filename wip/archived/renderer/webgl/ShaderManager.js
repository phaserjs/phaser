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

    this.currentShader = null;

};

Phaser.Renderer.WebGL.ShaderManager.prototype.constructor = Phaser.Renderer.WebGL.ShaderManager;

Phaser.Renderer.WebGL.ShaderManager.prototype = {

    init: function ()
    {
        this.gl = this.renderer.gl;
    },

    /*
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
    */

    setShader: function (program)
    {
        if (this.currentShader === program)
        {
            return false;
        }
        
        //  Tell the current shader it is being unbound?

        this.currentShader = program;

        this.gl.useProgram(program);

        // this.setAttribs(shader.attributes);

        return true;
    },

    destroy: function ()
    {
        this.renderer = null;
        this.gl = null;

        // this.attribState = [];
        // this.tempAttribState = [];
        // this.stack = [];

        this.currentShader = null;

        // this.primitiveShader.destroy();
        // this.complexPrimitiveShader.destroy();
        // this.defaultShader.destroy();
        // this.fastShader.destroy();
        // this.stripShader.destroy();
    }

};
