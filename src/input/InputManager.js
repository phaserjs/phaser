var Class = require('../utils/Class');
var EventEmitter = require('eventemitter3');
var Gamepad = require('./gamepad/GamepadManager');
var Keyboard = require('./keyboard/KeyboardManager');
var Mouse = require('./mouse/MouseManager');
var Pointer = require('./Pointer');
var Rectangle = require('../geom/rectangle/Rectangle');
var Touch = require('./touch/TouchManager');
var TransformXY = require('../math/TransformXY');

/**
 * @classdesc
 * [description]
 *
 * @class InputManager
 * @memberOf Phaser.Input
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - [description]
 * @param {object} config - [description]
 */
var InputManager = new Class({

    initialize:

    function InputManager (game, config)
    {
        /**
         * [description]
         *
         * @property {[type]} game
         * @since 3.0.0
         */
        this.game = game;

        /**
         * [description]
         *
         * @property {HTMLCanvasElement} canvas
         * @since 3.0.0
         */
        this.canvas;

        /**
         * [description]
         *
         * @property {object} config
         * @since 3.0.0
         */
        this.config = config;

        /**
         * [description]
         *
         * @property {boolean} enabled
         * @default true
         * @since 3.0.0
         */
        this.enabled = true;

        /**
         * [description]
         *
         * @property {[type]} events
         * @since 3.0.0
         */
        this.events = new EventEmitter();

        /**
         * Standard FIFO queue.
         *
         * @property {array} queue
         * @default []
         * @since 3.0.0
         */
        this.queue = [];

        /**
         * [description]
         *
         * @property {Phaser.Input.Keyboard.KeyboardManager} keyboard
         * @since 3.0.0
         */
        this.keyboard = new Keyboard(this);

        /**
         * [description]
         *
         * @property {Phaser.Input.Mouse.MouseManager} mouse
         * @since 3.0.0
         */
        this.mouse = new Mouse(this);

        /**
         * [description]
         *
         * @property {Phaser.Input.Touch.TouchManager} touch
         * @since 3.0.0
         */
        this.touch = new Touch(this);

        /**
         * [description]
         *
         * @property {Phaser.Input.Gamepad.GamepadManager} gamepad
         * @since 3.0.0
         */
        this.gamepad = new Gamepad(this);

        /**
         * [description]
         *
         * @property {[type]} activePointer
         * @since 3.0.0
         */
        this.activePointer = new Pointer(this, 0);

        /**
         * [description]
         *
         * @property {object} scale
         * @since 3.0.0
         */
        this.scale = { x: 1, y: 1 };

        /**
         * If the top-most Scene in the Scene List receives an input it will stop input from
         * propagating any lower down the scene list, i.e. if you have a UI Scene at the top
         * and click something on it, that click will not then be passed down to any other
         * Scene below. Disable this to have input events passed through all Scenes, all the time.
         *
         * @property {boolean} globalTopOnly
         * @default true
         * @since 3.0.0
         */
        this.globalTopOnly = true;

        /**
         * [description]
         *
         * @property {boolean} ignoreEvents
         * @default false
         * @since 3.0.0
         */
        this.ignoreEvents = false;

        /**
         * [description]
         *
         * @property {Phaser.Geom.Rectangle} bounds
         * @since 3.0.0
         */
        this.bounds = new Rectangle();

        /**
         * [description]
         *
         * @property {object} _tempPoint
         * @private
         * @since 3.0.0
         */
        this._tempPoint = { x: 0, y: 0 };

        /**
         * [description]
         *
         * @property {array} _tempHitTest
         * @private
         * @default []
         * @since 3.0.0
         */
        this._tempHitTest = [];

        game.events.once('boot', this.boot, this);
    },

    /**
     * The Boot handler is called by Phaser.Game when it first starts up.
     * The renderer is available by now.
     *
     * @method Phaser.Input.InputManager#boot
     * @since 3.0.0
     */
    boot: function ()
    {
        this.canvas = this.game.canvas;

        this.updateBounds();

        this.keyboard.boot();
        this.mouse.boot();
        this.touch.boot();
        this.gamepad.boot();

        this.game.events.once('destroy', this.destroy, this);
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputManager#updateBounds
     * @since 3.0.0
     */
    updateBounds: function ()
    {
        var clientRect = this.canvas.getBoundingClientRect();
        var bounds = this.bounds;

        bounds.left = clientRect.left + window.pageXOffset;
        bounds.top = clientRect.top + window.pageYOffset;
        bounds.width = clientRect.width;
        bounds.height = clientRect.height;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputManager#update
     * @since 3.0.0
     *
     * @param {[type]} time - [description]
     */
    update: function (time)
    {
        this.keyboard.update();
        this.gamepad.update();

        this.ignoreEvents = false;

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

    /**
     * Will always return an array.
     * Array contains matching Interactive Objects.
     * Array will be empty if no objects were matched.
     * x/y = pointer x/y (un-translated)
     *
     * @method Phaser.Input.InputManager#hitTest
     * @since 3.0.0
     *
     * @param {[type]} x - [description]
     * @param {[type]} y - [description]
     * @param {[type]} gameObjects - [description]
     * @param {[type]} camera - [description]
     * @param {[type]} output - [description]
     *
     * @return {[type]} [description]
     */
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

    /**
     * x/y MUST be translated before being passed to this function,
     * unless the gameObject is guaranteed to not be rotated or scaled in any way.
     *
     * @method Phaser.Input.InputManager#pointWithinHitArea
     * @since 3.0.0
     *
     * @param {[type]} gameObject - [description]
     * @param {[type]} x - [description]
     * @param {[type]} y - [description]
     *
     * @return {boolean} [description]
     */
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

    /**
     * x/y MUST be translated before being passed to this function,
     * unless the gameObject is guaranteed to not be rotated or scaled in any way.
     *
     * @method Phaser.Input.InputManager#pointWithinInteractiveObject
     * @since 3.0.0
     *
     * @param {[type]} object - [description]
     * @param {[type]} x - [description]
     * @param {[type]} y - [description]
     *
     * @return {boolean} [description]
     */
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

    /**
     * [description]
     *
     * @method Phaser.Input.InputManager#transformX
     * @since 3.0.0
     *
     * @param {[type]} pageX - [description]
     *
     * @return {number} [description]
     */
    transformX: function (pageX)
    {
        return (pageX - this.bounds.left) * this.scale.x;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputManager#transformY
     * @since 3.0.0
     *
     * @param {[type]} pageY - [description]
     *
     * @return {number} [description]
     */
    transformY: function (pageY)
    {
        return (pageY - this.bounds.top) * this.scale.y;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputManager#getOffsetX
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    getOffsetX: function ()
    {
        return this.bounds.left;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputManager#getOffsetY
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    getOffsetY: function ()
    {
        return this.bounds.top;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputManager#getScaleX
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    getScaleX: function ()
    {
        return this.game.config.width / this.bounds.width;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputManager#getScaleY
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    getScaleY: function ()
    {
        return this.game.config.height / this.bounds.height;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.events.removeAllListeners();

        this.keyboard.destroy();
        this.mouse.destroy();
        this.touch.destroy();
        this.gamepad.destroy();

        this.activePointer.destroy();

        this.queue = [];

        this.game = null;
    }

});

module.exports = InputManager;
