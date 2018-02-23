var RenderTextureWebGL = {

    fill: function (color)
    {
        return this;
    },

    clear: function ()
    {
        this.renderer.setFramebuffer(this.framebuffer);
        var gl = this.gl;
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.renderer.setFramebuffer(null);
        return this;
    },

    draw: function (texture, x, y)
    {
        this.renderer.setFramebuffer(this.framebuffer);
        this.renderer.pipelines.TextureTintPipeline.drawTexture(texture, x, y, 0, 0, texture.width, texture.height, this.currentMatrix);
        this.renderer.setFramebuffer(null);
        return this;
    },

    drawFrame: function (texture, x, y, frame)
    {
        this.renderer.setFramebuffer(this.framebuffer);
        this.renderer.pipelines.TextureTintPipeline.drawTexture(texture, frame.x, frame.y, frame.width, frame.height, texture.width, texture.height, this.currentMatrix);
        this.renderer.setFramebuffer(null);
        return this;
    }

};

module.exports = RenderTextureWebGL;
