/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');

/**
 * @classdesc
 * [description]
 *
 * @class GeometryMask
 * @memberOf Phaser.Display.Masks
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 * @param {Phaser.GameObjects.Graphics} graphicsGeometry - [description]
 */
var GeometryMask = new Class({

    initialize:

    function GeometryMask (scene, graphicsGeometry)
    {
        /**
         * [description]
         *
         * @name Phaser.Display.Masks.GeometryMask#geometryMask
         * @type {Phaser.GameObjects.Graphics}
         * @since 3.0.0
         */
        this.geometryMask = graphicsGeometry;
    },

    /**
     * [description]
     *
     * @method Phaser.Display.Masks.GeometryMask#setShape
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Graphics} graphicsGeometry - [description]
     */
    setShape: function (graphicsGeometry)
    {
        this.geometryMask = graphicsGeometry;
    },

    /**
     * [description]
     *
     * @method Phaser.Display.Masks.GeometryMask#preRenderWebGL
     * @since 3.0.0
     *
     * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - [description]
     * @param {Phaser.GameObjects.GameObject} mask - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    preRenderWebGL: function (renderer, mask, camera)
    {
        var gl = renderer.gl;
        var geometryMask = this.geometryMask;

        // Force flushing before drawing to stencil buffer
        renderer.flush();

        // Enable and setup GL state to write to stencil buffer
        gl.enable(gl.STENCIL_TEST);
        gl.clear(gl.STENCIL_BUFFER_BIT);
        gl.colorMask(false, false, false, false);
        gl.stencilFunc(gl.NOTEQUAL, 1, 1);
        gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);

        // Write stencil buffer
        geometryMask.renderWebGL(renderer, geometryMask, 0.0, camera);
        renderer.flush();

        // Use stencil buffer to affect next rendering object
        gl.colorMask(true, true, true, true);
        gl.stencilFunc(gl.EQUAL, 1, 1);
        gl.stencilOp(gl.INVERT, gl.INVERT, gl.INVERT);
    },

    /**
     * [description]
     *
     * @method Phaser.Display.Masks.GeometryMask#postRenderWebGL
     * @since 3.0.0
     *
     * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - [description]
     */
    postRenderWebGL: function (renderer)
    {
        var gl = renderer.gl;

        // Force flush before disabling stencil test
        renderer.flush();
        gl.disable(gl.STENCIL_TEST);
    },

    /**
     * [description]
     *
     * @method Phaser.Display.Masks.GeometryMask#preRenderCanvas
     * @since 3.0.0
     *
     * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - [description]
     * @param {Phaser.GameObjects.GameObject} mask - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    preRenderCanvas: function (renderer, mask, camera)
    {
        var geometryMask = this.geometryMask;

        renderer.currentContext.save();

        geometryMask.renderCanvas(renderer, geometryMask, 0.0, camera, null, true);

        renderer.currentContext.clip();
    },

    /**
     * [description]
     *
     * @method Phaser.Display.Masks.GeometryMask#postRenderCanvas
     * @since 3.0.0
     *
     * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - [description]
     */
    postRenderCanvas: function (renderer)
    {
        renderer.currentContext.restore();
    }

});

module.exports = GeometryMask;
