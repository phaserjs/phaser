/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Canvas Interpolation namespace contains helper functions for setting the CSS `image-rendering`
 * property on a canvas element. This controls how the browser scales the canvas when it is
 * displayed at a size different from its native resolution.
 *
 * Use `setCrisp` for pixel art games where you want sharp, nearest-neighbor scaling with no
 * anti-aliasing. Use `setBicubic` to restore the default browser behavior, which applies smooth
 * interpolation when scaling up the canvas.
 *
 * @namespace Phaser.Display.Canvas.CanvasInterpolation
 * @since 3.0.0
 */
var CanvasInterpolation = {

    /**
     * Sets the CSS `image-rendering` property on the given canvas to use nearest-neighbor (crisp) scaling.
     * This disables anti-aliasing so that each pixel is rendered as a hard-edged block, which is ideal
     * for pixel art games. Multiple vendor-prefixed values are applied in sequence to ensure
     * cross-browser compatibility, including Firefox (`-moz-crisp-edges`), Opera (`-o-crisp-edges`),
     * WebKit (`-webkit-optimize-contrast`), and Internet Explorer (`msInterpolationMode: nearest-neighbor`).
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
     * Sets the CSS `image-rendering` property on the given canvas to `auto`, restoring the default
     * browser behavior. This allows the browser to apply smooth (typically bicubic) interpolation
     * when scaling the canvas, which produces softer edges and is better suited to high-resolution
     * textures or non-pixel-art content. Also sets the IE-specific `msInterpolationMode` to `bicubic`.
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
