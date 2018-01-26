var Class = require('../utils/Class');
var Systems = require('./Systems');

var Scene = new Class({

    initialize:

    function Scene (config)
    {
        //  The Scene Systems. You must never overwrite this property, or all hell will break lose.
        this.sys = new Systems(this, config);
    },

    //  Should be overridden by your own Scenes
    update: function ()
    {
    }

});

module.exports = Scene;
