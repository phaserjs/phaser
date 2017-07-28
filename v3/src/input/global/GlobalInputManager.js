//  Phaser.Input.GlobalInputManager

var Class = require('../../utils/Class');
var EventDispatcher = require('../../events/EventDispatcher');
var GetTransformedPoint = require('./components/GetTransformedPoint');
var Keyboard = require('../keyboard/KeyboardManager');
var Mouse = require('../mouse/MouseManager');
var MouseEvent = require('../mouse/events/');
var Touch = require('../touch/TouchManager');
var Pointer = require('../Pointer');
var PointScreenToWorldHitTest = require('./components/PointScreenToWorldHitTest');
var HitTest = require('./components/HitTest');
var PointWithinGameObject = require('./components/PointWithinGameObject');
var TransformMatrix = require('../../gameobjects/components/TransformMatrix');

var GlobalInputManager = new Class({

    initialize:

    function GlobalInputManager (game, config)
    {
        this.game = game;

        this.canvas;

        this.config = config;

        this.enabled = true;

        this.events = new EventDispatcher();

        //   Standard FIFO queue
        this.queue = [];

        //  Listeners
        this.keyboard = new Keyboard(this);
        this.mouse = new Mouse(this);
        this.touch = new Touch(this);

        this.activePointer = new Pointer(this, 0);

        this.scale = { x: 1, y: 1 };

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
        this.canvas = this.game.canvas;

        this.keyboard.boot();
        this.mouse.boot();
        this.touch.boot();
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

        this.scale.x = this.game.config.width / this.canvas.offsetWidth;
        this.scale.y = this.game.config.height / this.canvas.offsetHeight;

        //  Clears the queue array, and also means we don't work on array data that could potentially
        //  be modified during the processing phase
        var queue = this.queue.splice(0, len);

        //  Process the event queue, dispatching all of the events that have stored up
        for (var i = 0; i < len; i++)
        {
            var event = queue[i];

            //  TODO: Move to CONSTs so we can do integer comparisons instead of strings.
            //  TODO: Remove the MouseEvent events. Devs should use Pointer events instead.
            switch (event.type)
            {
                case 'mousemove':

                    pointer.move(event, time);
                    this.events.dispatch(new MouseEvent.MOVE(event));
                    break;

                case 'mousedown':

                    pointer.down(event, time);
                    this.events.dispatch(new MouseEvent.DOWN(event));
                    break;

                case 'mouseup':

                    pointer.up(event, time);
                    this.events.dispatch(new MouseEvent.UP(event));
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
    },

    transformX: function (pageX)
    {
        return (pageX - this.canvas.offsetLeft) * this.scale.x;
    },

    transformY: function (pageY)
    {
        return (pageY - this.canvas.offsetTop) * this.scale.y;
    },

    getOffsetX: function ()
    {
        return this.canvas.offsetLeft;
    },

    getOffsetY: function ()
    {
        return this.canvas.offsetTop;
    },

    getScaleX: function ()
    {
        return this.game.config.width / this.canvas.offsetWidth;
    },

    getScaleY: function ()
    {
        return this.game.config.height / this.canvas.offsetHeight;
    }

});

module.exports = GlobalInputManager;
