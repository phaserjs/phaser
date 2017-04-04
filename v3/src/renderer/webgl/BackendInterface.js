// Backends Interface should map to GL calls
// It should be 1 == 1 to Canvas Backend Interface
var BackendInterface = function (backend) 
{
    this.backend = backend;
};

BackendInterface.prototype.constructor = BackendInterface;

BackendInterface.prototype = {

    clearScreen: function (r, g, b, a) 
    {
        var gl = this.backend;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.clearColor(r, g, b, a);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DETH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    }

};

module.exports = BackendInterface;
