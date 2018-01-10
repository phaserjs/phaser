var Class = require('../utils/Class');
var NOOP = require('../utils/NOOP');

var Plugin = new Class({

    initialize:

    function Plugin (scene)
    {
        this.scene = scene;

        this.mapping = '';

        this.active = true;

        this.priority = 0;
    },

    pause: function ()
    {

    },

    resume: function ()
    {

    },

    boot: function ()
    {

    },

    begin: function (time, delta)
    {

    },

    update: function (time, delta)
    {

    },

    postUpdate: function (time, delta)
    {

    },

    postRender: function (renderer)
    {

    },

    shutdown: function ()
    {

    },

    destroy: function ()
    {

    }

});

module.exports = Plugin;
