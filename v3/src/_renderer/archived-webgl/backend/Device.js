var PHASER_ASSERT = function (condition, message)
{
    if (!(condition))
    {
        console.error('Assertion Failed: ', message);
    }
};

// Device works as the WebGL backend. It's the API
// that interacts directly with WebGL calls. It's
// design to reduce the amount state changes and
// redundant gl calls.
var Device = function (gl)
{
    this.gl = gl;
    this.canvas = gl.canvas;
    this.pipelineState = null;
};
Device.prototype.clearPipelineState = function ()
{
    var gl = this.gl;
    var canvas = gl.canvas;
    if (this.pipelineState === null)
    {
        this.pipelineState = null;
        gl.useProgram(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.disable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.STENCIL_TEST);
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
};
Device.prototype.setPipelineState = function (pipelineState)
{
    var vertexInput, inputLayout, elements, elementsCount,
        viewport, blendState, vertexBuffer, indexBuffer,
        depthStencilState, gl;

    PHASER_ASSERT(pipelineState != null, 'Invalid pipeline state.');
    if (this.pipelineState === pipelineState)
    {
        return;
    }

    this.pipelineState = pipelineState;
    gl = this.gl;
    vertexInput = pipelineState.vertexInput;
    inputLayout = vertexInput.inputLayout;
    elements = inputLayout.elements;
    elementsCount = inputLayout.elementsCount;
    viewport = pipelineState.viewport;
    blendState = pipelineState.blendState;
    vertexBuffer = vertexInput.vertexBuffer;
    indexBuffer = vertexInput.indexBuffer;
    depthStencilState = pipelineState.depthStencilState;

    // Bind Shader Pipeline
    gl.useProgram(vertexInput.shaderPipeline.programHandle);

    // Set Viewport
    gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
    gl.depthRange(viewport.zNear, viewport.zFar);

    // Bind buffers
    if (vertexBuffer)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.bufferHandle);
    }

    if (indexBuffer)
    {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.bufferHandle);
    }

    // Bind Elements
    for (var index = 0; index < elementsCount; ++index)
    {
        var element = elements[index];
        var elementLocation = element.location;
        gl.enableVertexAttribArray(elementLocation);
        gl.vertexAttribPointer(
            elementLocation,
            element.size,
            element.format,
            gl.FALSE,
            element.stride,
            element.offset
        );
    }

    // Bind blend state
    if (blendState && blendState.enabled)
    {
        gl.enable(gl.BLEND);
        //gl.logicOp(blendState.logicOperator);
        gl.blendEquationSeparate(blendState.rgbEquation, blendState.alphaEquation);
        gl.blendFuncSeparate(blendState.sourceRgb, blendState.destinationRgb, blendState.sourceAlpha, blendState.destinationAlpha);
    }
    else
    {
        gl.disable(gl.BLEND);
    }

    // Bind depth state
    if (depthStencilState && depthStencilState.depthEnabled)
    {
        gl.enable(gl.DEPTH_TEST);
        gl.depthMask(depthStencilState.depthWriteMask);
        gl.depthFunc(depthStencilState.depthFunction);
    }
    else
    {
        gl.disable(gl.DEPTH_TEST);
    }

    // Bind stencil state
    if (depthStencilState && depthStencilState.stencilEnabled)
    {
        gl.enable(gl.STENCIL_TEST);
        gl.stencilOp(
            depthStencilState.stencilFail,
            depthStencilState.stencilZFail,
            depthStencilState.stencilZPass
        );
        gl.stencilFunc(
            depthStencilState.stencilFunction,
            1, 0xFF
        );
    }
    else
    {
        gl.disable(gl.STENCIL_TEST);
    }
};
Device.prototype.setTexture2D = function (texture2D)
{
    var gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + texture2D.unit);
    gl.bindTexture(gl.TEXTURE_2D, texture2D.textureHandle);
};
Device.prototype.setTextureCube = function (textureCube)
{
    var gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + textureCube.unit);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, textureCube.textureHandle);
};
Device.prototype.updateVertexBuffer = function (offset, hostArrayBuffer)
{
    var gl = this.gl;
    gl.bufferSubData(gl.ARRAY_BUFFER, offset, hostArrayBuffer);
};
Device.prototype.updateIndexBuffer = function (offset, hostArrayBuffer)
{
    var gl = this.gl;
    gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, offset, hostArrayBuffer);
};
Device.prototype.updateConstantBuffer = function ()
{
    var elements = this.pipelineState.constantBuffer.elements;
    var elementsCount = this.pipelineState.constantBuffer.elementsCount;
    for (var index = 0; index < elementsCount; ++index)
    {
        elements[index].update();
    }
};
Device.prototype.drawIndexed = function (indexCount, startIndexLocation)
{
    var gl = this.gl;
    var vertexInput = this.pipelineState.vertexInput;
    gl.drawElements(vertexInput.primitiveTopology, indexCount, vertexInput.indexBuffer.format, startIndexLocation);
};
Device.prototype.draw = function (vertexCount, startVertexLocation)
{
    var gl = this.gl;
    var vertexInput = this.pipelineState.vertexInput;
    gl.drawArrays(vertexInput.primitiveTopology, startVertexLocation, vertexCount);
};
Device.prototype.setClearColor = function (red, green, blue, alpha)
{
    this.gl.clearColor(red, green, blue, alpha);
};
Device.prototype.setClearDepth = function (depth)
{
    this.gl.clearDepth(depth);
};
Device.prototype.setClearStencil = function (stencil)
{

    this.gl.clearStencil(stencil);
};
Device.prototype.clearColorBuffer = function ()
{
    var gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT);
};
Device.prototype.clearDepthStencilBuffer = function ()
{
    var gl = this.gl;
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
};
Device.prototype.clearAllBuffers = function ()
{
    var gl = this.gl;
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
};
