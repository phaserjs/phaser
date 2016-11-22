/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

function _CreateEmptyTexture(gl, width, height, scaleMode) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    return texture;
}

var _fbErrors = {
    36054: 'Incomplete attachment',
    36055: 'Missing attachment',
    36057: 'Incomplete dimensions',
    36061: 'Framebuffer unsupported'
};

function _CreateFramebuffer(gl, width, height, scaleMode, textureUnit) {
    var framebuffer = gl.createFramebuffer();
    var depthStencilBuffer = gl.createRenderbuffer();
    var colorBuffer = null;   
    var fbStatus = 0;
    
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthStencilBuffer);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.renderBuffer);
    colorBuffer = _CreateEmptyTexture(gl, width, height, scaleMode);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorBuffer, 0);        
    fbStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if(fbStatus !== gl.FRAMEBUFFER_COMPLETE) {
        console.error('Incomplete GL framebuffer. ', _fbErrors[fbStatus]);
    }
    framebuffer.width = width;
    framebuffer.height = height;
    framebuffer.targetTexture = colorBuffer;
    framebuffer.renderBuffer = depthStencilBuffer;
    return framebuffer;
}

/**
* @class FilterTexture
* @constructor
* @param gl {WebGLContext} the current WebGL drawing context
* @param width {Number} the horizontal range of the filter
* @param height {Number} the vertical range of the filter
* @param scaleMode {Number} See {{#crossLink "PIXI/scaleModes:property"}}PIXI.scaleModes{{/crossLink}} for possible values
*/
PIXI.FilterTexture = function(gl, width, height, scaleMode, textureUnit)
{
    textureUnit = typeof textureUnit === 'number' ? textureUnit : 0;
    /**
     * @property gl
     * @type WebGLContext
     */
    this.gl = gl;
    // next time to create a frame buffer and texture

    /**
     * @property frameBuffer
     * @type Any
     */
     this.frameBuffer = _CreateFramebuffer(gl, width, height, scaleMode || PIXI.scaleModes.DEFAULT, textureUnit);
    /**
     * @property texture
     * @type Any
     */
     this.texture = this.frameBuffer.targetTexture;
     this.width = width;
     this.height = height;
     this.renderBuffer = this.frameBuffer.renderBuffer;
};

PIXI.FilterTexture.prototype.constructor = PIXI.FilterTexture;

/**
* Clears the filter texture.
* 
* @method clear
*/
PIXI.FilterTexture.prototype.clear = function()
{
    var gl = this.gl;
    
    gl.clearColor(0,0,0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
};

/**
 * Resizes the texture to the specified width and height
 *
 * @method resize
 * @param width {Number} the new width of the texture
 * @param height {Number} the new height of the texture
 */
PIXI.FilterTexture.prototype.resize = function(width, height)
{
    if(this.width === width && this.height === height) return;

    this.width = width;
    this.height = height;

    var gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D,  this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,  width , height , 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    // update the stencil buffer width and height
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width , height );
};

/**
* Destroys the filter texture.
* 
* @method destroy
*/
PIXI.FilterTexture.prototype.destroy = function()
{
    var gl = this.gl;
    gl.deleteFramebuffer( this.frameBuffer );
    gl.deleteTexture( this.texture );

    this.frameBuffer = null;
    this.texture = null;
};
