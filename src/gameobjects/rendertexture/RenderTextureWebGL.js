var RenderTextureWebGL = {

    fill: function (rgb)
    {
        var ur = ((rgb >> 16)|0) & 0xff;
        var ug = ((rgb >> 8)|0) & 0xff;
        var ub = (rgb|0) & 0xff;

        this.renderer.setFramebuffer(this.framebuffer);
        var gl = this.gl;
        gl.clearColor(ur / 255.0, ug / 255.0, ub / 255.0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.renderer.setFramebuffer(null);
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

    draw: function (texture, frame, x, y)
    {
        var glTexture = texture.source[frame.sourceIndex].glTexture;
        var tint = (this.globalTint >> 16) + (this.globalTint & 0xff00) + ((this.globalTint & 0xff) << 16);
        this.renderer.setFramebuffer(this.framebuffer);
        this.renderer.pipelines.TextureTintPipeline.drawTexture(glTexture, x, y, tint, this.globalAlpha, frame.cutX, frame.cutY, frame.cutWidth, frame.cutHeight, this.currentMatrix);
        this.renderer.setFramebuffer(null);
        return this;
    }

};

module.exports = RenderTextureWebGL;
