/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var EE = require('eventemitter3');
var PluginManager = require('../boot/PluginManager');

/**
 * @namespace Phaser.Events
 */

/**
 * @classdesc
 * EventEmitter is a Scene Systems plugin compatible version of eventemitter3.
 *
 * @class EventEmitter
 * @memberOf Phaser.Events
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
     * Removes all listeners.
     *
     * @method Phaser.Events.EventEmitter#shutdown
     * @since 3.0.0
     */
    shutdown: function ()
    {
        this.removeAllListeners();
    },

    /**
     * Removes all listeners.
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
 * @return {array}
 */

/**
 * Return the listeners registered for a given event.
 *
 * @method Phaser.Events.EventEmitter#listeners
 * @since 3.0.0
 *
 * @param {(string|symbol)} event - The event name.
 *
 * @return {array} The registered listeners.
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
 * @return {Phaser.Events.EventEmitter} `this`.
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
 * @return {Phaser.Events.EventEmitter} `this`.
 */

/**
 * Add a one-time listener for a given event.
 *
 * @method Phaser.Events.EventEmitter#once
 * @since 3.0.0
 *
 * @param {(string|symbol)} event - The event name.
 * @param {function} fn - The listener function.
 * @param {*} [context=this] - The context to invoke the listener with.
 *
 * @return {Phaser.Events.EventEmitter} `this`.
 */

/**
 * Remove the listeners of a given event.
 *
 * @method Phaser.Events.EventEmitter#removeListener
 * @since 3.0.0
 *
 * @param {(string|symbol)} event - The event name.
 * @param {function} fn - Only remove the listeners that match this function.
 * @param {*} context - Only remove the listeners that have this context.
 * @param {boolean} once - Only remove one-time listeners.
 *
 * @return {Phaser.Events.EventEmitter} `this`.
 */

/**
 * Remove the listeners of a given event.
 *
 * @method Phaser.Events.EventEmitter#off
 * @since 3.0.0
 *
 * @param {(string|symbol)} event - The event name.
 * @param {function} fn - Only remove the listeners that match this function.
 * @param {*} context - Only remove the listeners that have this context.
 * @param {boolean} once - Only remove one-time listeners.
 *
 * @return {Phaser.Events.EventEmitter} `this`.
 */

/**
 * Remove all listeners, or those of the specified event.
 *
 * @method Phaser.Events.EventEmitter#removeAllListeners
 * @since 3.0.0
 *
 * @param {(string|symbol)} [event] - The event name.
 *
 * @return {Phaser.Events.EventEmitter} `this`.
 */

PluginManager.register('EventEmitter', EventEmitter, 'events');

module.exports = EventEmitter;
