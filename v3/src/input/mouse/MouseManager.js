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

        if (this.enabled)
        {
            this.startListeners();
        }
    },

    startListeners: function ()
    {
        var queue = this.queue;
        // var captures = this.captures;

        var mouseHandler = function (event)
        {
            if (event.preventDefaulted)
            {
                // Do nothing if event already handled
                return;
            }

            queue.push(event);

            // if (captures[event.keyCode])
            // {
            //     event.preventDefault();
            // }
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

    update: function ()
    {
        if (!this.enabled)
        {
            return;
        }

        //  Clears the queue array, and also means we don't work on array data that could potentially
        //  be modified during the processing phase
        var queue = this.queue.splice(0, this.queue.length);

        //  Process the event queue, dispatching all of the events that have stored up
        for (var i = 0; i < queue.length; i++)
        {
            var event = queue[i];

            if (event.type === 'mousedown')
            {
                this.events.dispatch(new Event.MOUSE_DOWN_EVENT(event));
            }
            else if (event.type === 'mouseup')
            {
                this.events.dispatch(new Event.MOUSE_UP_EVENT(event));
            }
        }
    }

};

module.exports = MouseManager;
