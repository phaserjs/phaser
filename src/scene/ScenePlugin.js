/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var CONST = require('./const');
var PluginManager = require('../boot/PluginManager');

/**
 * @classdesc
 * A proxy class to the Global Scene Manager.
 *
 * @class ScenePlugin
 * @memberOf Phaser.Scenes
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene that this ScenePlugin belongs to.
 */
var ScenePlugin = new Class({

    initialize:

    function ScenePlugin (scene)
    {
        /**
         * The Scene that this ScenePlugin belongs to.
         *
         * @name Phaser.Scenes.ScenePlugin#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * The Scene Systems instance of the Scene that this ScenePlugin belongs to.
         *
         * @name Phaser.Scenes.ScenePlugin#systems
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.systems = scene.sys;

        /**
         * The settings of the Scene this ScenePlugin belongs to.
         *
         * @name Phaser.Scenes.ScenePlugin#settings
         * @type {SettingsObject}
         * @since 3.0.0
         */
        this.settings = scene.sys.settings;

        /**
         * The key of the Scene this ScenePlugin belongs to.
         *
         * @name Phaser.Scenes.ScenePlugin#key
         * @type {string}
         * @since 3.0.0
         */
        this.key = scene.sys.settings.key;

        /**
         * The Game's SceneManager.
         *
         * @name Phaser.Scenes.ScenePlugin#manager
         * @type {Phaser.Scenes.SceneManager}
         * @since 3.0.0
         */
        this.manager = scene.sys.game.scene;

        scene.sys.events.on('start', this.pluginStart, this);
    },

    /**
     * This method is called automatically by the Scene when it is starting up.
     * It is responsible for creating local systems, properties and listening for Scene events.
     * Do not invoke it directly.
     *
     * @method Phaser.Scenes.ScenePlugin#pluginStart
     * @private
     * @since 3.0.0
     */
    pluginStart: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.once('shutdown', this.shutdown, this);
        eventEmitter.once('destroy', this.destroy, this);
    },

    /**
     * Shutdown this Scene and run the given one.
     *
     * @method Phaser.Scenes.ScenePlugin#start
     * @since 3.0.0
     *
     * @param {string} key - The Scene to start.
     * @param {object} [data] - The Scene data.
     *
     * @return {Phaser.Scenes.ScenePlugin} This ScenePlugin object.
     */
    start: function (key, data)
    {
        if (key === undefined) { key = this.key; }

        if (this.settings.status !== CONST.RUNNING)
        {
            this.manager.queueOp('stop', this.key);
            this.manager.queueOp('start', key, data);
        }
        else
        {
            this.manager.stop(this.key);
            this.manager.start(key, data);
        }

        return this;
    },

    /**
     * Restarts this Scene.
     *
     * @method Phaser.Scenes.ScenePlugin#restart
     * @since 3.4.0
     * 
     * @param {object} [data] - The Scene data.
     *
     * @return {Phaser.Scenes.ScenePlugin} This ScenePlugin object.
     */
    restart: function (data)
    {
        var key = this.key;

        if (this.settings.status !== CONST.RUNNING)
        {
            this.manager.queueOp('stop', key);
            this.manager.queueOp('start', key, data);
        }
        else
        {
            this.manager.stop(key);
            this.manager.start(key, data);
        }

        return this;
    },

    /**
     * Add the Scene into the Scene Manager and start it if 'autoStart' is true or the Scene config 'active' property is set.
     *
     * @method Phaser.Scenes.ScenePlugin#add
     * @since 3.0.0
     *
     * @param {string} key - The Scene key.
     * @param {(Phaser.Scene|SettingsConfig|function)} sceneConfig - The config for the Scene.
     * @param {boolean} autoStart - Whether to start the Scene after it's added.
     *
     * @return {Phaser.Scenes.ScenePlugin} This ScenePlugin object.
     */
    add: function (key, sceneConfig, autoStart)
    {
        this.manager.add(key, sceneConfig, autoStart);

        return this;
    },

    /**
     * Launch the given Scene and run it in parallel with this one.
     *
     * @method Phaser.Scenes.ScenePlugin#launch
     * @since 3.0.0
     *
     * @param {string} key - The Scene to launch.
     * @param {object} [data] - The Scene data.
     *
     * @return {Phaser.Scenes.ScenePlugin} This ScenePlugin object.
     */
    launch: function (key, data)
    {
        if (key && key !== this.key)
        {
            if (this.settings.status !== CONST.RUNNING)
            {
                this.manager.queueOp('start', key, data);
            }
            else
            {
                this.manager.start(key, data);
            }
        }

        return this;
    },

    /**
     * Pause the Scene - this stops the update step from happening but it still renders.
     *
     * @method Phaser.Scenes.ScenePlugin#pause
     * @since 3.0.0
     *
     * @param {string} key - The Scene to pause.
     *
     * @return {Phaser.Scenes.ScenePlugin} This ScenePlugin object.
     */
    pause: function (key)
    {
        if (key === undefined) { key = this.key; }

        this.manager.pause(key);

        return this;
    },

    /**
     * Resume the Scene - starts the update loop again.
     *
     * @method Phaser.Scenes.ScenePlugin#resume
     * @since 3.0.0
     *
     * @param {string} key - The Scene to resume.
     *
     * @return {Phaser.Scenes.ScenePlugin} This ScenePlugin object.
     */
    resume: function (key)
    {
        if (key === undefined) { key = this.key; }

        this.manager.resume(key);

        return this;
    },

    /**
     * Makes the Scene sleep (no update, no render) but doesn't shutdown.
     *
     * @method Phaser.Scenes.ScenePlugin#sleep
     * @since 3.0.0
     *
     * @param {string} key - The Scene to put to sleep.
     *
     * @return {Phaser.Scenes.ScenePlugin} This ScenePlugin object.
     */
    sleep: function (key)
    {
        if (key === undefined) { key = this.key; }

        this.manager.sleep(key);

        return this;
    },

    /**
     * Makes the Scene wake-up (starts update and render)
     *
     * @method Phaser.Scenes.ScenePlugin#wake
     * @since 3.0.0
     *
     * @param {string} key - The Scene to wake up.
     *
     * @return {Phaser.Scenes.ScenePlugin} This ScenePlugin object.
     */
    wake: function (key)
    {
        if (key === undefined) { key = this.key; }

        this.manager.wake(key);

        return this;
    },

    /**
     * Makes this Scene sleep then starts the Scene given.
     *
     * @method Phaser.Scenes.ScenePlugin#switch
     * @since 3.0.0
     *
     * @param {string} key - The Scene to start.
     *
     * @return {Phaser.Scenes.ScenePlugin} This ScenePlugin object.
     */
    switch: function (key)
    {
        if (key !== this.key)
        {
            if (this.settings.status !== CONST.RUNNING)
            {
                this.manager.queueOp('switch', this.key, key);
            }
            else
            {
                this.manager.switch(this.key, key);
            }
        }

        return this;
    },

    /**
     * Shutdown the Scene, clearing display list, timers, etc.
     *
     * @method Phaser.Scenes.ScenePlugin#stop
     * @since 3.0.0
     *
     * @param {string} key - The Scene to stop.
     *
     * @return {Phaser.Scenes.ScenePlugin} This ScenePlugin object.
     */
    stop: function (key)
    {
        if (key === undefined) { key = this.key; }

        this.manager.stop(key);

        return this;
    },

    /**
     * Sets the active state of the given Scene.
     *
     * @method Phaser.Scenes.ScenePlugin#setActive
     * @since 3.0.0
     *
     * @param {boolean} value - The Scene to set the active state for.
     *
     * @return {Phaser.Scenes.ScenePlugin} This ScenePlugin object.
     */
    setActive: function (value)
    {
        this.settings.active = value;

        return this;
    },

    /**
     * Sets the visible state of the given Scene.
     *
     * @method Phaser.Scenes.ScenePlugin#setVisible
     * @since 3.0.0
     *
     * @param {boolean} value - The Scene to set the visible state for.
     *
     * @return {Phaser.Scenes.ScenePlugin} This ScenePlugin object.
     */
    setVisible: function (value)
    {
        this.settings.visible = value;

        return this;
    },

    /**
     * Checks if the given Scene is sleeping or not?
     *
     * @method Phaser.Scenes.ScenePlugin#isSleeping
     * @since 3.0.0
     *
     * @param {string} key - The Scene to check.
     *
     * @return {boolean} Whether the Scene is sleeping.
     */
    isSleeping: function (key)
    {
        if (key === undefined) { key = this.key; }

        return this.manager.isSleeping(key);
    },

    /**
     * Checks if the given Scene is active or not?
     *
     * @method Phaser.Scenes.ScenePlugin#isActive
     * @since 3.0.0
     *
     * @param {string} key - The Scene to check.
     *
     * @return {boolean} Whether the Scene is active.
     */
    isActive: function (key)
    {
        if (key === undefined) { key = this.key; }

        return this.manager.isActive(key);
    },

    /**
     * Checks if the given Scene is visible or not?
     *
     * @method Phaser.Scenes.ScenePlugin#isVisible
     * @since 3.0.0
     *
     * @param {string} key - The Scene to check.
     *
     * @return {boolean} Whether the Scene is visible.
     */
    isVisible: function (key)
    {
        if (key === undefined) { key = this.key; }

        return this.manager.isVisible(key);
    },

    /**
     * Swaps the position of two scenes in the Scenes list.
     *
     * This controls the order in which they are rendered and updated.
     *
     * @method Phaser.Scenes.ScenePlugin#swapPosition
     * @since 3.2.0
     *
     * @param {string} keyA - The first Scene to swap.
     * @param {string} [keyB] - The second Scene to swap. If none is given it defaults to this Scene.
     *
     * @return {Phaser.Scenes.ScenePlugin} This ScenePlugin object.
     */
    swapPosition: function (keyA, keyB)
    {
        if (keyB === undefined) { keyB = this.key; }

        if (keyA !== keyB)
        {
            this.manager.swapPosition(keyA, keyB);
        }

        return this;
    },

    /**
     * Swaps the position of two scenes in the Scenes list, so that Scene B is directly above Scene A.
     *
     * This controls the order in which they are rendered and updated.
     *
     * @method Phaser.Scenes.ScenePlugin#moveAbove
     * @since 3.2.0
     *
     * @param {string} keyA - The Scene that Scene B will be moved to be above.
     * @param {string} [keyB] - The Scene to be moved. If none is given it defaults to this Scene.
     *
     * @return {Phaser.Scenes.ScenePlugin} This ScenePlugin object.
     */
    moveAbove: function (keyA, keyB)
    {
        if (keyB === undefined) { keyB = this.key; }

        if (keyA !== keyB)
        {
            this.manager.moveAbove(keyA, keyB);
        }

        return this;
    },

    /**
     * Swaps the position of two scenes in the Scenes list, so that Scene B is directly below Scene A.
     *
     * This controls the order in which they are rendered and updated.
     *
     * @method Phaser.Scenes.ScenePlugin#moveBelow
     * @since 3.2.0
     *
     * @param {string} keyA - The Scene that Scene B will be moved to be below.
     * @param {string} [keyB] - The Scene to be moved. If none is given it defaults to this Scene.
     *
     * @return {Phaser.Scenes.ScenePlugin} This ScenePlugin object.
     */
    moveBelow: function (keyA, keyB)
    {
        if (keyB === undefined) { keyB = this.key; }

        if (keyA !== keyB)
        {
            this.manager.moveBelow(keyA, keyB);
        }

        return this;
    },

    /**
     * Removes a Scene from the SceneManager.
     *
     * The Scene is removed from the local scenes array, it's key is cleared from the keys
     * cache and Scene.Systems.destroy is then called on it.
     *
     * If the SceneManager is processing the Scenes when this method is called it wil
     * queue the operation for the next update sequence.
     *
     * @method Phaser.Scenes.ScenePlugin#remove
     * @since 3.2.0
     *
     * @param {(string|Phaser.Scene)} key - The Scene to be removed.
     *
     * @return {Phaser.Scenes.SceneManager} This SceneManager.
     */
    remove: function (key)
    {
        if (key === undefined) { key = this.key; }

        this.manager.remove(key);

        return this;
    },

    /**
     * Moves a Scene up one position in the Scenes list.
     *
     * @method Phaser.Scenes.ScenePlugin#moveUp
     * @since 3.0.0
     *
     * @param {string} key - The Scene to move.
     *
     * @return {Phaser.Scenes.ScenePlugin} This ScenePlugin object.
     */
    moveUp: function (key)
    {
        if (key === undefined) { key = this.key; }

        this.manager.moveUp(key);

        return this;
    },

    /**
     * Moves a Scene down one position in the Scenes list.
     *
     * @method Phaser.Scenes.ScenePlugin#moveDown
     * @since 3.0.0
     *
     * @param {string} key - The Scene to move.
     *
     * @return {Phaser.Scenes.ScenePlugin} This ScenePlugin object.
     */
    moveDown: function (key)
    {
        if (key === undefined) { key = this.key; }

        this.manager.moveDown(key);

        return this;
    },

    /**
     * Brings a Scene to the top of the Scenes list.
     *
     * This means it will render above all other Scenes.
     *
     * @method Phaser.Scenes.ScenePlugin#bringToTop
     * @since 3.0.0
     *
     * @param {string} key - The Scene to move.
     *
     * @return {Phaser.Scenes.ScenePlugin} This ScenePlugin object.
     */
    bringToTop: function (key)
    {
        if (key === undefined) { key = this.key; }

        this.manager.bringToTop(key);

        return this;
    },

    /**
     * Sends a Scene to the back of the Scenes list.
     *
     * This means it will render below all other Scenes.
     *
     * @method Phaser.Scenes.ScenePlugin#sendToBack
     * @since 3.0.0
     *
     * @param {string} key - The Scene to move.
     *
     * @return {Phaser.Scenes.ScenePlugin} This ScenePlugin object.
     */
    sendToBack: function (key)
    {
        if (key === undefined) { key = this.key; }

        this.manager.sendToBack(key);

        return this;
    },

    /**
     * Retrieve a Scene.
     *
     * @method Phaser.Scenes.ScenePlugin#get
     * @since 3.0.0
     *
     * @param {string} key - The Scene to retrieve.
     *
     * @return {Phaser.Scene} The Scene.
     */
    get: function (key)
    {
        return this.manager.getScene(key);
    },

    /**
     * The Scene that owns this plugin is shutting down.
     * We need to kill and reset all internal properties as well as stop listening to Scene events.
     *
     * @method Phaser.Scenes.ScenePlugin#shutdown
     * @private
     * @since 3.0.0
     */
    shutdown: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.off('shutdown', this.shutdown, this);
    },

    /**
     * The Scene that owns this plugin is being destroyed.
     * We need to shutdown and then kill off all external references.
     *
     * @method Phaser.Scenes.ScenePlugin#destroy
     * @private
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.shutdown();

        this.scene.sys.events.off('start', this.start, this);

        this.scene = null;
        this.systems = null;
        this.settings = null;
        this.manager = null;
    }

});

PluginManager.register('ScenePlugin', ScenePlugin, 'scenePlugin');

module.exports = ScenePlugin;
