var EventDispatcher = require('../../events/EventDispatcher');
var Event = require('./events');

var MouseManager = function (inputManager)
{
    this.manager = inputManager;

    this.enabled = false;

    this.target;

    this.events = new EventDispatcher();

    this.mouseHandler;

    //   Standard FIFO queue
    this.queue = [];
};

MouseManager.prototype.constructor = MouseManager;

MouseManager.prototype = {

    /**
    * The Boot handler is called by Phaser.Game when it first starts up.
    * The renderer is available by now.
    *
    * @method Phaser.Input.MouseManager#boot
    * @private
    */
    boot: function ()
    {
        var config = this.manager.gameConfig;

        this.enabled = config.inputMouse;
        this.target = config.inputMouseEventTarget;

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
        var queue = this.queue;

        var mouseHandler = function (event)
        {
            if (event.preventDefaulted)
            {
                // Do nothing if event already handled
                return;
            }

            queue.push(event);
        };

        this.mouseHandler = mouseHandler;

        this.target.addEventListener('mousemove', mouseHandler, false);
        this.target.addEventListener('mousedown', mouseHandler, false);
        this.target.addEventListener('mouseup', mouseHandler, false);
    },

    stopListeners: function ()
    {
        this.target.removeEventListener('mousemove', this.mouseHandler);
        this.target.removeEventListener('mousedown', this.mouseHandler);
        this.target.removeEventListener('mouseup', this.mouseHandler);
    },

    //  https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
    //  https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md

    update: function ()
    {
        var len = this.queue.length;

        if (!this.enabled || len === 0)
        {
            return;
        }

        //  Clears the queue array, and also means we don't work on array data that could potentially
        //  be modified during the processing phase
        var queue = this.queue.splice(0, len);

        //  Process the event queue, dispatching all of the events that have stored up
        for (var i = 0; i < len; i++)
        {
            var event = queue[i];

            switch (event.type)
            {
                case 'mousemove':
                    this.events.dispatch(new Event.MOUSE_MOVE_EVENT(event));
                    break;

                case 'mousedown':
                    this.events.dispatch(new Event.MOUSE_DOWN_EVENT(event));
                    break;

                case 'mouseup':
                    this.events.dispatch(new Event.MOUSE_UP_EVENT(event));
                    break;
            }
        }
    }

};

module.exports = MouseManager;
