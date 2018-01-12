/**
 * [description]
 *
 * @function Phaser.Boot.VisibilityHandler
 * @since 3.0.0
 *
 * @param {Phaser.Events.EventDispatcher} eventEmitter - The EventDispatcher that will dispatch the visibility events.
 */
var VisibilityHandler = function (eventEmitter)
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
            eventEmitter.emit('hidden');
        }
        else
        {
            eventEmitter.emit('visible');
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
        eventEmitter.emit('blur');
    };

    window.onfocus = function ()
    {
        eventEmitter.emit('focus');
    };
};

module.exports = VisibilityHandler;
