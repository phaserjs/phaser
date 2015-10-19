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
    var canvas = sprite.tintedTexture || PIXI.CanvasPool.create(this);
    
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

    if (canvas.width !== crop.width || canvas.height !== crop.height)
    {
        canvas.width = crop.width;
        canvas.height = crop.height;
    }

    context.clearRect(0, 0, crop.width, crop.height);

    context.fillStyle = "#" + ("00000" + (color | 0).toString(16)).substr(-6);
    context.fillRect(0, 0, crop.width, crop.height);

    context.globalCompositeOperation = "multiply";
    context.drawImage(texture.baseTexture.source, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

    context.globalCompositeOperation = "destination-atop";
    context.drawImage(texture.baseTexture.source, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

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

    canvas.width = crop.width;
    canvas.height = crop.height;
  
    context.globalCompositeOperation = "copy";

    context.drawImage(texture.baseTexture.source, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

    var rgbValues = PIXI.hex2rgb(color);
    var r = rgbValues[0], g = rgbValues[1], b = rgbValues[2];

    var pixelData = context.getImageData(0, 0, crop.width, crop.height);

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

/**
 * Checks if the browser correctly supports putImageData alpha channels.
 * 
 * @method checkInverseAlpha
 * @static
 */
PIXI.CanvasTinter.checkInverseAlpha = function()
{
    var canvas = new PIXI.CanvasBuffer(2, 1);

    canvas.context.fillStyle = "rgba(10, 20, 30, 0.5)";

    //  Draw a single pixel
    canvas.context.fillRect(0, 0, 1, 1);

    //  Get the color values
    var s1 = canvas.context.getImageData(0, 0, 1, 1);

    if (s1 === null)
    {
        return false;
    }

    //  Plot them to x2
    canvas.context.putImageData(s1, 1, 0);

    //  Get those values
    var s2 = canvas.context.getImageData(1, 0, 1, 1);

    //  Compare and return
    return (s2.data[0] === s1.data[0] && s2.data[1] === s1.data[1] && s2.data[2] === s1.data[2] && s2.data[3] === s1.data[3]);
};

/**
 * If the browser isn't capable of handling tinting with alpha this will be false.
 * This property is only applicable if using tintWithPerPixel.
 *
 * @property canHandleAlpha
 * @type Boolean
 * @static
 */
PIXI.CanvasTinter.canHandleAlpha = PIXI.CanvasTinter.checkInverseAlpha();

/**
 * Whether or not the Canvas BlendModes are supported, consequently the ability to tint using the multiply method.
 *
 * @property canUseMultiply
 * @type Boolean
 * @static
 */
PIXI.CanvasTinter.canUseMultiply = PIXI.canUseNewCanvasBlendModes();

/**
 * The tinting method that will be used.
 * 
 * @method tintMethod
 * @static
 */
PIXI.CanvasTinter.tintMethod = PIXI.CanvasTinter.canUseMultiply ? PIXI.CanvasTinter.tintWithMultiply :  PIXI.CanvasTinter.tintWithPerPixel;
