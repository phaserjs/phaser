/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var DataManager = require('./DataManager');
var PluginManager = require('../plugins/PluginManager');

var DataManagerPlugin = new Class({

    Extends: DataManager,

    initialize:

    function DataManagerPlugin (scene)
    {
        //  The Scene that owns this plugin
        this.scene = scene;

        this.systems = scene.sys;

        if (!scene.sys.settings.isBooted)
        {
            scene.sys.events.once('boot', this.boot, this);
        }

        DataManager.call(this, this.scene, scene.sys.events);
    },

    boot: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.on('shutdown', this.shutdownPlugin, this);
        eventEmitter.on('destroy', this.destroyPlugin, this);
    },

    shutdownPlugin: function ()
    {
        //  Should we reset the events?
    },

    destroyPlugin: function ()
    {
        this.destroy();

        this.scene = undefined;
        this.systems = undefined;
    }

});

PluginManager.register('DataManagerPlugin', DataManagerPlugin, 'data');

module.exports = DataManagerPlugin;
