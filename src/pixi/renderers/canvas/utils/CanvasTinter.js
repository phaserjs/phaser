/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * Utility methods for Sprite/Texture tinting.
 *
 * @class CanvasTinter
 * @static
 */
PIXI.CanvasTinter = function() {};

/**
 * Basically this method just needs a sprite and a color and tints the sprite with the given color.
 * 
 * @method getTintedTexture 
 * @static
 * @param sprite {Sprite} the sprite to tint
 * @param color {Number} the color to use to tint the sprite with
 * @return {HTMLCanvasElement} The tinted canvas
 */
PIXI.CanvasTinter.getTintedTexture = function(sprite, color)
{
    var canvas = sprite.tintedTexture || Phaser.CanvasPool.create(this);
    
    PIXI.CanvasTinter.tintMethod(sprite.texture, color, canvas);

    return canvas;
};

/**
 * Tint a texture using the "multiply" operation.
 * 
 * @method tintWithMultiply
 * @static
 * @param texture {Texture} the texture to tint
 * @param color {Number} the color to use to tint the sprite with
 * @param canvas {HTMLCanvasElement} the current canvas
 */
PIXI.CanvasTinter.tintWithMultiply = function(texture, color, canvas)
{
    var context = canvas.getContext("2d");

    var crop = texture.crop;
    var w = crop.width;
    var h = crop.height;

    if (texture.rotated)
    {
        w = h;
        h = crop.width;
    }

    if (canvas.width !== w || canvas.height !== h)
    {
        canvas.width = w;
        canvas.height = h;
    }

    context.clearRect(0, 0, w, h);

    context.fillStyle = "#" + ("00000" + (color | 0).toString(16)).substr(-6);
    context.fillRect(0, 0, w, h);

    context.globalCompositeOperation = "multiply";
    context.drawImage(texture.baseTexture.source, crop.x, crop.y, w, h, 0, 0, w, h);

    context.globalCompositeOperation = "destination-atop";
    context.drawImage(texture.baseTexture.source, crop.x, crop.y, w, h, 0, 0, w, h);

};

/**
 * Tint a texture pixel per pixel.
 * 
 * @method tintPerPixel
 * @static
 * @param texture {Texture} the texture to tint
 * @param color {Number} the color to use to tint the sprite with
 * @param canvas {HTMLCanvasElement} the current canvas
 */ 
PIXI.CanvasTinter.tintWithPerPixel = function(texture, color, canvas)
{
    var context = canvas.getContext("2d");

    var crop = texture.crop;
    var w = crop.width;
    var h = crop.height;

    if (texture.rotated)
    {
        w = h;
        h = crop.width;
    }

    if (canvas.width !== w || canvas.height !== h)
    {
        canvas.width = w;
        canvas.height = h;
    }
  
    context.globalCompositeOperation = "copy";

    context.drawImage(texture.baseTexture.source, crop.x, crop.y, w, h, 0, 0, w, h);

    var rgbValues = Phaser.Color.hexToRGBArray(color);
    var r = rgbValues[0], g = rgbValues[1], b = rgbValues[2];

    var pixelData = context.getImageData(0, 0, w, h);

    var pixels = pixelData.data;

    for (var i = 0; i < pixels.length; i += 4)
    {
        pixels[i + 0] *= r;
        pixels[i + 1] *= g;
        pixels[i + 2] *= b;

        if (!PIXI.CanvasTinter.canHandleAlpha)
        {
            var alpha = pixels[i + 3];

            pixels[i + 0] /= 255 / alpha;
            pixels[i + 1] /= 255 / alpha;
            pixels[i + 2] /= 255 / alpha;
        }
    }

    context.putImageData(pixelData, 0, 0);
};

