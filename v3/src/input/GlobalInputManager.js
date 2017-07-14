//  Phaser.Input.GlobalInputManager

var Class = require('../utils/Class');
var EventDispatcher = require('../events/EventDispatcher');
var GetTransformedPoint = require('./components/GetTransformedPoint');
var Keyboard = require('./keyboard/KeyboardManager');
var Mouse = require('./mouse/MouseManager');
var MouseEvent = require('./mouse/events/');
var Pointer = require('./Pointer');
var PointScreenToWorldHitTest = require('./components/PointScreenToWorldHitTest');
var HitTest = require('./components/HitTest');
var PointWithinGameObject = require('./components/PointWithinGameObject');
var TransformMatrix = require('../gameobjects/components/TransformMatrix');

var GlobalInputManager = new Class({

    initialize:

    function GlobalInputManager (game, config)
    {
        this.game = game;

        this.config = config;

        this.enabled = true;

        this.events = new EventDispatcher();

        //   Standard FIFO queue
        this.queue = [];

        //  Listeners
        this.keyboard = new Keyboard(this);
        this.mouse = new Mouse(this);

        this.activePointer = new Pointer(this);

        this._tempMatrix = new TransformMatrix();
        this._tempPoint = { x: 0, y: 0 };
        this._tempHitTest = [];
    },

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

    update: function (time, delta)
    {
        this.keyboard.update();

        var len = this.queue.length;

        //  Currently just 1 pointer supported
        var pointer = this.activePointer;

        pointer.reset();

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

            //  Move to CONSTs so we can do integer comparisons instead of strings
            switch (event.type)
            {
                case 'mousemove':

                    pointer.move(event);
                    this.events.dispatch(new MouseEvent.MOVE(event));
                    break;

                case 'mousedown':

                    pointer.down(event);
                    this.events.dispatch(new MouseEvent.DOWN(event));
                    break;

                case 'mouseup':

                    pointer.up(event);
                    this.events.dispatch(new MouseEvent.UP(event));
                    break;
            }
        }
    },

    getTransformedPoint: function (gameObject, x, y)
    {
        return GetTransformedPoint(this._tempMatrix, gameObject, x, y, this._tempPoint);
    },

    pointWithinGameObject: function (gameObject, x, y)
    {
        return PointWithinGameObject(gameObject, x, y);
    },

    hitTest: function (gameObjects, x, y, camera)
    {
        return HitTest(this._tempMatrix, x, y, gameObjects, camera, this._tempHitTest);
    },

    pointScreenToWorldHitTest: function (gameObjects, x, y, camera)
    {
        return PointScreenToWorldHitTest(this._tempMatrix, x, y, gameObjects, camera, this._tempHitTest);
    }

});

module.exports = GlobalInputManager;
