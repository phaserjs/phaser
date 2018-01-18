//  Phaser.Input.InputManager

var Class = require('../utils/Class');
var EventEmitter = require('eventemitter3');
var Gamepad = require('./gamepad/GamepadManager');
var Keyboard = require('./keyboard/KeyboardManager');
var Mouse = require('./mouse/MouseManager');
var Pointer = require('./Pointer');
var Touch = require('./touch/TouchManager');
var TransformXY = require('../math/TransformXY');

var InputManager = new Class({

    initialize:

    function InputManager (game, config)
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

        game.events.once('boot', this.boot, this);
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

    //  Will always return an array.
    //  Array contains matching Interactive Objects.
    //  Array will be empty if no objects were matched.

    //  x/y = pointer x/y (un-translated)

    hitTest: function (x, y, gameObjects, camera, output)
    {
        if (output === undefined) { output = this._tempHitTest; }

        var tempPoint = this._tempPoint;
        var cameraW = camera.width;
        var cameraH = camera.height;

        output.length = 0;

        if (!(x >= camera.x && y >= camera.y && x <= camera.x + cameraW && y <= camera.y + cameraH))
        {
            return output;
        }

        //  Stores the world point inside of tempPoint
        camera.getWorldPoint(x, y, tempPoint);

        var culledGameObjects = camera.cull(gameObjects);

        var point = { x: 0, y: 0 };

        for (var i = 0; i < culledGameObjects.length; i++)
        {
            var gameObject = culledGameObjects[i];

            if (!gameObject.input || !gameObject.input.enabled || !gameObject.willRender())
            {
                continue;
            }

            var px = tempPoint.x + (camera.scrollX * gameObject.scrollFactorX) - camera.scrollX;
            var py = tempPoint.y + (camera.scrollY * gameObject.scrollFactorY) - camera.scrollY;

            TransformXY(px, py, gameObject.x, gameObject.y, gameObject.rotation, gameObject.scaleX, gameObject.scaleY, point);

            if (this.pointWithinHitArea(gameObject, point.x, point.y))
            {
                output.push(gameObject);
            }
        }

        return output;
    },

    //  x/y MUST be translated before being passed to this function,
    //  unless the gameObject is guaranteed to not be rotated or scaled in any way

    pointWithinHitArea: function (gameObject, x, y)
    {
        var input = gameObject.input;

        //  Normalize the origin
        x += gameObject.displayOriginX;
        y += gameObject.displayOriginY;

        if (input.hitAreaCallback(input.hitArea, x, y, gameObject))
        {
            input.localX = x;
            input.localY = y;

            return true;
        }
        else
        {
            return false;
        }
    },

    //  x/y MUST be translated before being passed to this function, unless the gameObject is guaranteed to
    //  be not rotated or scaled in any way

    pointWithinInteractiveObject: function (object, x, y)
    {
        if (!object.hitArea)
        {
            return false;
        }

        //  Normalize the origin
        x += object.gameObject.displayOriginX;
        y += object.gameObject.displayOriginY;

        object.localX = x;
        object.localY = y;

        return object.hitAreaCallback(object.hitArea, x, y, object);
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

module.exports = InputManager;
