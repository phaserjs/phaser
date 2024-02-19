/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Display.Canvas.CanvasInterpolation
 * @since 3.0.0
 */
var CanvasInterpolation = {

    /**
     * Sets the CSS image-rendering property on the given canvas to be 'crisp' (aka 'optimize contrast' on webkit).
     *
     * @function Phaser.Display.Canvas.CanvasInterpolation.setCrisp
     * @since 3.0.0
     * 
     * @param {HTMLCanvasElement} canvas - The canvas object to have the style set on.
     * 
     * @return {HTMLCanvasElement} The canvas.
     */
    setCrisp: function (canvas)
    {
        var types = [ 'optimizeSpeed', '-moz-crisp-edges', '-o-crisp-edges', '-webkit-optimize-contrast', 'optimize-contrast', 'crisp-edges', 'pixelated' ];

        types.forEach(function (type)
        {
            canvas.style['image-rendering'] = type;
        });

        canvas.style.msInterpolationMode = 'nearest-neighbor';

        return canvas;
    },

    /**
     * Sets the CSS image-rendering property on the given canvas to be 'bicubic' (aka 'auto').
     *
     * @function Phaser.Display.Canvas.CanvasInterpolation.setBicubic
     * @since 3.0.0
     * 
     * @param {HTMLCanvasElement} canvas - The canvas object to have the style set on.
     * 
     * @return {HTMLCanvasElement} The canvas.
     */
    setBicubic: function (canvas)
    {
        canvas.style['image-rendering'] = 'auto';
        canvas.style.msInterpolationMode = 'bicubic';

        return canvas;
    }

};

module.exports = CanvasInterpolation;
