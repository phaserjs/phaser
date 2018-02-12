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
         * @property {[type]} bitmapMask
         * @since 3.0.0
         */
        this.bitmapMask = renderable;

        /**
         * [description]
         *
         * @property {?[type]} maskRenderTarget
         * @default null
         * @since 3.0.0
         */
        this.maskRenderTarget = null;

        /**
         * [description]
         *
         * @property {?[type]} mainRenderTarget
         * @default null
         * @since 3.0.0
         */
        this.mainRenderTarget = null;

        /**
         * [description]
         *
         * @property {?[type]} maskTexture
         * @default null
         * @since 3.0.0
         */
        this.maskTexture = null;

        /**
         * [description]
         *
         * @property {?[type]} mainTexture
         * @default null
         * @since 3.0.0
         */
        this.mainTexture = null;

        /**
         * [description]
         *
         * @property {boolean} dirty
         * @default true
         * @since 3.0.0
         */
        this.dirty = true;

        if (renderer.gl)
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
     * @param {[type]} camera - [description]
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
     * @param {[type]} camera - [description]
     */
    preRenderCanvas: function (renderer, mask, camera)
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
    postRenderCanvas: function (renderer)
    {
        // NOOP
    }

});

module.exports = BitmapMask;
