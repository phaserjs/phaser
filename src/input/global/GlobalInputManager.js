//  Phaser.Input.GlobalInputManager

var Class = require('../../utils/Class');
var EventEmitter = require('eventemitter3');
var Gamepad = require('../gamepad/GamepadManager');
var HitTest = require('./inc/HitTest');
var Keyboard = require('../keyboard/KeyboardManager');
var Mouse = require('../mouse/MouseManager');
var Pointer = require('../Pointer');
var Touch = require('../touch/TouchManager');

var GlobalInputManager = new Class({

    initialize:

    function GlobalInputManager (game, config)
    {
        this.game = game;

        this.canvas;

        this.config = config;

        this.enabled = true;

        this.events = new EventEmitter();

        //   Standard FIFO queue
        this.queue = [];

        //  Listeners (will be based on config)
        this.keyboard = new Keyboard(this);
        this.mouse = new Mouse(this);
        this.touch = new Touch(this);
        this.gamepad = new Gamepad(this);

        this.activePointer = new Pointer(this, 0);

        this.scale = { x: 1, y: 1 };

        this.bounds;

        // this._tempMatrix = new TransformMatrix();
        this._tempPoint = { x: 0, y: 0 };
        this._tempHitTest = [];
    },

    /**
    * The Boot handler is called by Phaser.Game when it first starts up.
    * The renderer is available by now.
    */
    boot: function ()
    {
        this.canvas = this.game.canvas;

        this.updateBounds();

        this.keyboard.boot();
        this.mouse.boot();
        this.touch.boot();
        this.gamepad.boot();
    },

    updateBounds: function ()
    {
        var bounds = this.canvas.getBoundingClientRect();

        if (window.scrollX)
        {
            bounds.left += window.scrollX;
        }

        if (window.scrollY)
        {
            bounds.top += window.scrollY;
        }

        this.bounds = bounds;
    },

    update: function (time, delta)
    {
        this.keyboard.update();
        this.gamepad.update();

        var len = this.queue.length;

        //  Currently just 1 pointer supported
        var pointer = this.activePointer;

        pointer.reset();

        if (!this.enabled || len === 0)
        {
            return;
        }

        this.updateBounds();

        this.scale.x = this.game.config.width / this.bounds.width;
        this.scale.y = this.game.config.height / this.bounds.height;

        //  Clears the queue array, and also means we don't work on array data that could potentially
        //  be modified during the processing phase
        var queue = this.queue.splice(0, len);

        //  Process the event queue, dispatching all of the events that have stored up
        for (var i = 0; i < len; i++)
        {
            var event = queue[i];

            //  TODO: Move to CONSTs so we can do integer comparisons instead of strings.
            switch (event.type)
            {
                case 'mousemove':

                    pointer.move(event, time);
                    break;

                case 'mousedown':

                    pointer.down(event, time);
                    break;

                case 'mouseup':

                    pointer.up(event, time);
                    break;

                case 'touchmove':

                    pointer.touchmove(event, time);
                    break;

                case 'touchstart':

                    pointer.touchstart(event, time);
                    break;

                case 'touchend':

                    pointer.touchend(event, time);
                    break;

                case 'pointerlockchange':

                    this.events.emit('pointerlockchange', event, this.mouse.locked);
                    break;
            }
        }
    },

    hitTest: function (gameObjects, x, y, camera)
    {
        return HitTest(this._tempPoint, x, y, gameObjects, camera, this._tempHitTest);
    },

    //  Called by Pointer class
    transformX: function (pageX)
    {
        return (pageX - this.bounds.left) * this.scale.x;
    },

    transformY: function (pageY)
    {
        return (pageY - this.bounds.top) * this.scale.y;
    },

    getOffsetX: function ()
    {
        return this.bounds.left;
    },

    getOffsetY: function ()
    {
        return this.bounds.top;
    },

    getScaleX: function ()
    {
        return this.game.config.width / this.bounds.width;
    },

    getScaleY: function ()
    {
        return this.game.config.height / this.bounds.height;
    }

});

module.exports = GlobalInputManager;
