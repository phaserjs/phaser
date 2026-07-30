/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var EE = require('eventemitter3');
var PluginCache = require('../plugins/PluginCache');

/**
 * @classdesc
 * EventEmitter is a Scene Systems plugin compatible wrapper around the `eventemitter3` library,
 * providing a full-featured event emitter used throughout Phaser for event-driven communication
 * between game objects, scenes, and systems.
 *
 * Every Scene has an instance of this class available via `scene.events`, and many Phaser objects
 * extend or embed it to dispatch and receive events. It supports persistent listeners via `on` /
 * `addListener`, one-time listeners that auto-remove after firing via `once`, and listener removal
 * via `off` / `removeListener`.
 *
 * You can also instantiate it directly when you need a standalone event bus within your own code.
 *
 * @class EventEmitter
 * @memberof Phaser.Events
 * @constructor
 * @since 3.0.0
 */
var EventEmitter = new Class({

    Extends: EE,

    initialize:

    function EventEmitter ()
    {
        EE.call(this);
    },

    /**
     * Removes all listeners from this EventEmitter. This method is called automatically
     * by the Scene Systems when the parent Scene shuts down, ensuring that all event
     * bindings are cleared and no stale references remain.
     *
     * @method Phaser.Events.EventEmitter#shutdown
     * @since 3.0.0
     */
    shutdown: function ()
    {
        this.removeAllListeners();
    },

    /**
     * Removes all listeners from this EventEmitter and prepares it for garbage collection.
     * This method is called automatically when the parent object is destroyed and should
     * not be called directly unless you are tearing down the emitter manually.
     *
     * @method Phaser.Events.EventEmitter#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.removeAllListeners();
    }

});

/**
 * Return an array listing the events for which the emitter has registered listeners.
 *
 * @method Phaser.Events.EventEmitter#eventNames
 * @since 3.0.0
 *
 * @return {Array.<string|symbol>}
 */

/**
 * Return the listeners registered for a given event.
 *
 * @method Phaser.Events.EventEmitter#listeners
 * @since 3.0.0
 *
 * @param {(string|symbol)} event - The event name.
 *
 * @return {Function[]} The registered listeners.
 */

/**
 * Return the number of listeners listening to a given event.
 *
 * @method Phaser.Events.EventEmitter#listenerCount
 * @since 3.0.0
 *
 * @param {(string|symbol)} event - The event name.
 *
 * @return {number} The number of listeners.
 */

/**
 * Calls each of the listeners registered for a given event.
 *
 * @method Phaser.Events.EventEmitter#emit
 * @since 3.0.0
 *
 * @param {(string|symbol)} event - The event name.
 * @param {...*} [args] - Additional arguments that will be passed to the event handler.
 *
 * @return {boolean} `true` if the event had listeners, else `false`.
 */

/**
 * Add a listener for a given event.
 *
 * @method Phaser.Events.EventEmitter#on
 * @since 3.0.0
 *
 * @param {(string|symbol)} event - The event name.
 * @param {function} fn - The listener function.
 * @param {*} [context=this] - The context to invoke the listener with.
 *
 * @return {this} `this`.
 */

/**
 * Add a listener for a given event.
 *
 * @method Phaser.Events.EventEmitter#addListener
 * @since 3.0.0
 *
 * @param {(string|symbol)} event - The event name.
 * @param {function} fn - The listener function.
 * @param {*} [context=this] - The context to invoke the listener with.
 *
 * @return {this} `this`.
 */

/**
 * Add a one-time listener for a given event. The listener is automatically removed
 * the first time the event is emitted, so it will never be called more than once.
 *
 * @method Phaser.Events.EventEmitter#once
 * @since 3.0.0
 *
 * @param {(string|symbol)} event - The event name.
 * @param {function} fn - The listener function.
 * @param {*} [context=this] - The context to invoke the listener with.
 *
 * @return {this} `this`.
 */

/**
 * Remove the listeners of a given event.
 *
 * @method Phaser.Events.EventEmitter#removeListener
 * @since 3.0.0
 *
 * @param {(string|symbol)} event - The event name.
 * @param {function} [fn] - Only remove the listeners that match this function.
 * @param {*} [context] - Only remove the listeners that have this context.
 * @param {boolean} [once] - Only remove one-time listeners.
 *
 * @return {this} `this`.
 */

/**
 * Remove the listeners of a given event.
 *
 * @method Phaser.Events.EventEmitter#off
 * @since 3.0.0
 *
 * @param {(string|symbol)} event - The event name.
 * @param {function} [fn] - Only remove the listeners that match this function.
 * @param {*} [context] - Only remove the listeners that have this context.
 * @param {boolean} [once] - Only remove one-time listeners.
 *
 * @return {this} `this`.
 */

/**
 * Remove all listeners, or those of the specified event.
 *
 * @method Phaser.Events.EventEmitter#removeAllListeners
 * @since 3.0.0
 *
 * @param {(string|symbol)} [event] - The event name.
 *
 * @return {this} `this`.
 */

PluginCache.register('EventEmitter', EventEmitter, 'events');

module.exports = EventEmitter;
