/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
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
        var types = [ 'optimizeSpeed', 'crisp-edges', '-moz-crisp-edges', '-webkit-optimize-contrast', 'optimize-contrast', 'pixelated' ];

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
