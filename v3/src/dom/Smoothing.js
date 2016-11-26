var Smoothing = {

    //  See if we can cache this - first check how often getPrefix is called
    prefix: null,

    /**
    * Gets the Smoothing Enabled vendor prefix being used on the given context, or null if not set.
    *
    * @method Phaser.Canvas.getSmoothingPrefix
    * @param {CanvasRenderingContext2D} context - The context to enable or disable the image smoothing on.
    * @return {string|null} Returns the smoothingEnabled vendor prefix, or null if not set on the context.
    */
    getPrefix: function (context)
    {
        var vendors = [ 'i', 'webkitI', 'msI', 'mozI', 'oI' ];

        vendors.forEach(function (vendor)
        {
            var s = vendor + 'mageSmoothingEnabled';

            if (s in context)
            {
                return s;
            }

        });

        return null;
    },

    /**
    * Sets the Image Smoothing property on the given context. Set to false to disable image smoothing.
    * By default browsers have image smoothing enabled, which isn't always what you visually want, especially
    * when using pixel art in a game. Note that this sets the property on the context itself, so that any image
    * drawn to the context will be affected. This sets the property across all current browsers but support is
    * patchy on earlier browsers, especially on mobile.
    *
    * @method Phaser.Canvas.setSmoothingEnabled
    * @param {CanvasRenderingContext2D} context - The context to enable or disable the image smoothing on.
    * @param {boolean} value - If set to true it will enable image smoothing, false will disable it.
    * @return {CanvasRenderingContext2D} Returns the source context.
    */
    enable: function (context, value)
    {
        var s = Smoothing.getPrefix(context);

        if (s)
        {
            context[s] = value;
        }

        return context;
    },

    /**
     * Returns `true` if the given context has image smoothing enabled, otherwise returns `false`.
     *
     * @method Phaser.Canvas.getSmoothingEnabled
     * @param {CanvasRenderingContext2D} context - The context to check for smoothing on.
     * @return {boolean} True if the given context has image smoothing enabled, otherwise false.
     */
    isEnabled: function (context)
    {
        var s = Smoothing.getPrefix(context);

        if (s)
        {
            return context[s];
        }

    }

};

module.exports = Smoothing;
