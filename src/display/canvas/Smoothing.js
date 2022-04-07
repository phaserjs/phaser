/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

//  Browser specific prefix, so not going to change between contexts, only between browsers
var prefix = '';

/**
 * @namespace Phaser.Display.Canvas.Smoothing
 * @since 3.0.0
 */
var Smoothing = function ()
{
    /**
     * Gets the Smoothing Enabled vendor prefix being used on the given context, or null if not set.
     *
     * @function Phaser.Display.Canvas.Smoothing.getPrefix
     * @since 3.0.0
     *
     * @param {(CanvasRenderingContext2D|WebGLRenderingContext)} context - The canvas context to check.
     *
     * @return {string} The name of the property on the context which controls image smoothing (either `imageSmoothingEnabled` or a vendor-prefixed version thereof), or `null` if not supported.
     */
    var getPrefix = function (context)
    {
        var vendors = [ 'i', 'webkitI', 'msI', 'mozI', 'oI' ];

        for (var i = 0; i < vendors.length; i++)
        {
            var s = vendors[i] + 'mageSmoothingEnabled';

            if (s in context)
            {
                return s;
            }
        }

        return null;
    };

    /**
     * Sets the Image Smoothing property on the given context. Set to false to disable image smoothing.
     * By default browsers have image smoothing enabled, which isn't always what you visually want, especially
     * when using pixel art in a game. Note that this sets the property on the context itself, so that any image
     * drawn to the context will be affected. This sets the property across all current browsers but support is
     * patchy on earlier browsers, especially on mobile.
     *
     * @function Phaser.Display.Canvas.Smoothing.enable
     * @since 3.0.0
     *
     * @param {(CanvasRenderingContext2D|WebGLRenderingContext)} context - The context on which to enable smoothing.
     *
     * @return {(CanvasRenderingContext2D|WebGLRenderingContext)} The provided context.
     */
    var enable = function (context)
    {
        if (prefix === '')
        {
            prefix = getPrefix(context);
        }

        if (prefix)
        {
            context[prefix] = true;
        }

        return context;
    };

    /**
     * Sets the Image Smoothing property on the given context. Set to false to disable image smoothing.
     * By default browsers have image smoothing enabled, which isn't always what you visually want, especially
     * when using pixel art in a game. Note that this sets the property on the context itself, so that any image
     * drawn to the context will be affected. This sets the property across all current browsers but support is
     * patchy on earlier browsers, especially on mobile.
     *
     * @function Phaser.Display.Canvas.Smoothing.disable
     * @since 3.0.0
     *
     * @param {(CanvasRenderingContext2D|WebGLRenderingContext)} context - The context on which to disable smoothing.
     *
     * @return {(CanvasRenderingContext2D|WebGLRenderingContext)} The provided context.
     */
    var disable = function (context)
    {
        if (prefix === '')
        {
            prefix = getPrefix(context);
        }

        if (prefix)
        {
            context[prefix] = false;
        }

        return context;
    };

    /**
     * Returns `true` if the given context has image smoothing enabled, otherwise returns `false`.
     * Returns null if no smoothing prefix is available.
     *
     * @function Phaser.Display.Canvas.Smoothing.isEnabled
     * @since 3.0.0
     *
     * @param {(CanvasRenderingContext2D|WebGLRenderingContext)} context - The context to check.
     *
     * @return {?boolean} `true` if smoothing is enabled on the context, otherwise `false`. `null` if not supported.
     */
    var isEnabled = function (context)
    {
        return (prefix !== null) ? context[prefix] : null;
    };

    return {
        disable: disable,
        enable: enable,
        getPrefix: getPrefix,
        isEnabled: isEnabled
    };

};

module.exports = Smoothing();
