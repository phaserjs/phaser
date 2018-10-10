/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Features = require('../../device/Features');

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

        if (this.enabled)
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
     * Internal pointerLockChange handler.
     *
     * @method Phaser.Input.Mouse.MouseManager#pointerLockChange
     * @since 3.0.0
     *
     * @param {MouseEvent} event - The native event from the browser.
     */

    /*
    pointerLockChange: function (event)
    {
        var element = this.target;

        this.locked = (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) ? true : false;

        this.manager.queue.push(event);
    },
    */

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
     * The Mouse Move Event Handler.
     *
     * @method Phaser.Input.Mouse.MouseManager#onMouseMove
     * @since 3.10.0
     *
     * @param {MouseEvent} event - The native DOM Mouse Move Event.
     */

    /*
    onMouseMove: function (event)
    {
        if (event.defaultPrevented || !this.enabled || !this.manager)
        {
            // Do nothing if event already handled
            return;
        }

        this.manager.queueMouseMove(event);

        if (this.capture)
        {
            event.preventDefault();
        }
    },
    */

    /**
     * The Mouse Down Event Handler.
     *
     * @method Phaser.Input.Mouse.MouseManager#onMouseDown
     * @since 3.10.0
     *
     * @param {MouseEvent} event - The native DOM Mouse Down Event.
     */

    /*
    onMouseDown: function (event)
    {
        if (event.defaultPrevented || !this.enabled)
        {
            // Do nothing if event already handled
            return;
        }

        this.manager.queueMouseDown(event);

        if (this.capture)
        {
            event.preventDefault();
        }
    },
    */

    /**
     * The Mouse Up Event Handler.
     *
     * @method Phaser.Input.Mouse.MouseManager#onMouseUp
     * @since 3.10.0
     *
     * @param {MouseEvent} event - The native DOM Mouse Up Event.
     */

    /*
    onMouseUp: function (event)
    {
        if (event.defaultPrevented || !this.enabled)
        {
            // Do nothing if event already handled
            return;
        }

        this.manager.queueMouseUp(event);

        if (this.capture)
        {
            event.preventDefault();
        }
    },
    */

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

        var onMouseMove = function (event)
        {
            if (event.defaultPrevented || !_this.enabled || !_this.manager)
            {
                // Do nothing if event already handled
                return;
            }
    
            _this.manager.queueMouseMove(event);
    
            if (_this.capture)
            {
                event.preventDefault();
            }
        };

        var onMouseDown = function (event)
        {
            if (event.defaultPrevented || !_this.enabled || !_this.manager)
            {
                // Do nothing if event already handled
                return;
            }
    
            _this.manager.queueMouseDown(event);
    
            if (_this.capture)
            {
                event.preventDefault();
            }
        };

        var onMouseUp = function (event)
        {
            if (event.defaultPrevented || !_this.enabled || !_this.manager)
            {
                // Do nothing if event already handled
                return;
            }
    
            _this.manager.queueMouseUp(event);
    
            if (_this.capture)
            {
                event.preventDefault();
            }
        };

        this.onMouseMove = onMouseMove;
        this.onMouseDown = onMouseDown;
        this.onMouseUp = onMouseUp;

        var target = this.target;
        var passive = { passive: true };
        var nonPassive = { passive: false };

        target.addEventListener('mousemove', onMouseMove, (this.capture) ? nonPassive : passive);
        target.addEventListener('mousedown', onMouseDown, (this.capture) ? nonPassive : passive);
        target.addEventListener('mouseup', onMouseUp, (this.capture) ? nonPassive : passive);

        if (Features.pointerLock)
        {
            var onPointerLockChange = function (event)
            {
                var element = _this.target;

                _this.locked = (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) ? true : false;
        
                _this.manager.queue.push(event);
            };

            this.pointerLockChange = onPointerLockChange;

            document.addEventListener('pointerlockchange', onPointerLockChange, true);
            document.addEventListener('mozpointerlockchange', onPointerLockChange, true);
            document.addEventListener('webkitpointerlockchange', onPointerLockChange, true);
        }
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
        this.manager = null;
    }

});

module.exports = MouseManager;
