/* This is a WebGL ONLY component */
var RenderPass = {
    outputStage: {
        renderTarget: null,
        enableDepthTest: false,
        enableStencilTest: false,
        enableBlending: false,

        /* Blend State */
        blendLogicOp: 0,
        blendSrcRgb: 0,
        blendDstRgb: 0,
        blendSrcAlpha: 0,
        blendDstAlpha: 0,
        blendEqRgb: 0,
        blendEqAlpha: 0,
        blendRed: 0,
        blendGreen: 0,
        blendBlue: 0,
        blendAlpha: 0,

        /* Depth-Stencil State */
        depthFunc: 0,
        depthMask: 0,
        stencilFunc: 0,
        stencilFail: 0,
        stencilZFail: 0,
        stencilZPass: 0
    },

    renderPass: {
        shaderPipeline: null,
        textures: [],
        topology: 0
    },

    /* Needed for getting constant values
     * Form the WebGL context.
     */
    glContext: null,
    
    /* Utility functions */
    initRenderComponent: function () 
    {
        var renderingContext = this.state.game.renderer.gl;

        if ((renderingContext instanceof WebGLRenderingContext) || (renderingContext !== null && renderingContext.rawgl !== undefined))
        {
            this.glContext = renderingContext;
        }
    },

    setRenderTarget: function (renderTarget) 
    {
        this.outputStage.renderTarget = renderTarget;
        return this;
    },

    setDefaultDepthStencilState: function () 
    {
        var gl = this.renderingContext;
        var outputStage = this.outputStage;

        outputStage.depthEnabled = false;
        outputStage.stencilEnabled = false;
        outputStage.depthMask = true;
        outputStage.depthFunc = gl.LESS;
        outputStage.stencilFunc = gl.NEVER;
        outputStage.stencilZFail = gl.KEEP;
        outputStage.stencilZPass = gl.KEEP;
        
        return this;
    },

    setBlendColor: function (r, g, b, a) 
    {
        var outputStage = this.outputStage;

        outputStage.blendRed = r;
        outputStage.blendGreen = g;
        outputStage.blendBlue = b;
        outputStage.blendAlpha = a;

        return this;
    },

    setBlendFunc: function (src, dst, eq) 
    {
        var outputStage = this.outputStage;
        
        outputStage.blendSrcRgb = outputStage.blendSrcAlpha = src;
        outputStage.blendDstRgb = outputStage.blendDstAlpha = dst;
        outputStage.blendEqRgb = outputStage.blendEqAlpha = eq;
        
        return this;
    },

    setBlendFuncSeparate: function (srcRgb, srcAlpha, dstRgb, dstAlpha, eqRgb, eqAlpha) 
    {
        var outputStage = this.outputStage;
        
        outputStage.blendSrcRgb = srcRgb;
        outputStage.blendSrcAlpha = srcAlpha;
        outputStage.blendDstRgb = dstRgb;
        outputStage.blendDstAlpha = dstAlpha;
        outputStage.blendEqRgb = eqRgb;
        outputStage.blendEqAlpha = eqAlpha;
        
        return this;
    },

    setDefaultBlending: function () {
        var gl = this.glContext;

        this.setBlendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ADD);
        
        return this;
    },

    setNoBlending: function () {
        var gl = this.glContext;

        this.setBlendFunc(gl.ONE, gl.ZERO, gl.ADD);
        
        return this;
    },

    setTexture: function (texture, textureUnit) {
        this.renderPass.textures[textureUnit] = texture;
        return this;
    },

    setTopology: function (topology) {
        this.renderPass.topology = topology;
        return this;
    },

    setShaderPipeline: function (shaderPipeline) {
        this.renderPass.shaderPipeline = shaderPipeline;
        return this;
    },

    /* Call this on render pass */
    dispatchRenderPassState: function () {
        var gl = this.glContext;
        var textures = this.textures;
        var length = textures.length;
        var outputStage = this.outputStage;

        for (var index = 0; index < length; ++index) {
            if (textures[index] !== null) {
                gl.activeTexture(gl.TEXTURE0 + index);
                gl.bindTexture(gl.TEXTURE_2D, textures[index].texture);
            } else {
                gl.activeTexture(gl.TEXTURE0 + index);
                gl.bindTexture(gl.TEXTURE_2D, null);
            }
        }

        if (outputStage.enableBlending) {
            gl.enable(gl.BLEND);
            gl.blendFuncSeparate(outputStage.blendSrcRGB, outputStage.blendDstRGB, outputStage.blendSrcAlpha, outputStage.blendDstAlpha);
            gl.blendEquationSeparate(outputStage.blendEqRgb, outputStage.blendEqAlpha);
            gl.blendColor(outputStage.blendRed, outputStage.blendGreen, outputStage.blendBlue, outputStage.blendAlpha)
        } else {
            gl.disable(gl.BLEND);
        }

        if (outputStage.enableDepthTest) {
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(outputStage.depthFunc);
            gl.depthMask(outputStage.depthMask);
        } else {
            gl.disable(gl.DEPTH_TEST);
        }

        if (outputStage.enableStencilTest) {
            gl.enable(gl.STENCIL_TEST);
            gl.stencilFunc(this.stencilFunc, 0, 1);
            gl.stencilOp(this.stencilFail, this.stencilZFail, this.stencilZPass);
        } else {
            gl.disable(gl.STENCIL_TEST);
        }
    }
};

module.exports = Render;
