var RenderTextureWebGL = {

    /**
     * Fills the Render Texture with the given color.
     *
     * @method Phaser.GameObjects.RenderTexture#fill
     * @since 3.2.0
     *
     * @param {number} rgb - The color to fill the Render Texture with.
     *
     * @return {Phaser.GameObjects.RenderTexture} This Game Object.
     */
    fill: function (rgb, alpha)
    {
        if (alpha === undefined) { alpha = 1; }

        var ur = ((rgb >> 16)|0) & 0xff;
        var ug = ((rgb >> 8)|0) & 0xff;
        var ub = (rgb|0) & 0xff;

        this.renderer.setFramebuffer(this.framebuffer);

        var gl = this.gl;

        gl.clearColor(ur / 255.0, ug / 255.0, ub / 255.0, alpha);

        gl.clear(gl.COLOR_BUFFER_BIT);

        this.renderer.setFramebuffer(null);

        return this;
    },

    /**
     * Clears the Render Texture.
     *
     * @method Phaser.GameObjects.RenderTexture#clear
     * @since 3.2.0
     *
     * @return {Phaser.GameObjects.RenderTexture} This Game Object.
     */
    clear: function ()
    {
        this.renderer.setFramebuffer(this.framebuffer);

        var gl = this.gl;

        gl.clearColor(0, 0, 0, 0);

        gl.clear(gl.COLOR_BUFFER_BIT);

        this.renderer.setFramebuffer(null);

        return this;
    },

    /**
     * Draws the Texture Frame to the Render Texture at the given position.
     *
     * @method Phaser.GameObjects.RenderTexture#draw
     * @since 3.2.0
     *
     * @param {Phaser.Textures.Texture} texture - Currently unused.
     * @param {Phaser.Textures.Frame} frame - The Texture Frame that will be drawn to the Render Texture. Get this from the Texture Manager via `this.textures.getFrame(key)`.
     * @param {number} x - The x position to draw the frame at.
     * @param {number} y - The y position to draw the frame at.
     *
     * @return {Phaser.GameObjects.RenderTexture} This Game Object.
     */
    draw: function (texture, frame, x, y, tint)
    {
        if (tint === undefined)
        {
            tint = (this.globalTint >> 16) + (this.globalTint & 0xff00) + ((this.globalTint & 0xff) << 16);
        }
        else
        {
            tint = (tint >> 16) + (tint & 0xff00) + ((tint & 0xff) << 16);
        }

        this.renderer.setFramebuffer(this.framebuffer);

        var pipeline = this.pipeline;

        pipeline.projOrtho(0, pipeline.width, 0, pipeline.height, -1000.0, 1000.0);

        pipeline.drawTextureFrame(frame, x, y, tint, this.globalAlpha, this.currentMatrix, null);

        this.renderer.setFramebuffer(null);

        pipeline.projOrtho(0, pipeline.width, pipeline.height, 0, -1000.0, 1000.0);

        return this;
    }

};

module.exports = RenderTextureWebGL;
