var Class = require('../utils/Class');
var DisplayList = require('./DisplayList');
var PluginManager = require('../plugins/PluginManager');

var DisplayListPlugin = new Class({

    Extends: DisplayList,

    initialize:

    function DisplayListPlugin (scene)
    {
        //  The Scene that owns this plugin
        this.scene = scene;

        this.systems = scene.sys;

        if (!scene.sys.settings.isBooted)
        {
            scene.sys.events.once('boot', this.boot, this);
        }

        DisplayList.call(this);
    },

    boot: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    },

    shutdown: function ()
    {
        this.removeAll();
    },

    destroy: function ()
    {
        this.shutdown();
    }

});

PluginManager.register('DisplayListPlugin', DisplayListPlugin, 'displayList');

module.exports = DisplayListPlugin;
