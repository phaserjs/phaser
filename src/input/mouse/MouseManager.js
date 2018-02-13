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
 * [description]
 *
 * @class MouseManager
 * @memberOf Phaser.Input.Mouse
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Input.InputManager} inputManager - [description]
 */
var MouseManager = new Class({

    initialize:

    function MouseManager (inputManager)
    {
        /**
         * [description]
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
         * [description]
         *
         * @name Phaser.Input.Mouse.MouseManager#enabled
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.enabled = false;

        /**
         * [description]
         *
         * @name Phaser.Input.Mouse.MouseManager#target
         * @type {null}
         * @since 3.0.0
         */
        this.target;

        /**
         * [description]
         *
         * @name Phaser.Input.Mouse.MouseManager#handler
         * @type {null}
         * @since 3.0.0
         */
        this.handler;

        /**
         * If the mouse has been pointer locked successfully this will be set to true.
         *
         * @name Phaser.Input.Mouse.MouseManager#locked
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.locked = false;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Mouse.MouseManager#boot
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
     * [description]
     *
     * @method Phaser.Input.Mouse.MouseManager#disableContextMenu
     * @since 3.0.0
     *
     * @return {Phaser.Input.Mouse.MouseManager} [description]
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
     * @param {Event} event - The native event from the browser.
     */
    pointerLockChange: function (event)
    {
        var element = this.target;

        this.locked = (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) ? true : false;

        this.manager.queue.push(event);
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
     * [description]
     *
     * @method Phaser.Input.Mouse.MouseManager#startListeners
     * @since 3.0.0
     */
    startListeners: function ()
    {
        var queue = this.manager.queue;
        var target = this.target;

        var passive = { passive: true };
        var nonPassive = { passive: false };

        var handler;

        if (this.capture)
        {
            handler = function (event)
            {
                if (event.defaultPrevented)
                {
                    // Do nothing if event already handled
                    return;
                }

                // console.log('mouse', event);

                queue.push(event);

                event.preventDefault();
            };

            target.addEventListener('mousemove', handler, nonPassive);
            target.addEventListener('mousedown', handler, nonPassive);
            target.addEventListener('mouseup', handler, nonPassive);
        }
        else
        {
            handler = function (event)
            {
                if (event.defaultPrevented)
                {
                    // Do nothing if event already handled
                    return;
                }

                queue.push(event);
            };

            target.addEventListener('mousemove', handler, passive);
            target.addEventListener('mousedown', handler, passive);
            target.addEventListener('mouseup', handler, passive);
        }

        this.handler = handler;

        if (Features.pointerLock)
        {
            this.pointerLockChange = this.pointerLockChange.bind(this);

            document.addEventListener('pointerlockchange', this.pointerLockChange, true);
            document.addEventListener('mozpointerlockchange', this.pointerLockChange, true);
            document.addEventListener('webkitpointerlockchange', this.pointerLockChange, true);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Mouse.MouseManager#stopListeners
     * @since 3.0.0
     */
    stopListeners: function ()
    {
        var target = this.target;

        target.removeEventListener('mousemove', this.handler);
        target.removeEventListener('mousedown', this.handler);
        target.removeEventListener('mouseup', this.handler);

        if (Features.pointerLock)
        {
            document.removeEventListener('pointerlockchange', this.pointerLockChange, true);
            document.removeEventListener('mozpointerlockchange', this.pointerLockChange, true);
            document.removeEventListener('webkitpointerlockchange', this.pointerLockChange, true);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Mouse.MouseManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.stopListeners();

        this.manager = null;
    }

});

module.exports = MouseManager;
