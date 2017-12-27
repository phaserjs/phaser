var Class = require('../../utils/Class');
var Features = require('../../device/Features');
var MouseEvents = require('./events');

//  https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
//  https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md

var MouseManager = new Class({

    initialize:

    function MouseManager (inputManager)
    {
        this.manager = inputManager;

        // @property {boolean} capture - If true the DOM mouse events will have event.preventDefault applied to them, if false they will propagate fully.
        this.capture = true;

        this.enabled = false;

        this.target;

        this.handler;

        /**
         * @property {boolean} locked - If the mouse has been pointer locked successfully this will
         * be set to true.
         */
        this.locked = false;
    },

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
     * This is classically known as 'FPS controls', where the pointer can't leave the browser until
     * the user presses an exit key. If the browser successfully enters a locked state, a
     * 'POINTER_LOCK_CHANGE_EVENT' will be dispatched - from the game's input manager - with an
     * `isPointerLocked` property.
     * It is important to note that pointer lock can only be enabled after an 'engagement gesture',
     * see: https://w3c.github.io/pointerlock/#dfn-engagement-gesture.
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
     * @param {Event} event - The native event from the browser.
     */
    pointerLockChange: function (event)
    {
        var element = this.target;
        this.locked = document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element
            ? true : false;
        this.manager.queue.push(event);
    },

    /**
     * If the browser supports pointer lock, this will request that the pointer lock is released. If
     * the browser successfully enters a locked state, a 'POINTER_LOCK_CHANGE_EVENT' will be
     * dispatched - from the game's input manager - with an `isPointerLocked` property.
     */
    releasePointerLock: function ()
    {
        if (Features.pointerLock)
        {
            document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
            document.exitPointerLock();
        }
    },

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
                if (event.preventDefaulted)
                {
                    // Do nothing if event already handled
                    return;
                }

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
                if (event.preventDefaulted)
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
    }

});

module.exports = MouseManager;
