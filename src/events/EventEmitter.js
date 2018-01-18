var Class = require('../utils/Class');
var EE = require('eventemitter3');
var PluginManager = require('../plugins/PluginManager');

//  Phaser.EventEmitter

var EventEmitter = new Class({

    Extends: EE,

    initialize:

    function EventEmitter ()
    {
        EE.call(this);
    },

    shutdown: function ()
    {
        this.removeAllListeners();
    },

    destroy: function ()
    {
        this.removeAllListeners();
    }

});

PluginManager.register('EventEmitter', EventEmitter, 'events');

module.exports = EventEmitter;
