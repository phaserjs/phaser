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
 * @param {Phaser.Scene} scene - [description]
 */
var ScenePlugin = new Class({

    initialize:

    function ScenePlugin (scene)
    {
        /**
         * [description]
         *
         * @name Phaser.Scenes.ScenePlugin#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * [description]
         *
         * @name Phaser.Scenes.ScenePlugin#systems
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.systems = scene.sys;

        if (!scene.sys.settings.isBooted)
        {
            scene.sys.events.once('boot', this.boot, this);
        }

        /**
         * [description]
         *
         * @name Phaser.Scenes.ScenePlugin#settings
         * @type {object}
         * @since 3.0.0
         */
        this.settings = scene.sys.settings;

        /**
         * [description]
         *
         * @name Phaser.Scenes.ScenePlugin#key
         * @type {string}
         * @since 3.0.0
         */
        this.key = scene.sys.settings.key;

        /**
         * [description]
         *
         * @name Phaser.Scenes.ScenePlugin#manager
         * @type {Phaser.Scenes.SceneManager}
         * @since 3.0.0
         */
        this.manager = scene.sys.game.scene;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.ScenePlugin#boot
     * @since 3.0.0
     */
    boot: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    },

    /**
     * Shutdown this Scene and run the given one.
     *
     * @method Phaser.Scenes.ScenePlugin#start
     * @since 3.0.0
     *
     * @param {string} key - [description]
     * @param {object} [data] - [description]
     *
     * @return {Phaser.Scenes.ScenePlugin} This ScenePlugin object.
     */
    start: function (key, data)
    {
        if (key === undefined) { key = this.key; }

        if (this.settings.status !== CONST.RUNNING)
        {
            this.manager.queueOp('stop', this.key);
            this.manager.queueOp('start', key);
        }
        else
        {
            this.manager.stop(this.key);
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
     * @param {string} key - [description]
     * @param {object} sceneConfig - [description]
     * @param {boolean} autoStart - [description]
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
     * @param {string} key - [description]
     * @param {object} [data] - [description]
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
     * @param {string} key - [description]
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
     * @param {string} key - [description]
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
     * @param {string} key - [description]
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
     * @param {string} key - [description]
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
     * @param {string} key - [description]
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
     * @param {string} key - [description]
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
     * @param {boolean} value - [description]
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
     * @param {boolean} value - [description]
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
     * @param {string} key - [description]
     *
     * @return {boolean} [description]
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
     * @param {string} key - [description]
     *
     * @return {boolean} [description]
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
     * @param {string} key - [description]
     *
     * @return {boolean} [description]
     */
    isVisible: function (key)
    {
        if (key === undefined) { key = this.key; }

        return this.manager.isVisible(key);
    },

    /**
     * Swaps the position of two scenes in the Scenes list.
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
     * @param {string|Phaser.Scene} scene - The Scene to be removed.
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
     * [description]
     *
     * @method Phaser.Scenes.ScenePlugin#moveUp
     * @since 3.0.0
     *
     * @param {string} key - [description]
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
     * [description]
     *
     * @method Phaser.Scenes.ScenePlugin#moveDown
     * @since 3.0.0
     *
     * @param {string} key - [description]
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
     * [description]
     *
     * @method Phaser.Scenes.ScenePlugin#bringToTop
     * @since 3.0.0
     *
     * @param {string} key - [description]
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
     * [description]
     *
     * @method Phaser.Scenes.ScenePlugin#sendToBack
     * @since 3.0.0
     *
     * @param {string} key - [description]
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
     * [description]
     *
     * @method Phaser.Scenes.ScenePlugin#get
     * @since 3.0.0
     *
     * @param {string} key - [description]
     *
     * @return {Phaser.Scene} [description]
     */
    get: function (key)
    {
        return this.manager.getScene(key);
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.ScenePlugin#shutdown
     * @since 3.0.0
     */
    shutdown: function ()
    {
        //  TODO
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.ScenePlugin#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        //  TODO
    }

});

PluginManager.register('ScenePlugin', ScenePlugin, 'scenePlugin');

module.exports = ScenePlugin;
