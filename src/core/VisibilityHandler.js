/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Events = require('./events');

/**
 * The Visibility Handler is responsible for listening for document-level visibility change events and
 * window blur/focus events, then re-emitting them through the Game's Event Emitter so that the rest of
 * the framework can respond appropriately — for example, pausing the game loop when the player switches
 * tabs or minimizes the browser window, and resuming it when they return.
 *
 * It listens for the standard `visibilitychange` event where supported, and falls back to vendor-prefixed
 * equivalents (`webkitvisibilitychange`, `mozvisibilitychange`, `msvisibilitychange`) for older browsers.
 * Window-level `blur` and `focus` events are also captured to handle cases where the tab remains visible
 * but the window loses focus.
 *
 * If the game configuration has `autoFocus` enabled, the handler will also call `window.focus()` during
 * setup to ensure the game captures keyboard input immediately on load.
 *
 * @function Phaser.Core.VisibilityHandler
 * @fires Phaser.Core.Events#BLUR
 * @fires Phaser.Core.Events#FOCUS
 * @fires Phaser.Core.Events#HIDDEN
 * @fires Phaser.Core.Events#VISIBLE
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - The Game instance this Visibility Handler is working on.
 */
var VisibilityHandler = function (game)
{
    var hiddenVar;
    var eventEmitter = game.events;

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
            eventEmitter.emit(Events.HIDDEN);
        }
        else
        {
            eventEmitter.emit(Events.VISIBLE);
        }
    };

    if (hiddenVar)
    {
        document.addEventListener(hiddenVar, onChange, false);
    }

    window.onblur = function ()
    {
        eventEmitter.emit(Events.BLUR);
    };

    window.onfocus = function ()
    {
        eventEmitter.emit(Events.FOCUS);
    };

    //  Automatically give the window focus unless config says otherwise
    if (window.focus && game.config.autoFocus)
    {
        window.focus();
    }
};

module.exports = VisibilityHandler;
