/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Features = require('../../device/Features');
var NOOP = require('../../utils/Class');

var Linear = require('../../math/Linear');
var FuzzyEqual = require('../../math/fuzzy/Equal');

//  https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
//  https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md

/**
 * @classdesc
 * The Mouse Manager is a helper class that belongs to the Input Manager.
 * 
 * Its role is to listen for native DOM Mouse Events and then pass them onto the Input Manager for further processing.
 * 
 * You do not need to create this class directly, the Input Manager will create an instance of it automatically.
 *
 * @class MouseManager
 * @memberof Phaser.Input.Mouse
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Input.InputManager} inputManager - A reference to the Input Manager.
 */
var MouseManager = new Class({

    initialize:

    function MouseManager (inputManager)
    {
        /**
         * A reference to the Input Manager.
         *
         * @name Phaser.Input.Mouse.MouseManager#manager
         * @type {Phaser.Input.InputManager}
         * @since 3.0.0
         */
        this.manager = inputManager;

        /**
         * If true the DOM mouse events will have event.preventDefault applied to them, if false they will propagate fully.
         *
         * @name Phaser.Input.Mouse.MouseManager#capture
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.capture = true;

        /**
         * A boolean that controls if the Mouse Manager is enabled or not.
         * Can be toggled on the fly.
         *
         * @name Phaser.Input.Mouse.MouseManager#enabled
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.enabled = false;

        /**
         * The Touch Event target, as defined in the Game Config.
         * Typically the canvas to which the game is rendering, but can be any interactive DOM element.
         *
         * @name Phaser.Input.Mouse.MouseManager#target
         * @type {any}
         * @since 3.0.0
         */
        this.target;

        /**
         * If the mouse has been pointer locked successfully this will be set to true.
         *
         * @name Phaser.Input.Mouse.MouseManager#locked
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.locked = false;

        /**
         * The Mouse Move Event handler.
         * This function is sent the native DOM MouseEvent.
         * Initially empty and bound in the `startListeners` method.
         *
         * @name Phaser.Input.Mouse.MouseManager#onMouseMove
         * @type {function}
         * @since 3.10.0
         */
        this.onMouseMove = NOOP;

        /**
         * The Mouse Down Event handler.
         * This function is sent the native DOM MouseEvent.
         * Initially empty and bound in the `startListeners` method.
         *
         * @name Phaser.Input.Mouse.MouseManager#onMouseDown
         * @type {function}
         * @since 3.10.0
         */
        this.onMouseDown = NOOP;

        /**
         * The Mouse Up Event handler.
         * This function is sent the native DOM MouseEvent.
         * Initially empty and bound in the `startListeners` method.
         *
         * @name Phaser.Input.Mouse.MouseManager#onMouseUp
         * @type {function}
         * @since 3.10.0
         */
        this.onMouseUp = NOOP;

        /**
         * Internal pointerLockChange handler.
         * This function is sent the native DOM MouseEvent.
         * Initially empty and bound in the `startListeners` method.
         *
         * @name Phaser.Input.Mouse.MouseManager#pointerLockChange
         * @type {function}
         * @since 3.0.0
         */
        this.pointerLockChange = NOOP;

        this.prevTime = 0;
        this.currentTime = 0;
        this.deltaTime = 0;
        this.deltaX = 0;
        this.deltaY = 0;

        this.mx = 0;
        this.my = 0;
        this.prevX = -1;
        this.prevY = -1;
        this.currentX = -1;
        this.currentY = -1;
        this.isMoving = false;

        this.upX = 0;
        this.upY = 0;

        this.counter = 0;

        this.moveFrame = 0;

        inputManager.events.once('boot', this.boot, this);
    },

    /**
     * The Touch Manager boot process.
     *
     * @method Phaser.Input.Mouse.MouseManager#boot
     * @private
     * @since 3.0.0
     */
    boot: function ()
    {
        var config = this.manager.config;

        this.enabled = config.inputMouse;
        this.target = config.inputMouseEventTarget;
        this.capture = config.inputMouseCapture;

        if (!this.target)
        {
            this.target = this.manager.game.canvas;
        }

        if (config.disableContextMenu)
        {
            this.disableContextMenu();
        }

        if (this.enabled && this.target)
        {
            this.startListeners();
        }
    },

    /**
     * Attempts to disable the context menu from appearing if you right-click on the browser.
     * 
     * Works by listening for the `contextmenu` event and prevent defaulting it.
     * 
     * Use this if you need to enable right-button mouse support in your game, and the browser
     * menu keeps getting in the way.
     *
     * @method Phaser.Input.Mouse.MouseManager#disableContextMenu
     * @since 3.0.0
     *
     * @return {Phaser.Input.Mouse.MouseManager} This Mouse Manager instance.
     */
    disableContextMenu: function ()
    {
        document.body.addEventListener('contextmenu', function (event)
        {
            event.preventDefault();
            return false;
        });

        return this;
    },

    /**
     * If the browser supports it, you can request that the pointer be locked to the browser window.
     *
     * This is classically known as 'FPS controls', where the pointer can't leave the browser until
     * the user presses an exit key.
     *
     * If the browser successfully enters a locked state, a `POINTER_LOCK_CHANGE_EVENT` will be dispatched,
     * from the games Input Manager, with an `isPointerLocked` property.
     *
     * It is important to note that pointer lock can only be enabled after an 'engagement gesture',
     * see: https://w3c.github.io/pointerlock/#dfn-engagement-gesture.
     *
     * @method Phaser.Input.Mouse.MouseManager#requestPointerLock
     * @since 3.0.0
     */
    requestPointerLock: function ()
    {
        if (Features.pointerLock)
        {
            var element = this.target;

            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

            element.requestPointerLock();
        }
    },

    /**
     * If the browser supports pointer lock, this will request that the pointer lock is released. If
     * the browser successfully enters a locked state, a 'POINTER_LOCK_CHANGE_EVENT' will be
     * dispatched - from the game's input manager - with an `isPointerLocked` property.
     *
     * @method Phaser.Input.Mouse.MouseManager#releasePointerLock
     * @since 3.0.0
     */
    releasePointerLock: function ()
    {
        if (Features.pointerLock)
        {
            document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
            document.exitPointerLock();
        }
    },

    /**
     * Starts the Mouse Event listeners running.
     * This is called automatically and does not need to be manually invoked.
     *
     * @method Phaser.Input.Mouse.MouseManager#startListeners
     * @since 3.0.0
     */
    startListeners: function ()
    {
        var _this = this;

        this.onMouseMove = function (event)
        {
            if (event.defaultPrevented || !_this.enabled || !_this.manager)
            {
                // Do nothing if event already handled
                return;
            }
    
            _this.currentTime = event.timeStamp;

            //  Apply smoothing

            // var x = event.pageX - _this.manager.bounds.left;
            // var y = event.pageY - _this.manager.bounds.top;

            var x = event.pageX - _this.manager.bounds.left;
            var y = event.pageY - _this.manager.bounds.top;
            var a = 0.2;

            if (_this.prevX === -1)
            {
                _this.currentX = x;
                _this.currentY = y;

                _this.prevX = x;
                _this.prevY = y;
            }
            else
            {
                _this.prevX = _this.currentX;
                _this.prevY = _this.currentY;
    
                // _this.currentX = x * a + _this.prevX * (1 - a);
                // _this.currentY = y * a + _this.prevY * (1 - a);

                _this.currentX = x;
                _this.currentY = y;
            }

            _this.deltaX = _this.currentX - _this.prevX;
            _this.deltaY = _this.currentY - _this.prevY;

            // console.log('move', _this.moveFrame, _this.deltaX, _this.deltaY);

            // _this.mx = Math.max(Math.abs(_this.deltaX), _this.mx);
            // _this.my = Math.max(Math.abs(_this.deltaY), _this.my);

            _this.moveFrame = _this.manager.game.frame;

            _this.counter++;

            _this.manager.queueMouseMove(event);
    
            if (_this.capture)
            {
                event.preventDefault();
            }
        };

        this.onMouseDown = function (event)
        {
            if (event.defaultPrevented || !_this.enabled || !_this.manager)
            {
                // Do nothing if event already handled
                return;
            }
    
            _this.currentTime = event.timeStamp;

            console.log('mdown', _this.moveFrame, _this.manager.game.frame, '=', _this.deltaX, _this.deltaY);

            // _this.prevX = _this.currentX;
            // _this.prevY = _this.currentY;

            // _this.currentX = event.pageX - _this.manager.bounds.left;
            // _this.currentY = event.pageY - _this.manager.bounds.top;

            // _this.deltaX = _this.currentX - _this.prevX;
            // _this.deltaY = _this.currentY - _this.prevY;

            _this.manager.queueMouseDown(event);
    
            if (_this.capture)
            {
                event.preventDefault();
            }
        };

        this.onMouseUp = function (event)
        {
            if (event.defaultPrevented || !_this.enabled || !_this.manager)
            {
                // Do nothing if event already handled
                return;
            }
    
            _this.currentTime = event.timeStamp;

            _this.upX = _this.deltaX;
            _this.upY = _this.deltaY;

            console.log('mup', _this.moveFrame, _this.manager.game.frame, '=', _this.deltaX, _this.deltaY, 'mc', _this.counter);

            // _this.prevX = _this.currentX;
            // _this.prevY = _this.currentY;

            // _this.currentX = event.pageX - _this.manager.bounds.left;
            // _this.currentY = event.pageY - _this.manager.bounds.top;

            // _this.deltaX = _this.currentX - _this.prevX;
            // _this.deltaY = _this.currentY - _this.prevY;

            _this.manager.queueMouseUp(event);
    
            if (_this.capture)
            {
                event.preventDefault();
            }
        };

        var target = this.target;

        if (!target)
        {
            return;
        }

        var passive = { passive: true };
        var nonPassive = { passive: false };

        if (this.capture)
        {
            target.addEventListener('mousemove', this.onMouseMove, nonPassive);
            target.addEventListener('mousedown', this.onMouseDown, nonPassive);
            target.addEventListener('mouseup', this.onMouseUp, nonPassive);
        }
        else
        {
            target.addEventListener('mousemove', this.onMouseMove, passive);
            target.addEventListener('mousedown', this.onMouseDown, passive);
            target.addEventListener('mouseup', this.onMouseUp, passive);
        }

        if (Features.pointerLock)
        {
            this.pointerLockChange = function (event)
            {
                var element = _this.target;

                _this.locked = (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) ? true : false;
        
                _this.manager.queue.push(event);
            };

            document.addEventListener('pointerlockchange', this.pointerLockChange, true);
            document.addEventListener('mozpointerlockchange', this.pointerLockChange, true);
            document.addEventListener('webkitpointerlockchange', this.pointerLockChange, true);
        }

        this.enabled = true;
    },

    pre: function ()
    {
        //  calculate deltas
        this.deltaTime = this.currentTime - this.prevTime;
    },

    post: function ()
    {
        return;

        //  reset
        this.prevTime = this.currentTime;

        if (this.deltaX !== 0)
        {
            this.deltaX *= 0.95;

            // this.deltaX = Linear(0, this.deltaX, 0.999);

            if (FuzzyEqual(this.deltaX, 0, 0.1))
            {
                this.deltaX = 0;
            }
        }

        if (this.deltaY !== 0)
        {
            this.deltaY *= 0.95;

            // this.deltaY = Linear(0, this.deltaY, 0.999);

            if (FuzzyEqual(this.deltaY, 0, 0.1))
            {
                this.deltaY = 0;
            }
        }

        this.isMoving = (this.deltaX !== 0 || this.deltaY !== 0);
    },

    /**
     * Stops the Mouse Event listeners.
     * This is called automatically and does not need to be manually invoked.
     *
     * @method Phaser.Input.Mouse.MouseManager#stopListeners
     * @since 3.0.0
     */
    stopListeners: function ()
    {
        var target = this.target;

        target.removeEventListener('mousemove', this.onMouseMove);
        target.removeEventListener('mousedown', this.onMouseDown);
        target.removeEventListener('mouseup', this.onMouseUp);

        if (Features.pointerLock)
        {
            document.removeEventListener('pointerlockchange', this.pointerLockChange, true);
            document.removeEventListener('mozpointerlockchange', this.pointerLockChange, true);
            document.removeEventListener('webkitpointerlockchange', this.pointerLockChange, true);
        }
    },

    /**
     * Destroys this Mouse Manager instance.
     *
     * @method Phaser.Input.Mouse.MouseManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.stopListeners();

        this.target = null;
        this.enabled = false;
        this.manager = null;
    }

});

module.exports = MouseManager;
