var RenderTarget = function (framebufferObject, width, height, colorBuffer, depthStencilBuffer)
{
    this.framebufferObject = framebufferObject;
    this.width = width;
    this.height = height;
    this.colorBuffer = colorBuffer;
    this.depthStencilBuffer = depthStencilBuffer;
};

module.exports = RenderTarget;
