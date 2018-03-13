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
 * @class BitmapMask
 * @memberOf Phaser.Display.Masks
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 * @param {[type]} renderable - [description]
 */
var BitmapMask = new Class({
    
    initialize:

    function BitmapMask (scene, renderable)
    {
        var renderer = scene.sys.game.renderer;

        /**
         * [description]
         *
         * @name Phaser.Display.Masks.BitmapMask#bitmapMask
         * @type {[type]}
         * @since 3.0.0
         */
        this.bitmapMask = renderable;

        /**
         * [description]
         *
         * @name Phaser.Display.Masks.BitmapMask#maskRenderTarget
         * @type {[type]}
         * @default null
         * @since 3.0.0
         */
        this.maskRenderTarget = null;

        /**
         * [description]
         *
         * @name Phaser.Display.Masks.BitmapMask#mainRenderTarget
         * @type {[type]}
         * @default null
         * @since 3.0.0
         */
        this.mainRenderTarget = null;

        /**
         * [description]
         *
         * @name Phaser.Display.Masks.BitmapMask#maskTexture
         * @type {[type]}
         * @default null
         * @since 3.0.0
         */
        this.maskTexture = null;

        /**
         * [description]
         *
         * @name Phaser.Display.Masks.BitmapMask#mainTexture
         * @type {[type]}
         * @default null
         * @since 3.0.0
         */
        this.mainTexture = null;

        /**
         * [description]
         *
         * @name Phaser.Display.Masks.BitmapMask#dirty
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.dirty = true;

        /**
         * [description]
         *
         * @name Phaser.Display.Masks.BitmapMask#mainFramebuffer
         * @type {WebGLFramebuffer}
         * @since 3.0.0
         */
        this.mainFramebuffer = null;

        /**
         * [description]
         *
         * @name Phaser.Display.Masks.BitmapMask#maskFramebuffer
         * @type {WebGLFramebuffer}
         * @since 3.0.0
         */
        this.maskFramebuffer = null;

        /**
         * [description]
         *
         * @name Phaser.Display.Masks.BitmapMask#invertAlpha
         * @type {boolean}
         * @since 3.1.2
         */
        this.invertAlpha = false;

        if (renderer && renderer.gl)
        {
            var width = renderer.width;
            var height = renderer.height;
            var pot = ((width & (width - 1)) === 0 && (height & (height - 1)) === 0);
            var gl = renderer.gl;
            var wrap = pot ? gl.REPEAT : gl.CLAMP_TO_EDGE;
            var filter = gl.LINEAR;

            this.mainTexture = renderer.createTexture2D(0, filter, filter, wrap, wrap, gl.RGBA, null, width, height);
            this.maskTexture = renderer.createTexture2D(0, filter, filter, wrap, wrap, gl.RGBA, null, width, height);
            this.mainFramebuffer = renderer.createFramebuffer(width, height, this.mainTexture, false);
            this.maskFramebuffer = renderer.createFramebuffer(width, height, this.maskTexture, false);
            
            renderer.onContextRestored(function (renderer)
            {
                var width = renderer.width;
                var height = renderer.height;
                var pot = ((width & (width - 1)) === 0 && (height & (height - 1)) === 0);
                var gl = renderer.gl;
                var wrap = pot ? gl.REPEAT : gl.CLAMP_TO_EDGE;
                var filter = gl.LINEAR;

                this.mainTexture = renderer.createTexture2D(0, filter, filter, wrap, wrap, gl.RGBA, null, width, height);
                this.maskTexture = renderer.createTexture2D(0, filter, filter, wrap, wrap, gl.RGBA, null, width, height);
                this.mainFramebuffer = renderer.createFramebuffer(width, height, this.mainTexture, false);
                this.maskFramebuffer = renderer.createFramebuffer(width, height, this.maskTexture, false);

            }, this);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Display.Masks.BitmapMask#setBitmap
     * @since 3.0.0
     *
     * @param {[type]} renderable - [description]
     */
    setBitmap: function (renderable)
    {
        this.bitmapMask = renderable;
    },

    /**
     * [description]
     *
     * @method Phaser.Display.Masks.BitmapMask#preRenderWebGL
     * @since 3.0.0
     *
     * @param {[type]} renderer - [description]
     * @param {[type]} maskedObject - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to render to.
     */
    preRenderWebGL: function (renderer, maskedObject, camera)
    {
        renderer.pipelines.BitmapMaskPipeline.beginMask(this, maskedObject, camera);
    },

    /**
     * [description]
     *
     * @method Phaser.Display.Masks.BitmapMask#postRenderWebGL
     * @since 3.0.0
     *
     * @param {[type]} renderer - [description]
     */
    postRenderWebGL: function (renderer)
    {
        renderer.pipelines.BitmapMaskPipeline.endMask(this);
    },

    /**
     * [description]
     *
     * @method Phaser.Display.Masks.BitmapMask#preRenderCanvas
     * @since 3.0.0
     *
     * @param {[type]} renderer - [description]
     * @param {[type]} mask - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to render to.
     */
    preRenderCanvas: function ()
    {
        // NOOP
    },

    /**
     * [description]
     *
     * @method Phaser.Display.Masks.BitmapMask#postRenderCanvas
     * @since 3.0.0
     *
     * @param {[type]} renderer - [description]
     */
    postRenderCanvas: function ()
    {
        // NOOP
    }

});

module.exports = BitmapMask;
