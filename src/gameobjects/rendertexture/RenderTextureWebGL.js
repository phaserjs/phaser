var RenderTextureWebGL = {

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

    clear: function ()
    {
        this.renderer.setFramebuffer(this.framebuffer);
        var gl = this.gl;
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.renderer.setFramebuffer(null);
        return this;
    },

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
