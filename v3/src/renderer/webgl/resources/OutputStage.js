var GL = require('../GL');

var OutputStage = function () 
{
    this.renderTarget = null;
    this.enableDepthTest = false;
    this.enableStencilTest = false;
    this.enableBlending = false;

    /* Blend State */
    this.blendLogicOp = 0;
    this.blendSrcRgb = 0;
    this.blendDstRgb = 0;
    this.blendSrcAlpha = 0;
    this.blendDstAlpha = 0;
    this.blendEqRgb = 0;
    this.blendEqAlpha = 0;
    this.blendRed = 0;
    this.blendGreen = 0;
    this.blendBlue = 0;
    this.blendAlpha = 0;

    /* Depth-Stencil State */
    this.depthFunc = 0;
    this.depthMask = 0;
    this.stencilFunc = 0;
    this.stencilFail = 0;
    this.stencilZFail = 0;
    this.stencilZPass = 0;
};

OutputStage.prototype.constructor = OutputStage;

OutputStage.prototype = {
    
    setRenderTarget: function (renderTarget) 
    {
        this.renderTarget = renderTarget;
        return this;
    },

    setDefaultDepthStencilState: function () 
    {
        this.depthEnabled = false;
        this.stencilEnabled = false;
        this.depthMask = true;
        this.depthFunc = GL.LESS;
        this.stencilFunc = GL.NEVER;
        this.stencilZFail = GL.KEEP;
        this.stencilZPass = GL.KEEP;
        return this;
    },

    setBlendColor: function (r, g, b, a) 
    {
        this.blendRed = r;
        this.blendGreen = g;
        this.blendBlue = b;
        this.blendAlpha = a;
    },

    setBlendFunc: function (src, dst, eq) 
    {
        this.blendSrcRgb = this.blendSrcAlpha = src;
        this.blendDstRgb = this.blendDstAlpha = dst;
        this.blendEqRgb = this.blendEqAlpha = eq;
        return this;
    },

    setBlendFuncSeparate: function (srcRgb, dstRgb, srcAlpha, dstAlpha, eqRgb, eqAlpha) 
    {
        this.blendSrcRgb = srcRgb;
        this.blendSrcAlpha = srcAlpha;
        this.blendDstRgb = dstRgb;
        this.blendDstAlpha = dstAlpha;
        this.blendEqRgb = eqRgb;
        this.blendEqAlpha = eqAlpha;
        return this;
    },

    setDefaultBlending: function () 
    {
        this.setBlendFuncSeparate(
            GL.SRC_ALPHA,
            GL.ONE_MINUS_SRC_ALPHA,
            GL.ONE,
            GL.ONE_MINUS_SRC_ALPHA, 
            GL.FUNC_ADD,
            GL.FUNC_ADD
        );
        return this;
    },

    setNoBlending: function () 
    {
        this.setBlendFunc(GL.ONE, GL.ZERO, GL.FUNC_ADD);
        return this;
    }

};

module.exports = OutputStage;
