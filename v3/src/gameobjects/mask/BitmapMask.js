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

		if (resourceManager !== undefined)
		{
			var width = renderer.width;
			var height = renderer.height;
        	var pot = ((width & (width - 1)) == 0 && (height & (height - 1)) == 0);
			var gl = renderer.gl;
			var wrap = pot ? gl.REPEAT : gl.CLAMP_TO_EDGE;

			this.maskTexture = resourceManager.createTexture(
                0,
                gl.LINEAR, gl.LINEAR,
                wrap, wrap,
                gl.RGBA,
                null, width, height
            );

			this.mainTexture = resourceManager.createTexture(
                0,
                gl.LINEAR, gl.LINEAR,
                wrap, wrap,
                gl.RGBA,
                null, width, height
            );

			this.maskRenderTarget = resourceManager.createRenderTarget(
				width, height, 
				this.maskTexture, 
				null
			);
			this.mainRenderTarget = resourceManager.createRenderTarget(
				width, height, 
				this.mainTexture, 
				null
			);

            scene.sys.game.renderer.currentTexture[0] = null;
		}

		var _this = this;

        renderer.addContextRestoredCallback(function (renderer) {
            var resourceManager = renderer.resourceManager;
            var gl = renderer.gl;
            var wrap = pot ? gl.REPEAT : gl.CLAMP_TO_EDGE;

            _this.maskTexture = resourceManager.createTexture(
                0,
                gl.LINEAR, gl.LINEAR,
                wrap, wrap,
                gl.RGBA,
                null, width, height
            );
            _this.mainTexture = resourceManager.createTexture(
                0,
                gl.LINEAR, gl.LINEAR,
                wrap, wrap,
                gl.RGBA,
                null, width, height
            );

			_this.maskRenderTarget = resourceManager.createRenderTarget(
				width, height, 
				_this.maskTexture, 
				null
			);
			_this.mainRenderTarget = resourceManager.createRenderTarget(
				width, height, 
				_this.mainTexture, 
				null
			);

            // force rebinding of prev texture
            scene.sys.game.renderer.currentTexture[0] = null; 
        });
	},

	setBitmap: function (renderable)
	{
		this.bitmapMask = renderable;
	},

	preRenderWebGL: function (renderer, gameObject, camera)
	{
		var bitmapMask = this.bitmapMask;
		var maskRenderTarget = this.maskRenderTarget;
		var mainRenderTarget = this.mainRenderTarget;
		
		if (bitmapMask)
		{
			/* Clear render targets first */
			var gl = renderer.gl;

			gl.clearColor(0.0, 0.0, 0.0, 0.0);
			gl.bindFramebuffer(gl.FRAMEBUFFER, maskRenderTarget.framebufferObject);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.bindFramebuffer(gl.FRAMEBUFFER, mainRenderTarget.framebufferObject);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			// Inject mask render target & reset it after rendering.
			bitmapMask.renderTarget = maskRenderTarget;
			bitmapMask.renderWebGL(renderer, bitmapMask, 0.0, camera);
			renderer.currentRenderer.flush(null, maskRenderTarget);
			bitmapMask.renderTarget = null;

			// Inject main render target & reset it at post rendering.
			gameObject.renderTarget = this.mainRenderTarget;
		}

	},

	postRenderWebGL: function (renderer, gameObject)
	{
		var maskRenderer = renderer.maskRenderer;

		// flush and reset
		renderer.currentRenderer.flush(null, this.mainRenderTarget);
		gameObject.renderTarget = null;

		// Apply alpha masking using mask renderer		
		maskRenderer.draw(null, null, this.mainTexture, this.maskTexture);
	}

});

module.exports = BitmapMask;
