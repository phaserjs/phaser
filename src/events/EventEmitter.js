var Class = require('../utils/Class');
var EE = require('eventemitter3');

//  Phaser.EventEmitter

var EventEmitter = new Class({

    Extends: EE,

    initialize:

    function EventEmitter ()
    {
        EE.call(this);
    }

});

module.exports = EventEmitter;
