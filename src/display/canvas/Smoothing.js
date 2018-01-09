
//  Browser specific prefix, so not going to change between contexts, only between browsers
var prefix = '';

var Smoothing = function ()
{
    // Gets the Smoothing Enabled vendor prefix being used on the given context, or null if not set.
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
