/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Mat Groves (@Doormat23)
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* New version of PIXI.FilterTexture
*
* @class Phaser.Renderer.Canvas
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
* @param width {Number} the horizontal range of the filter
* @param height {Number} the vertical range of the filter
* @param scaleMode {Number} See {{#crossLink "PIXI/scaleModes:property"}}Phaser.scaleModes{{/crossLink}} for possible values
*/
Phaser.Renderer.WebGL.FilterTexture = function (renderer, width, height, scaleMode, textureUnit)
{
    if (textureUnit === undefined) { textureUnit = 0; }

    this.renderer = renderer;

    //  WebGLContext
    this.gl = renderer.gl;

    /**
     * @property frameBuffer
     * @type Any
     */
    this.frameBuffer = this.renderer.createFramebuffer(width, height, scaleMode || Phaser.scaleModes.DEFAULT, textureUnit);

    /**
     * @property texture
     * @type Any
     */
    this.texture = this.frameBuffer.targetTexture;

    this.width = width;

    this.height = height;

    this.renderBuffer = this.frameBuffer.renderBuffer;

};

Phaser.Renderer.WebGL.FilterTexture.prototype.constructor = Phaser.Renderer.WebGL.FilterTexture;

Phaser.Renderer.WebGL.FilterTexture.prototype = {

    clear: function ()
    {
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    },

    /**
     * Resizes the texture to the specified width and height
     *
     * @method resize
     * @param width {Number} the new width of the texture
     * @param height {Number} the new height of the texture
     */
    resize: function (width, height)
    {
        if (this.width === width && this.height === height)
        {
            return;
        }

        this.width = width;
        this.height = height;

        var gl = this.gl;

        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);

        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
    },

    /**
    * Destroys the filter texture.
    * 
    * @method destroy
    */
    destroy: function ()
    {
        var gl = this.gl;

        gl.deleteFramebuffer(this.frameBuffer);
        gl.deleteTexture(this.texture);

        this.frameBuffer = null;
        this.texture = null;

        this.gl = null;
        this.renderer = null;
    }

};
