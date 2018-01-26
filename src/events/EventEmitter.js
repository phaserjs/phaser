var Class = require('../utils/Class');
var EE = require('eventemitter3');
var PluginManager = require('../plugins/PluginManager');

var EventEmitter = new Class({

    Extends: EE,

    initialize:

    /**
     * EventEmitter is a Scene Systems plugin compatible version of eventemitter3.
     *
     * @class EventEmitter
     * @extends eventemitter3
     * @memberOf Phaser.Events
     * @constructor
     * @since 3.0.0
     */
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

PluginManager.register('EventEmitter', EventEmitter, 'events');

module.exports = EventEmitter;
