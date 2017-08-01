var Class = require('../../utils/Class');

//  https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
//  https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md

var MouseManager = new Class({

    initialize:

    function MouseManager (inputManager)
    {
        this.manager = inputManager;

        // @property {boolean} capture - If true the DOM mouse events will have event.preventDefault applied to them, if false they will propagate fully.
        this.capture = false;

        this.enabled = false;

        this.target;

        this.handler;
    },

    boot: function ()
    {
        var config = this.manager.config;

        this.enabled = config.inputMouse;
        this.target = config.inputMouseEventTarget;

        if (!this.target)
        {
            this.target = this.manager.game.canvas;
        }

        if (config.disableContextMenu)
        {
            this.disableContextMenu();
        }

        if (this.enabled)
        {
            this.startListeners();
        }
    },

    disableContextMenu: function ()
    {
        document.body.addEventListener('contextmenu', function (event)
        {
            event.preventDefault();
            return false;
        });

        return this;
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

            queue.push(event);

            if (_this.capture)
            {
                event.preventDefault();
            }
        };

        this.handler = handler;

        this.target.addEventListener('mousemove', handler, false);
        this.target.addEventListener('mousedown', handler, false);
        this.target.addEventListener('mouseup', handler, false);
    },

    stopListeners: function ()
    {
        this.target.removeEventListener('mousemove', this.handler);
        this.target.removeEventListener('mousedown', this.handler);
        this.target.removeEventListener('mouseup', this.handler);
    }

});

module.exports = MouseManager;
