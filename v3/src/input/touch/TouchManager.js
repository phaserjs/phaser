var Class = require('../../utils/Class');

// https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
// https://patrickhlauke.github.io/touch/tests/results/
// https://www.html5rocks.com/en/mobile/touch/

var TouchManager = new Class({

    initialize:

    function TouchManager (inputManager)
    {
        this.manager = inputManager;

        // @property {boolean} capture - If true the DOM events will have event.preventDefault applied to them, if false they will propagate fully.
        this.capture = true;

        this.enabled = false;

        this.target;

        this.handler;
    },

    boot: function ()
    {
        var config = this.manager.config;

        this.enabled = config.inputTouch;
        this.target = config.inputTouchEventTarget;
        this.capture = config.inputTouchCapture;

        if (!this.target)
        {
            this.target = this.manager.game.canvas;
        }

        if (this.enabled)
        {
            this.startListeners();
        }
    },

    startListeners: function ()
    {
        var queue = this.manager.queue;
        var target = this.target;

        var passive = { passive: true };
        var nonPassive = { passive: false };

        var handler;

        if (this.capture)
        {
            handler = function (event)
            {
                if (event.defaultPrevented)
                {
                    // Do nothing if event already handled
                    return;
                }

                // console.log('touch', event);

                queue.push(event);

                event.preventDefault();
            };

            target.addEventListener('touchstart', handler, nonPassive);
            target.addEventListener('touchmove', handler, nonPassive);
            target.addEventListener('touchend', handler, nonPassive);
        }
        else
        {
            handler = function (event)
            {
                if (event.defaultPrevented)
                {
                    // Do nothing if event already handled
                    return;
                }

                queue.push(event);
            };

            target.addEventListener('touchstart', handler, passive);
            target.addEventListener('touchmove', handler, passive);
            target.addEventListener('touchend', handler, passive);
        }
        
        this.handler = handler;
    },

    stopListeners: function ()
    {
        var target = this.target;

        target.removeEventListener('touchstart', this.handler);
        target.removeEventListener('touchmove', this.handler);
        target.removeEventListener('touchend', this.handler);
    }

});

module.exports = TouchManager;
