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
        this.capture = false;

        this.enabled = false;

        this.target;

        this.handler;
    },

    boot: function ()
    {
        var config = this.manager.config;

        this.enabled = config.inputTouch;
        this.target = config.inputTouchEventTarget;

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

        var _this = this;

        var handler = function (event)
        {
            if (event.preventDefaulted)
            {
                // Do nothing if event already handled
                return;
            }

            // console.log(event);

            queue.push(event);

            if (_this.capture)
            {
                event.preventDefault();
            }
        };

        this.handler = handler;

        this.target.addEventListener('touchstart', handler, false);
        this.target.addEventListener('touchmove', handler, false);
        this.target.addEventListener('touchend', handler, false);
    },

    stopListeners: function ()
    {
        this.target.removeEventListener('touchstart', this.handler);
        this.target.removeEventListener('touchmove', this.handler);
        this.target.removeEventListener('touchend', this.handler);
    }

});

module.exports = TouchManager;
