var GL = require('../../GL');

var BaseDrawCommand = function () 
{
    this.shaderPipeline = null;
    this.textures = [];
    this.topology = GL.TRIANGLES;
    this.outputStage = null;
};

BaseDrawCommand.prototype.constructor = BaseDrawCommand;

BaseDrawCommand.prototype = {

    setTexture: function (texture, unit) 
    {
        this.textures[unit] = texture;
        return this;
    },

    setTopology: function (topology) 
    {
        this.topology = topology;
        return this;
    },

    setShaderPipeline: function (shaderPipeline) 
    {
        this.shaderPipeline = shaderPipeline;
        return this;
    },

    setOutputStage: function (outputStage) 
    {
        this.outputStage = outputStage;
        return this;
    },

    dispatchBase: function (backend) 
    {
        var textures = this.textures;
        var length = textures.length;
        var gl = backend;
        var outputStage = this.outputStage;

        for (var index = 0; index < length; ++index) {
            var texture = textures[index]
            if (texture !== null && texture !== undefined) {
                gl.activeTexture(GL.TEXTURE0 + index);
                gl.bindTexture(GL.TEXTURE_2D, texture.texture);
            } else {
                gl.activeTexture(GL.TEXTURE0 + index);
                gl.bindTexture(GL.TEXTURE_2D, null);
            }
        }

        if (outputStage.enableBlending)
        {
            gl.enable(GL.BLEND);
            gl.blendFuncSeparate(outputStage.blendSrcRGB, outputStage.blendDstRGB, outputStage.blendSrcAlpha, outputStage.blendDstAlpha);
            gl.blendEquationSeparate(outputStage.blendEqRgb, outputStage.blendEqAlpha);
            gl.blendColor(outputStage.blendRed, outputStage.blendGreen, outputStage.blendBlue, outputStage.blendAlpha)
        } 
        else 
        {
            gl.disable(GL.BLEND);
        }

        if (outputStage.enableDepthTest) 
        {
            gl.enable(GL.DEPTH_TEST);
            gl.depthFunc(outputStage.depthFunc);
            gl.depthMask(outputStage.depthMask);
        } 
        else 
        {
            gl.disable(GL.DEPTH_TEST);
        }

        if (outputStage.enableStencilTest) 
        {
            gl.enable(GL.STENCIL_TEST);
            gl.stencilFunc(outputStage.stencilFunc, 0, 1);
            gl.stencilOp(outputStage.stencilFail, outputStage.stencilZFail, outputStage.stencilZPass);
        } 
        else 
        {
            gl.disable(GL.STENCIL_TEST);
        }
    }

};

module.exports = BaseDrawCommand;
