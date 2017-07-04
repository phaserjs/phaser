
var Class = require('../utils/Class');
var Systems = require('./Systems');

var State = new Class({

    initialize:

    function State (config)
    {
        //  The State Systems. You must never overwrite this property, or all hell will break lose.
        this.sys = new Systems(this, config);
    },

    //  Should be overridden by your own States
    update: function ()
    {
    },

    //  Should be overridden by your own States
    render: function ()
    {
    }

});

module.exports = State;
