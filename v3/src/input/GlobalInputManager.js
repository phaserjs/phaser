//  GlobalInputManager

var Keyboard = require('./keyboard/KeyboardManager');
var Mouse = require('./mouse/MouseManager');
var MouseEvent = require('./mouse/events/');
var EventDispatcher = require('../events/EventDispatcher');

var GlobalInputManager = function (game, gameConfig)
{
    this.game = game;

    this.gameConfig = gameConfig;

    this.enabled = true;

    this.events = new EventDispatcher();

    //   Standard FIFO queue
    this.queue = [];

    //  Listeners
    this.keyboard = new Keyboard(this);
    this.mouse = new Mouse(this);
};

GlobalInputManager.prototype.constructor = GlobalInputManager;

GlobalInputManager.prototype = {

    /**
    * The Boot handler is called by Phaser.Game when it first starts up.
    * The renderer is available by now.
    *
    * @method Phaser.Input.KeyboardManager#boot
    * @private
    */
    boot: function ()
    {
        this.keyboard.boot();
        this.mouse.boot();
    },

    update: function ()
    {
        this.keyboard.update();

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
                    this.events.dispatch(new MouseEvent.MOVE(event));
                    break;

                case 'mousedown':
                    this.events.dispatch(new MouseEvent.DOWN(event));
                    break;

                case 'mouseup':
                    this.events.dispatch(new MouseEvent.UP(event));
                    break;
            }
        }
    }

};

module.exports = GlobalInputManager;
