var StencilBufferRenderer = {
    
    preRender: function (renderer, mask, camera)
    {
        var gl = renderer.gl;

        gl.enable(gl.STENCIL_TEST);
        gl.clear(gl.STENCIL_BUFFER_BIT);
        gl.colorMask(false, false, false, false);
        gl.stencilFunc(gl.NOTEQUAL, 1, 1);
        gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);

        /* Render Mask Geometry */

        gl.colorMask(true, true, true, true);
        gl.stencilFunc(gl.EQUAL, 1, 1);
        gl.stencilOp(gl.INVERT, gl.INVERT, gl.INVERT);
    },

    postRender: function (renderer)
    {
        renderer.gl.disable(gl.STENCIL_TEST);
    }
};

module.exports = StencilBufferRenderer;
