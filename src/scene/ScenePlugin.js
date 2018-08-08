/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Clamp = require('../math/Clamp');
var Class = require('../utils/Class');
var GetFastValue = require('../utils/object/GetFastValue');
var PluginCache = require('../plugins/PluginCache');

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
         * @type {Phaser.Scenes.Settings.Object}
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

        /**
         * If this Scene is currently transitioning to another, this holds
         * the current percentage of the transition progress, between 0 and 1.
         *
         * @name Phaser.Scenes.ScenePlugin#transitionProgress
         * @type {number}
         * @since 3.5.0
         */
        this.transitionProgress = 0;

        /**
         * Transition elapsed timer.
         *
         * @name Phaser.Scenes.ScenePlugin#_elapsed
         * @type {integer}
         * @private
         * @since 3.5.0
         */
        this._elapsed = 0;

        /**
         * Transition elapsed timer.
         *
         * @name Phaser.Scenes.ScenePlugin#_target
         * @type {?Phaser.Scenes.Scene}
         * @private
         * @since 3.5.0
         */
        this._target = null;

        /**
         * Transition duration.
         *
         * @name Phaser.Scenes.ScenePlugin#_duration
         * @type {integer}
         * @private
         * @since 3.5.0
         */
        this._duration = 0;

        /**
         * Transition callback.
         *
         * @name Phaser.Scenes.ScenePlugin#_onUpdate
         * @type {function}
         * @private
         * @since 3.5.0
         */
        this._onUpdate;

        /**
         * Transition callback scope.
         *
         * @name Phaser.Scenes.ScenePlugin#_onUpdateScope
         * @type {object}
         * @private
         * @since 3.5.0
         */
        this._onUpdateScope;

        /**
         * Will this Scene sleep (true) after the transition, or stop (false)
         *
         * @name Phaser.Scenes.ScenePlugin#_willSleep
         * @type {boolean}
         * @private
         * @since 3.5.0
         */
        this._willSleep = false;

        /**
         * Will this Scene be removed from the Scene Manager after the transition completes?
         *
         * @name Phaser.Scenes.ScenePlugin#_willRemove
         * @type {boolean}
         * @private
         * @since 3.5.0
         */
        this._willRemove = false;

        scene.sys.events.once('boot', this.boot, this);
        scene.sys.events.on('start', this.pluginStart, this);
    },

    /**
     * This method is called automatically, only once, when the Scene is first created.
     * Do not invoke it directly.
     *
     * @method Phaser.Scenes.ScenePlugin#boot
     * @private
     * @since 3.0.0
     */
    boot: function ()
    {
        this.systems.events.once('destroy', this.destroy, this);
    },

    /**
     * This method is called automatically by the Scene when it is starting up.
     * It is responsible for creating local systems, properties and listening for Scene events.
     * Do not invoke it directly.
     *
     * @method Phaser.Scenes.ScenePlugin#pluginStart
     * @private
     * @since 3.5.0
     */
    pluginStart: function ()
    {
        this._target = null;

        this.systems.events.once('shutdown', this.shutdown, this);
    },

    /**
     * Shutdown this Scene and run the given one.
     *
     * @method Phaser.Scenes.ScenePlugin#start
     * @since 3.0.0
     *
     * @param {string} [key] - The Scene to start.
     * @param {object} [data] - The Scene data.
     *
     * @return {Phaser.Scenes.ScenePlugin} This ScenePlugin object.
     */
    start: function (key, data)
    {
        if (key === undefined) { key = this.key; }

        this.manager.queueOp('stop', this.key);
        this.manager.queueOp('start', key, data);

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

        this.manager.queueOp('stop', key);
        this.manager.queueOp('start', key, data);

        return this;
    },

    /**
     * @typedef {object} Phaser.Scenes.ScenePlugin.SceneTransitionConfig
     * 
     * @property {string} target - The Scene key to transition to.
     * @property {integer} [duration=1000] - The duration, in ms, for the transition to last.
     * @property {boolean} [sleep=false] - Will the Scene responsible for the transition be sent to sleep on completion (`true`), or stopped? (`false`)
     * @property {boolean} [allowInput=false] - Will the Scenes Input system be able to process events while it is transitioning in or out?
     * @property {boolean} [moveAbove] - Move the target Scene to be above this one before the transition starts.
     * @property {boolean} [moveBelow] - Move the target Scene to be below this one before the transition starts.
     * @property {function} [onUpdate] - This callback is invoked every frame for the duration of the transition.
     * @property {any} [onUpdateScope] - The context in which the callback is invoked.
     * @property {any} [data] - An object containing any data you wish to be passed to the target Scenes init / create methods.
     */

    /**
     * This will start a transition from the current Scene to the target Scene given.
     * 
     * The transition will last for the duration specified in milliseconds.
     * 
     * You can have the target Scene moved above or below this one in the display list.
     * 
     * You can specify an update callback. This callback will be invoked _every frame_ for the duration
     * of the transition.
     *
     * This Scene can either be sent to sleep at the end of the transition, or stopped. The default is to stop.
     * 
     * There are also 5 transition related events: This scene will emit the event `transitionto` when
     * the transition begins, which is typically the frame after calling this method.
     * 
     * The target Scene will emit the event `transitioninit` when that Scene's `init` method is called.
     * It will then emit the event `transitionstart` when its `create` method is called.
     * If the Scene was sleeping and has been woken up, it will emit the event `transitionwake` instead of these two,
     * as the Scenes `init` and `create` methods are not invoked when a sleep wakes up.
     * 
     * When the duration of the transition has elapsed it will emit the event `transitioncomplete`.
     * These events are all cleared of listeners when the Scene shuts down, but not if it is sent to sleep.
     *
     * It's important to understand that the duration of the transition begins the moment you call this method.
     * If the Scene you are transitioning to includes delayed processes, such as waiting for files to load, the
     * time still counts down even while that is happening. If the game itself pauses, or something else causes
     * this Scenes update loop to stop, then the transition will also pause for that duration. There are
     * checks in place to prevent you accidentally stopping a transitioning Scene but if you've got code to
     * override this understand that until the target Scene completes it might never be unlocked for input events.
     * 
     * @method Phaser.Scenes.ScenePlugin#transition
     * @since 3.5.0
     *
     * @param {Phaser.Scenes.ScenePlugin.SceneTransitionConfig} config - The transition configuration object.
     *
     * @return {boolean} `true` is the transition was started, otherwise `false`.
     */
    transition: function (config)
    {
        if (config === undefined) { config = {}; }

        var key = GetFastValue(config, 'target', false);

        var target = this.manager.getScene(key);

        if (!key || !this.checkValidTransition(target))
        {
            return false;
        }

        var duration = GetFastValue(config, 'duration', 1000);

        this._elapsed = 0;
        this._target = target;
        this._duration = duration;
        this._willSleep = GetFastValue(config, 'sleep', false);
        this._willRemove = GetFastValue(config, 'remove', false);

        var callback = GetFastValue(config, 'onUpdate', null);

        if (callback)
        {
            this._onUpdate = callback;
            this._onUpdateScope = GetFastValue(config, 'onUpdateScope', this.scene);
        }

        var allowInput = GetFastValue(config, 'allowInput', false);

        this.settings.transitionAllowInput = allowInput;

        var targetSettings = target.sys.settings;

        targetSettings.isTransition = true;
        targetSettings.transitionFrom = this.scene;
        targetSettings.transitionDuration = duration;
        targetSettings.transitionAllowInput = allowInput;

        if (GetFastValue(config, 'moveAbove', false))
        {
            this.manager.moveAbove(this.key, key);
        }
        else if (GetFastValue(config, 'moveBelow', false))
        {
            this.manager.moveBelow(this.key, key);
        }

        if (target.sys.isSleeping())
        {
            target.sys.wake();
        }
        else
        {
            this.manager.start(key, GetFastValue(config, 'data'));
        }

        this.systems.events.emit('transitionout', target, duration);

        this.systems.events.on('update', this.step, this);

        return true;
    },

    /**
     * Checks to see if this Scene can transition to the target Scene or not.
     *
     * @method Phaser.Scenes.ScenePlugin#checkValidTransition
     * @private
     * @since 3.5.0
     *
     * @param {Phaser.Scene} target - The Scene to test against.
     *
     * @return {boolean} `true` if this Scene can transition, otherwise `false`.
     */
    checkValidTransition: function (target)
    {
        //  Not a valid target if it doesn't exist, isn't active or is already transitioning in or out
        if (!target || target.sys.isActive() || target.sys.isTransitioning() || target === this.scene || this.systems.isTransitioning())
        {
            return false;
        }

        return true;
    },

    /**
     * A single game step. This is only called if the parent Scene is transitioning
     * out to another Scene.
     *
     * @method Phaser.Scenes.ScenePlugin#step
     * @private
     * @since 3.5.0
     *
     * @param {number} time - [description]
     * @param {number} delta - [description]
     */
    step: function (time, delta)
    {
        this._elapsed += delta;

        this.transitionProgress = Clamp(this._elapsed / this._duration, 0, 1);

        if (this._onUpdate)
        {
            this._onUpdate.call(this._onUpdateScope, this.transitionProgress);
        }

        if (this._elapsed >= this._duration)
        {
            this.transitionComplete();
        }
    },

    /**
     * Called by `step` when the transition out of this scene to another is over.
     *
     * @method Phaser.Scenes.ScenePlugin#transitionComplete
     * @private
     * @since 3.5.0
     */
    transitionComplete: function ()
    {
        var targetSys = this._target.sys;
        var targetSettings = this._target.sys.settings;

        //  Stop the step
        this.systems.events.off('update', this.step, this);

        //  Notify target scene
        targetSys.events.emit('transitioncomplete', this.scene);

        //  Clear target scene settings
        targetSettings.isTransition = false;
        targetSettings.transitionFrom = null;

        //  Clear local settings
        this._duration = 0;
        this._target = null;
        this._onUpdate = null;
        this._onUpdateScope = null;

        //  Now everything is clear we can handle what happens to this Scene
        if (this._willRemove)
        {
            this.manager.remove(this.key);
        }
        else if (this._willSleep)
        {
            this.systems.sleep();
        }
        else
        {
            this.manager.stop(this.key);
        }
    },

    /**
     * Add the Scene into the Scene Manager and start it if 'autoStart' is true or the Scene config 'active' property is set.
     *
     * @method Phaser.Scenes.ScenePlugin#add
     * @since 3.0.0
     *
     * @param {string} key - The Scene key.
     * @param {(Phaser.Scene|Phaser.Scenes.Settings.Config|function)} sceneConfig - The config for the Scene.
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
            this.manager.queueOp('start', key, data);
        }

        return this;
    },

    /**
     * Runs the given Scene, but does not change the state of this Scene.
     * 
     * If the given Scene is paused, it will resume it. If sleeping, it will wake it.
     * If not running at all, it will be started.
     *
     * Use this if you wish to open a modal Scene by calling `pause` on the current
     * Scene, then `run` on the modal Scene.
     *
     * @method Phaser.Scenes.ScenePlugin#run
     * @since 3.10.0
     *
     * @param {string} key - The Scene to run.
     * @param {object} [data] - A data object that will be passed to the Scene and emitted in its ready, wake, or resume events.
     *
     * @return {Phaser.Scenes.ScenePlugin} This ScenePlugin object.
     */
    run: function (key, data)
    {
        if (key && key !== this.key)
        {
            this.manager.queueOp('run', key, data);
        }

        return this;
    },

    /**
     * Pause the Scene - this stops the update step from happening but it still renders.
     *
     * @method Phaser.Scenes.ScenePlugin#pause
     * @since 3.0.0
     *
     * @param {string} [key] - The Scene to pause.
     * @param {object} [data] - An optional data object that will be passed to the Scene and emitted in its pause event.
     *
     * @return {Phaser.Scenes.ScenePlugin} This ScenePlugin object.
     */
    pause: function (key, data)
    {
        if (key === undefined) { key = this.key; }

        this.manager.queueOp('pause', key, data);

        return this;
    },

    /**
     * Resume the Scene - starts the update loop again.
     *
     * @method Phaser.Scenes.ScenePlugin#resume
     * @since 3.0.0
     *
     * @param {string} [key] - The Scene to resume.
     * @param {object} [data] - An optional data object that will be passed to the Scene and emitted in its resume event.
     *
     * @return {Phaser.Scenes.ScenePlugin} This ScenePlugin object.
     */
    resume: function (key, data)
    {
        if (key === undefined) { key = this.key; }

        this.manager.queueOp('resume', key, data);

        return this;
    },

    /**
     * Makes the Scene sleep (no update, no render) but doesn't shutdown.
     *
     * @method Phaser.Scenes.ScenePlugin#sleep
     * @since 3.0.0
     *
     * @param {string} [key] - The Scene to put to sleep.
     * @param {object} [data] - An optional data object that will be passed to the Scene and emitted in its sleep event.
     *
     * @return {Phaser.Scenes.ScenePlugin} This ScenePlugin object.
     */
    sleep: function (key, data)
    {
        if (key === undefined) { key = this.key; }

        this.manager.queueOp('sleep', key, data);

        return this;
    },

    /**
     * Makes the Scene wake-up (starts update and render)
     *
     * @method Phaser.Scenes.ScenePlugin#wake
     * @since 3.0.0
     *
     * @param {string} [key] - The Scene to wake up.
     * @param {object} [data] - An optional data object that will be passed to the Scene and emitted in its wake event.
     *
     * @return {Phaser.Scenes.ScenePlugin} This ScenePlugin object.
     */
    wake: function (key, data)
    {
        if (key === undefined) { key = this.key; }

        this.manager.queueOp('wake', key, data);

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
            this.manager.queueOp('switch', this.key, key);
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

        this.manager.queueOp('stop', key);

        return this;
    },

    /**
     * Sets the active state of the given Scene.
     *
     * @method Phaser.Scenes.ScenePlugin#setActive
     * @since 3.0.0
     *
     * @param {boolean} value - If `true` the Scene will be resumed. If `false` it will be paused.
     * @param {string} [key] - The Scene to set the active state of.
     * @param {object} [data] - An optional data object that will be passed to the Scene and emitted with its events.
     *
     * @return {Phaser.Scenes.ScenePlugin} This ScenePlugin object.
     */
    setActive: function (value, key, data)
    {
        if (key === undefined) { key = this.key; }

        var scene = this.manager.getScene(key);

        if (scene)
        {
            scene.sys.setActive(value, data);
        }

        return this;
    },

    /**
     * Sets the visible state of the given Scene.
     *
     * @method Phaser.Scenes.ScenePlugin#setVisible
     * @since 3.0.0
     *
     * @param {boolean} value - The visible value.
     * @param {string} [key] - The Scene to set the visible state for.
     *
     * @return {Phaser.Scenes.ScenePlugin} This ScenePlugin object.
     */
    setVisible: function (value, key)
    {
        if (key === undefined) { key = this.key; }

        var scene = this.manager.getScene(key);

        if (scene)
        {
            scene.sys.setVisible(value);
        }

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
     * Retrieves the numeric index of a Scene in the Scenes list.
     *
     * @method Phaser.Scenes.ScenePlugin#getIndex
     * @since 3.7.0
     *
     * @param {(string|Phaser.Scene)} [key] - The Scene to get the index of.
     *
     * @return {integer} The index of the Scene.
     */
    getIndex: function (key)
    {
        if (key === undefined) { key = this.key; }

        return this.manager.getIndex(key);
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
        eventEmitter.off('postupdate', this.step, this);
        eventEmitter.off('transitionout');
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

PluginCache.register('ScenePlugin', ScenePlugin, 'scenePlugin');

module.exports = ScenePlugin;
