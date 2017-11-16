var Class = require('../../utils/Class');

var GeometryMask = new Class({

    initialize:

    function GeometryMask(scene, graphicsGeometry)
    {
        this.geometryMask = graphicsGeometry;
    },

    setShape: function (graphicsGeometry)
    {
        this.geometryMask = graphicsGeometry;
    },

    preRenderWebGL: function (renderer, mask, camera)
    {
        var gl = renderer.gl;
        var geometryMask = this.geometryMask;

        // Force flushing before drawing to stencil buffer
        renderer.currentRenderer.flush();

        // Enable and setup GL state to write to stencil buffer
        gl.enable(gl.STENCIL_TEST);
        gl.clear(gl.STENCIL_BUFFER_BIT);
        gl.colorMask(false, false, false, false);
        gl.stencilFunc(gl.NOTEQUAL, 1, 1);
        gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);

        // Write stencil buffer
        geometryMask.renderWebGL(renderer, geometryMask, 0.0, camera);
        renderer.currentRenderer.flush();

        // Use stencil buffer to affect next rendering object
        gl.colorMask(true, true, true, true);
        gl.stencilFunc(gl.EQUAL, 1, 1);
        gl.stencilOp(gl.INVERT, gl.INVERT, gl.INVERT);
    },

    postRenderWebGL: function (renderer)
    {
        var gl = renderer.gl;

        // Force flush before disabling stencil test
        renderer.currentRenderer.flush();
        gl.disable(gl.STENCIL_TEST);
    }

});


module.exports = GeometryMask;
