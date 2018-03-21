var GL = require('../GL');
var BaseDrawCommand = require('./BaseDrawCommand');

var DrawCommand = function ()
{
    BaseDrawCommand.call(this);
    this.first = 0;
    this.vertexCount = 0;
    this.vertexBuffer = null;
};

DrawCommand.prototype = Object.create(BaseDrawCommand.prototype, {

    setVertexBuffer: 
    {
        value: function (vertexBuffer) 
        {
                this.vertexBuffer = vertexBuffer;
    
            return this;
        }
    },

    setVertexCount: 
    {
        value: function (first, vertexCount)
        {
            this.first = first;
            this.vertexCount = vertexCount;
        
            return this;
        }
    },

    dispatch:
    {
        value: function (backend)
        {
            var gl = backend;
            var renderTarget = this.outputStage.renderTarget
            var vertexBuffer = this.vertexBuffer;
            var inputElements = vertexBuffer.inputElements;
            var inputLength = inputElements.length;

            gl.useProgram(this.shaderPipeline.program);
            if (renderTarget !== null)
            {
                gl.bindFramebuffer(GL.FRAMEBUFFER, renderTarget.framebufferObject);
            }
            else
            {
                gl.bindFramebuffer(GL.FRAMEBUFFER, null);
            }
            this.dispatchBase(backend);

            gl.bindBuffer(GL.ARRAY_BUFFER, vertexBuffer.bufferObject);

            for (var index = 0; index < inputLength; ++index)
            {
                var element = inputElements[index];
                if (element !== undefined && element !== null) 
                {
                    gl.enableVertexAttribArray(element.index);
                    gl.vertexAttribPointer(
                        element.index, 
                        element.size, 
                        element.type, 
                        element.normalized, 
                        element.stride, 
                        element.offset
                    );
                }
            }

            gl.drawArrays(this.topology, this.first, this.vertexCount);
        }
    }

});

DrawCommand.prototype.constructor = DrawCommand;

module.exports = DrawCommand;
