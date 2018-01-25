var Class = require('../../utils/Class');

var BitmapMask = new Class({
    
    initialize: 

    function BitmapMask(scene, renderable)
    {
        var renderer = scene.sys.game.renderer;
        var resourceManager = renderer.resourceManager;
        this.bitmapMask = renderable;
        this.maskRenderTarget = null;
        this.mainRenderTarget = null;
        this.maskTexture = null;
        this.mainTexture = null;
        this.dirty = true;

        if (renderer.gl)
        {
            var width = renderer.width;
            var height = renderer.height;
            var pot = ((width & (width - 1)) == 0 && (height & (height - 1)) == 0);
            var gl = renderer.gl;
            var wrap = pot ? gl.REPEAT : gl.CLAMP_TO_EDGE;
            var filter = gl.LINEAR;

            this.mainTexture = renderer.createTexture2D(0, filter, filter, wrap, wrap, gl.RGBA, null, width, height);
            this.maskTexture = renderer.createTexture2D(0, filter, filter, wrap, wrap, gl.RGBA, null, width, height);
            this.mainFramebuffer = renderer.createFramebuffer(width, height, this.mainTexture, false);
            this.maskFramebuffer = renderer.createFramebuffer(width, height, this.maskTexture, false);
            
            renderer.onContextRestored(function (renderer) {
                var width = renderer.width;
                var height = renderer.height;
                var pot = ((width & (width - 1)) == 0 && (height & (height - 1)) == 0);
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

    setBitmap: function (renderable)
    {
        this.bitmapMask = renderable;
    },

    preRenderWebGL: function (renderer, maskedObject, camera)
    {
        renderer.pipelines.BitmapMaskPipeline.beginMask(this, maskedObject, camera);
    },

    postRenderWebGL: function (renderer)
    {
        renderer.pipelines.BitmapMaskPipeline.endMask(this);
    },

    preRenderCanvas: function (renderer, mask, camera)
    {
        // NOOP
    },

    postRenderCanvas: function (renderer)
    {
        // NOOP
    }

});

module.exports = BitmapMask;
