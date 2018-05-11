/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var EventEmitter = require('eventemitter3');
var Gamepad = require('./gamepad/GamepadManager');
var Keyboard = require('./keyboard/KeyboardManager');
var Mouse = require('./mouse/MouseManager');
var Pointer = require('./Pointer');
var Rectangle = require('../geom/rectangle/Rectangle');
var Touch = require('./touch/TouchManager');
var TransformMatrix = require('../gameobjects/components/TransformMatrix');
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
         * @name Phaser.Input.InputManager#game
         * @type {Phaser.Game}
         * @since 3.0.0
         */
        this.game = game;

        /**
         * [description]
         *
         * @name Phaser.Input.InputManager#canvas
         * @type {HTMLCanvasElement}
         * @since 3.0.0
         */
        this.canvas;

        /**
         * [description]
         *
         * @name Phaser.Input.InputManager#config
         * @type {object}
         * @since 3.0.0
         */
        this.config = config;

        /**
         * [description]
         *
         * @name Phaser.Input.InputManager#enabled
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.enabled = true;

        /**
         * [description]
         *
         * @name Phaser.Input.InputManager#events
         * @type {Phaser.Events.EventEmitter}
         * @since 3.0.0
         */
        this.events = new EventEmitter();

        /**
         * Standard FIFO queue.
         *
         * @name Phaser.Input.InputManager#queue
         * @type {array}
         * @default []
         * @since 3.0.0
         */
        this.queue = [];

        /**
         * [description]
         *
         * @name Phaser.Input.InputManager#keyboard
         * @type {Phaser.Input.Keyboard.KeyboardManager}
         * @since 3.0.0
         */
        this.keyboard = new Keyboard(this);

        /**
         * [description]
         *
         * @name Phaser.Input.InputManager#mouse
         * @type {Phaser.Input.Mouse.MouseManager}
         * @since 3.0.0
         */
        this.mouse = new Mouse(this);

        /**
         * [description]
         *
         * @name Phaser.Input.InputManager#touch
         * @type {Phaser.Input.Touch.TouchManager}
         * @since 3.0.0
         */
        this.touch = new Touch(this);

        /**
         * [description]
         *
         * @name Phaser.Input.InputManager#gamepad
         * @type {Phaser.Input.Gamepad.GamepadManager}
         * @since 3.0.0
         */
        this.gamepad = new Gamepad(this);

        /**
         * [description]
         *
         * @name Phaser.Input.InputManager#activePointer
         * @type {Phaser.Input.Pointer}
         * @since 3.0.0
         */
        this.activePointer = new Pointer(this, 0);

        /**
         * [description]
         *
         * @name Phaser.Input.InputManager#scale
         * @type {{x:number,y:number}}
         * @since 3.0.0
         */
        this.scale = { x: 1, y: 1 };

        /**
         * If the top-most Scene in the Scene List receives an input it will stop input from
         * propagating any lower down the scene list, i.e. if you have a UI Scene at the top
         * and click something on it, that click will not then be passed down to any other
         * Scene below. Disable this to have input events passed through all Scenes, all the time.
         *
         * @name Phaser.Input.InputManager#globalTopOnly
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.globalTopOnly = true;

        /**
         * [description]
         *
         * @name Phaser.Input.InputManager#ignoreEvents
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.ignoreEvents = false;

        /**
         * [description]
         *
         * @name Phaser.Input.InputManager#bounds
         * @type {Phaser.Geom.Rectangle}
         * @since 3.0.0
         */
        this.bounds = new Rectangle();

        /**
         * [description]
         *
         * @name Phaser.Input.InputManager#_tempPoint
         * @type {{x:number,y:number}}
         * @private
         * @since 3.0.0
         */
        this._tempPoint = { x: 0, y: 0 };

        /**
         * [description]
         *
         * @name Phaser.Input.InputManager#_tempHitTest
         * @type {array}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._tempHitTest = [];

        /**
         * [description]
         *
         * @name Phaser.Input.InputManager#_tempMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @private
         * @since 3.4.0
         */
        this._tempMatrix = new TransformMatrix();

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

        this.game.events.on('prestep', this.update, this);
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
        var bounds = this.bounds;

        var clientRect = this.canvas.getBoundingClientRect();

        bounds.x = clientRect.left + window.pageXOffset - document.documentElement.clientLeft;
        bounds.y = clientRect.top + window.pageYOffset - document.documentElement.clientTop;
        bounds.width = clientRect.width;
        bounds.height = clientRect.height;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputManager#resize
     * @since 3.2.0
     */
    resize: function ()
    {
        this.updateBounds();

        //  Game config size
        var gw = this.game.config.width;
        var gh = this.game.config.height;

        //  Actual canvas size
        var bw = this.bounds.width;
        var bh = this.bounds.height;

        //  Scale factor
        this.scale.x = gw / bw;
        this.scale.y = gh / bh;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputManager#update
     * @since 3.0.0
     *
     * @param {number} time - [description]
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
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {array} gameObjects - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     * @param {array} output - [description]
     *
     * @return {array} [description]
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

        var res = this.game.config.resolution;

        var matrix = this._tempMatrix;

        for (var i = 0; i < culledGameObjects.length; i++)
        {
            var gameObject = culledGameObjects[i];

            if (!gameObject.input || !gameObject.input.enabled || !gameObject.willRender())
            {
                continue;
            }

            var px = tempPoint.x * res + (camera.scrollX * gameObject.scrollFactorX) - camera.scrollX;
            var py = tempPoint.y * res + (camera.scrollY * gameObject.scrollFactorY) - camera.scrollY;

            if (gameObject.parentContainer)
            {
                gameObject.getWorldTransformMatrix(matrix);

                TransformXY(px, py, matrix.tx, matrix.ty, matrix.rotation, matrix.scaleX, matrix.scaleY, point);
            }
            else
            {
                TransformXY(px, py, gameObject.x, gameObject.y, gameObject.rotation, gameObject.scaleX, gameObject.scaleY, point);
            }

            if (this.pointWithinHitArea(gameObject, point.x, point.y))
            {
                output.push(gameObject);
            }
        }

        return output;
    },

    /*
    debugHitTest: function (x, y, gameObject, camera, output)
    {
        if (output === undefined) { output = this._tempHitTest; }

        var tempPoint = this._tempPoint;

        //  Stores the translated world point inside of tempPoint
        camera.getWorldPoint(x, y, tempPoint);

        var point = { x: 0, y: 0 };

        var res = this.game.config.resolution;

        var matrix = this._tempMatrix;

        var px = tempPoint.x * res + (camera.scrollX * gameObject.scrollFactorX) - camera.scrollX;
        var py = tempPoint.y * res + (camera.scrollY * gameObject.scrollFactorY) - camera.scrollY;

        gameObject.getWorldTransformMatrix(matrix);

        // matrix.invert();
        matrix.transformPoint(px, py, point);

        // var tt = new TransformMatrix();

        // tt.translate(px, py);

        // matrix.invert();
        // matrix.multiply(tt);

        // TransformXY(px, py, matrix.tx, matrix.ty, matrix.rotation, matrix.scaleX, matrix.scaleY, point);

        // point.x = px;
        // point.y = py;

        return [ matrix, point, this.pointWithinHitArea(gameObject, point.x, point.y) ];
    },
    */

    /**
     * x/y MUST be translated before being passed to this function,
     * unless the gameObject is guaranteed to not be rotated or scaled in any way.
     *
     * @method Phaser.Input.InputManager#pointWithinHitArea
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - [description]
     * @param {number} x - [description]
     * @param {number} y - [description]
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
     * @param {Phaser.Input.InteractiveObject} object - [description]
     * @param {number} x - [description]
     * @param {number} y - [description]
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
     * @param {number} pageX - [description]
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
     * @param {number} pageY - [description]
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
