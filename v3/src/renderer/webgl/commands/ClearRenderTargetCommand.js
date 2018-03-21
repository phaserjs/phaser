var GL = require('../GL');

var ClearRenderTargetCommand = function ()
{
    this.clearR = 0.0;
    this.clearG = 0.0;
    this.clearB = 0.0;
    this.clearA = 1.0;
    this.clearDepth = 1.0;
    this.clearStencil = 0;

    this.renderTarget = null;
};

ClearRenderTargetCommand.prototype.constructor = ClearRenderTargetCommand;

ClearRenderTargetCommand.prototype = {

    setClearColor: function (r, g, b, a) 
    {
        this.clearR = r;
        this.clearG = g;
        this.clearB = b;
        this.clearA = a;

        return this;
    },

    setClearDepth: function (depth) 
    {
        this.clearDepth = depth;

        return this;
    },

    setClearStencil: function (stencil) 
    {
        this.clearStencil = stencil;

        return this;
    },

    setRenderTarget: function (renderTarget) 
    {
        this.renderTarget = renderTarget;

        return this;
    },

    dispatch: function (backend) 
    {
        var renderTarget = this.renderTarget;
        var gl = backend;

        if (renderTarget !== null) 
        {
            gl.bindFramebuffer(GL.FRAMEBUFFER, renderTarget.framebufferObject);
        }
        else
        {
            gl.bindFramebuffer(GL.FRAMEBUFFER, null);
        }

        gl.clearColor(this.clearR, this.clearG, this.clearB, this.clearA);
        gl.clearDepth(this.clearDepth);
        gl.clearStencil(this.clearStencil);

        gl.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT | GL.STENCIL_BUFFER_BIT);
    }

};

module.exports = ClearRenderTargetCommand;
