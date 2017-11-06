var Class = require('../../utils/Class');

var GeometryMask = new Class({

    initialize:

    function GeometryMask(scene, geometry)
    {
        this.geometry = geometry;
        this.shape = scene.create.graphics();
    },

    setShape: function (geometry)
    {
        this.geometry = geometry;
    },

    preRenderWebGL: function (renderer, mask, camera)
    {
        var gl = renderer.gl;

        gl.enable(gl.STENCIL_TEST);
        gl.clear(gl.STENCIL_BUFFER_BIT);
        gl.colorMask(false, false, false, false);
        gl.stencilFunc(gl.NOTEQUAL, 1, 1);
        gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);


        gl.colorMask(true, true, true, true);
        gl.stencilFunc(gl.EQUAL, 1, 1);
        gl.stencilOp(gl.INVERT, gl.INVERT, gl.INVERT);
    },

    postRenderWebGL: function (renderer)
    {
        var gl = renderer.gl;

        gl.disable(gl.STENCIL_TEST);
    }

});


module.exports = GeometryMask;
