var Class = require('../utils/Class');
var PluginManager = require('../plugins/PluginManager');

var TestPlugin = new Class({

    initialize:

    function TestPlugin (scene)
    {
        this.scene = scene;

        this.systems = scene.sys;

        this.mapping = 'test';

        console.log('TestPlugin is alive');

        this.systems.events.on('boot', this.boot, this);
    },

    boot: function ()
    {
        console.log('TestPlugin has booted');

        this.scene[this.mapping] = this;
    },

    fire: function (img)
    {
        console.log('Hello!');

        this.systems.add.image(400, 300, img);
    }

});

PluginManager.register('test', TestPlugin);

module.exports = TestPlugin;
