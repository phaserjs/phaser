var Event = require('../events/Event');

var VisibilityHandler = function (eventDispatcher)
{
    var hiddenVar;

    if (document.hidden !== undefined)
    {
        hiddenVar = 'visibilitychange';
    }
    else
    {
        var vendors = [ 'webkit', 'moz', 'ms' ];

        vendors.forEach(function (prefix)
        {
            if (document[prefix + 'Hidden'] !== undefined)
            {
                document.hidden = function ()
                {
                    return document[prefix + 'Hidden'];
                };

                hiddenVar = prefix + 'visibilitychange';
            }

        });
    }

    var onChange = function (event)
    {
        if (document.hidden || event.type === 'pause')
        {
            eventDispatcher.dispatch(new Event('HIDDEN'));
        }
        else
        {
            eventDispatcher.dispatch(new Event('VISIBLE'));
        }
    };

    //  Does browser support it?
    //  If not (like in IE9 or old Android) we need to fall back to blur / focus
    if (hiddenVar)
    {
        document.addEventListener(hiddenVar, onChange, false);
    }
    else
    {
        console.log('Fallback TODO');
    }

    window.onblur = function ()
    {
        eventDispatcher.dispatch(new Event('ON_BLUR'));
    };

    window.onfocus = function ()
    {
        eventDispatcher.dispatch(new Event('ON_FOCUS'));
    };

};

module.exports = VisibilityHandler;
