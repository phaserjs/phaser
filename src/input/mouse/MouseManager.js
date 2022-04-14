/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Features = require('../../device/Features');
var InputEvents = require('../events');
var NOOP = require('../../utils/NOOP');

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
         * If `true` the DOM `mousedown` event will have `preventDefault` set.
         *
         * @name Phaser.Input.Mouse.MouseManager#preventDefaultDown
         * @type {boolean}
         * @default true
         * @since 3.50.0
         */
        this.preventDefaultDown = true;

        /**
         * If `true` the DOM `mouseup` event will have `preventDefault` set.
         *
         * @name Phaser.Input.Mouse.MouseManager#preventDefaultUp
         * @type {boolean}
         * @default true
         * @since 3.50.0
         */
        this.preventDefaultUp = true;

        /**
         * If `true` the DOM `mousemove` event will have `preventDefault` set.
         *
         * @name Phaser.Input.Mouse.MouseManager#preventDefaultMove
         * @type {boolean}
         * @default true
         * @since 3.50.0
         */
        this.preventDefaultMove = true;

        /**
         * If `true` the DOM `wheel` event will have `preventDefault` set.
         *
         * @name Phaser.Input.Mouse.MouseManager#preventDefaultWheel
         * @type {boolean}
         * @default true
         * @since 3.50.0
         */
        this.preventDefaultWheel = false;

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
         * The Mouse target, as defined in the Game Config.
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
         * The Mouse Down Event handler specifically for events on the Window.
         * This function is sent the native DOM MouseEvent.
         * Initially empty and bound in the `startListeners` method.
         *
         * @name Phaser.Input.Mouse.MouseManager#onMouseDownWindow
         * @type {function}
         * @since 3.17.0
         */
        this.onMouseDownWindow = NOOP;

        /**
         * The Mouse Up Event handler specifically for events on the Window.
         * This function is sent the native DOM MouseEvent.
         * Initially empty and bound in the `startListeners` method.
         *
         * @name Phaser.Input.Mouse.MouseManager#onMouseUpWindow
         * @type {function}
         * @since 3.17.0
         */
        this.onMouseUpWindow = NOOP;

        /**
         * The Mouse Over Event handler.
         * This function is sent the native DOM MouseEvent.
         * Initially empty and bound in the `startListeners` method.
         *
         * @name Phaser.Input.Mouse.MouseManager#onMouseOver
         * @type {function}
         * @since 3.16.0
         */
        this.onMouseOver = NOOP;

        /**
         * The Mouse Out Event handler.
         * This function is sent the native DOM MouseEvent.
         * Initially empty and bound in the `startListeners` method.
         *
         * @name Phaser.Input.Mouse.MouseManager#onMouseOut
         * @type {function}
         * @since 3.16.0
         */
        this.onMouseOut = NOOP;

        /**
         * The Mouse Wheel Event handler.
         * This function is sent the native DOM MouseEvent.
         * Initially empty and bound in the `startListeners` method.
         *
         * @name Phaser.Input.Mouse.MouseManager#onMouseWheel
         * @type {function}
         * @since 3.18.0
         */
        this.onMouseWheel = NOOP;

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

        /**
         * Are the event listeners hooked into `window.top` or `window`?
         *
         * This is set during the `boot` sequence. If the browser does not have access to `window.top`,
         * such as in cross-origin iframe environments, this property gets set to `false` and the events
         * are hooked into `window` instead.
         *
         * @name Phaser.Input.Mouse.MouseManager#isTop
         * @type {boolean}
         * @readonly
         * @since 3.50.0
         */
        this.isTop = true;

        inputManager.events.once(InputEvents.MANAGER_BOOT, this.boot, this);
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
        this.passive = config.inputMousePassive;

        this.preventDefaultDown = config.inputMousePreventDefaultDown;
        this.preventDefaultUp = config.inputMousePreventDefaultUp;
        this.preventDefaultMove = config.inputMousePreventDefaultMove;
        this.preventDefaultWheel = config.inputMousePreventDefaultWheel;

        if (!this.target)
        {
            this.target = this.manager.game.canvas;
        }
        else if (typeof this.target === 'string')
        {
            this.target = document.getElementById(this.target);
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
     * Attempts to disable the context menu from appearing if you right-click on the game canvas, or specified input target.
     *
     * Works by listening for the `contextmenu` event and prevent defaulting it.
     *
     * Use this if you need to enable right-button mouse support in your game, and the context
     * menu keeps getting in the way.
     *
     * @method Phaser.Input.Mouse.MouseManager#disableContextMenu
     * @since 3.0.0
     *
     * @return {this} This Mouse Manager instance.
     */
    disableContextMenu: function ()
    {
        this.target.addEventListener('contextmenu', function (event)
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
     * Note for Firefox: There is a bug in certain Firefox releases that cause native DOM events like
     * `mousemove` to fire continuously when in pointer lock mode. You can get around this by setting
     * `this.preventDefaultMove` to `false` in this class. You may also need to do the same for
     * `preventDefaultDown` and/or `preventDefaultUp`. Please test combinations of these if you encounter
     * the error.
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
        var target = this.target;

        if (!target)
        {
            return;
        }

        var _this = this;
        var manager = this.manager;
        var canvas = manager.canvas;
        var autoFocus = (window && window.focus && manager.game.config.autoFocus);

        this.onMouseMove = function (event)
        {
            if (!event.defaultPrevented && _this.enabled && manager && manager.enabled)
            {
                manager.onMouseMove(event);

                if (_this.preventDefaultMove)
                {
                    event.preventDefault();
                }
            }
        };

        this.onMouseDown = function (event)
        {
            if (autoFocus)
            {
                window.focus();
            }

            if (!event.defaultPrevented && _this.enabled && manager && manager.enabled)
            {
                manager.onMouseDown(event);

                if (_this.preventDefaultDown && event.target === canvas)
                {
                    event.preventDefault();
                }
            }
        };

        this.onMouseDownWindow = function (event)
        {
            if (!event.defaultPrevented && _this.enabled && manager && manager.enabled && event.target !== canvas)
            {
                //  Only process the event if the target isn't the canvas
                manager.onMouseDown(event);
            }
        };

        this.onMouseUp = function (event)
        {
            if (!event.defaultPrevented && _this.enabled && manager && manager.enabled)
            {
                manager.onMouseUp(event);

                if (_this.preventDefaultUp && event.target === canvas)
                {
                    event.preventDefault();
                }
            }
        };

        this.onMouseUpWindow = function (event)
        {
            if (!event.defaultPrevented && _this.enabled && manager && manager.enabled && event.target !== canvas)
            {
                //  Only process the event if the target isn't the canvas
                manager.onMouseUp(event);
            }
        };

        this.onMouseOver = function (event)
        {
            if (!event.defaultPrevented && _this.enabled && manager && manager.enabled)
            {
                manager.setCanvasOver(event);
            }
        };

        this.onMouseOut = function (event)
        {
            if (!event.defaultPrevented && _this.enabled && manager && manager.enabled)
            {
                manager.setCanvasOut(event);
            }
        };

        this.onMouseWheel = function (event)
        {
            if (!event.defaultPrevented && _this.enabled && manager && manager.enabled)
            {
                manager.onMouseWheel(event);
            }

            if (_this.preventDefaultWheel && event.target === canvas)
            {
                event.preventDefault();
            }
        };

        var passive = { passive: true };

        target.addEventListener('mousemove', this.onMouseMove);
        target.addEventListener('mousedown', this.onMouseDown);
        target.addEventListener('mouseup', this.onMouseUp);
        target.addEventListener('mouseover', this.onMouseOver, passive);
        target.addEventListener('mouseout', this.onMouseOut, passive);

        if (this.preventDefaultWheel)
        {
            target.addEventListener('wheel', this.onMouseWheel, { passive: false });
        }
        else
        {
            target.addEventListener('wheel', this.onMouseWheel, passive);
        }

        if (window && manager.game.config.inputWindowEvents)
        {
            try
            {
                window.top.addEventListener('mousedown', this.onMouseDownWindow, passive);
                window.top.addEventListener('mouseup', this.onMouseUpWindow, passive);
            }
            catch (exception)
            {
                window.addEventListener('mousedown', this.onMouseDownWindow, passive);
                window.addEventListener('mouseup', this.onMouseUpWindow, passive);

                this.isTop = false;
            }
        }

        if (Features.pointerLock)
        {
            this.pointerLockChange = function (event)
            {
                var element = _this.target;

                _this.locked = (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) ? true : false;

                manager.onPointerLockChange(event);
            };

            document.addEventListener('pointerlockchange', this.pointerLockChange, true);
            document.addEventListener('mozpointerlockchange', this.pointerLockChange, true);
            document.addEventListener('webkitpointerlockchange', this.pointerLockChange, true);
        }

        this.enabled = true;
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
        target.removeEventListener('mouseover', this.onMouseOver);
        target.removeEventListener('mouseout', this.onMouseOut);

        if (window)
        {
            target = (this.isTop) ? window.top : window;

            target.removeEventListener('mousedown', this.onMouseDownWindow);
            target.removeEventListener('mouseup', this.onMouseUpWindow);
        }

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
