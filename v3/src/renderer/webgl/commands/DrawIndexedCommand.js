var GL = require('../../GL');
var BaseDrawCommand = require('./BaseDrawCommand');

var DrawIndexedCommand = function ()
{
    BaseDrawCommand.call(this);
    this.indexCount = 0;
    this.vertexBuffer = null;
    this.indexBuffer = null;
};

DrawIndexedCommand.prototype.constructor = DrawIndexedCommand;

DrawIndexedCommand.prototype = Object.create(BaseDrawCommand.prototype, {

    setVertexBuffer: function (vertexBuffer) 
    {
        this.vertexBuffer = vertexBuffer;

        return this;
    },

    setIndexBuffer: function (indexBuffer) 
    {
        this.indexBuffer = indexBuffer;

        return this;
    },

    setIndexCount: function (indexCount)
    {
        this.indexCount = indexCount;

        return this;
    }

    setVertexCount: function (first, vertexCount)
    {
        this.first = first;
        this.vertexCount = vertexCount;
    
        return this;
    },

    dispatch: function (backend)
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

        gl.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer.bufferObject);
        gl.drawElements(this.topology, this.indexCount, GL.UNSIGNED_SHORT, 0);
    }

});

module.exports = DrawIndexedCommand;
