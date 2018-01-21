var Class = require('../utils/Class');
var PluginManager = require('../plugins/PluginManager');

//  A proxy class to the Global Scene Manager
var ScenePlugin = new Class({

    initialize:

    function ScenePlugin (scene)
    {
        //  The Scene that owns this plugin
        this.scene = scene;

        this.systems = scene.sys;

        if (!scene.sys.settings.isBooted)
        {
            scene.sys.events.once('boot', this.boot, this);
        }

        this.settings = scene.sys.settings;

        this.key = scene.sys.settings.key;

        //  SceneManager
        this.manager = scene.sys.game.scene;

        //  Private
        this._queue = [];
    },

    boot: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    },

    //  Shutdown this Scene and run the given one
    start: function (key, data)
    {
        if (key === undefined) { key = this.key; }

        if (key !== this.key)
        {
            this.manager.stop(this.key);
            this.manager.start(key);
        }

        return this;
    },

    //  Add the Scene into the Scene Manager and start it if 'autoStart' is true or the Scene config 'active' property is set
    add: function (key, sceneConfig, autoStart)
    {
        this.manager.add(key, sceneConfig, autoStart);

        return this;
    },

    //  Launch the given Scene and run it in parallel with this one
    launch: function (key, data)
    {
        if (key && key !== this.key)
        {
            this.manager.start(key);
        }

        return this;
    },

    //  Pause the Scene - this stops the update step from happening but it still renders
    pause: function (key)
    {
        if (key === undefined) { key = this.key; }

        this.manager.pause(key);

        return this;
    },

    //  Resume the Scene - starts the update loop again
    resume: function (key)
    {
        if (key === undefined) { key = this.key; }

        this.manager.resume(key);

        return this;
    },

    //  Makes the Scene sleep (no update, no render) but doesn't shutdown
    sleep: function (key)
    {
        if (key === undefined) { key = this.key; }

        this.manager.sleep(key);

        return this;
    },

    //  Makes the Scene wake-up (starts update and render)
    wake: function (key)
    {
        if (key === undefined) { key = this.key; }

        this.manager.wake(key);

        return this;
    },

    //  Makes this Scene sleep then starts the Scene given
    switch: function (key)
    {
        if (key !== this.key)
        {
            this.manager.switch(this.key, key);
        }

        return this;
    },

    //  Shutdown the Scene, clearing display list, timers, etc
    stop: function (key)
    {
        if (key === undefined) { key = this.key; }

        this.manager.stop(key);

        return this;
    },

    setActive: function (value)
    {
        this.settings.active = value;

        return this;
    },

    setVisible: function (value)
    {
        this.settings.visible = value;

        return this;
    },

    isSleeping: function (key)
    {
        if (key === undefined) { key = this.key; }

        return this.manager.isSleeping(key);
    },

    isActive: function (key)
    {
        if (key === undefined) { key = this.key; }

        return this.manager.isActive(key);
    },

    isVisible: function (key)
    {
        if (key === undefined) { key = this.key; }

        return this.manager.isVisible(key);
    },

    swapPosition: function (key)
    {
        if (key && key !== this.key)
        {
            this.manager.swapPosition(this.key, key);
        }

        return this;
    },

    moveUp: function (key)
    {
        if (key === undefined) { key = this.key; }

        this.manager.moveUp(key);

        return this;
    },

    moveDown: function (key)
    {
        if (key === undefined) { key = this.key; }

        this.manager.moveDown(key);

        return this;
    },

    bringToTop: function (key)
    {
        if (key === undefined) { key = this.key; }

        this.manager.bringToTop(key);

        return this;
    },

    sendToBack: function (key)
    {
        if (key === undefined) { key = this.key; }

        this.manager.sendToBack(key);

        return this;
    },

    get: function (key)
    {
        return this.manager.getScene(key);
    },

    shutdown: function ()
    {
        //  TODO
    },

    destroy: function ()
    {
        //  TODO
    }

});

PluginManager.register('ScenePlugin', ScenePlugin, 'scenePlugin');

module.exports = ScenePlugin;
