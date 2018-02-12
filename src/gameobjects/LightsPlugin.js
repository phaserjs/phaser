/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var PluginManager = require('../plugins/PluginManager');
var LightsManager = require('./LightsManager');

var LightsPlugin = new Class({

    Extends: LightsManager,

    initialize:

    function LightsPlugin (scene)
    {
        this.scene = scene;

        this.systems = scene.sys;

        if (!scene.sys.settings.isBooted)
        {
            scene.sys.events.once('boot', this.boot, this);
        }

        LightsManager.call(this);
    },

    boot: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    },

    destroy: function ()
    {
        this.shutdown();

        this.scene = undefined;
    }

});

PluginManager.register('LightsPlugin', LightsPlugin, 'lights');

module.exports = LightsPlugin;
