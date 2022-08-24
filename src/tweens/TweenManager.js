/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ArrayRemove = require('../utils/array/Remove');
var Class = require('../utils/Class');
var Flatten = require('../utils/array/Flatten');
var NumberTweenBuilder = require('./builders/NumberTweenBuilder');
var PluginCache = require('../plugins/PluginCache');
var SceneEvents = require('../scene/events');
var StaggerBuilder = require('./builders/StaggerBuilder');
var TWEEN_CONST = require('./tween/const');
var TweenBuilder = require('./builders/TweenBuilder');

/**
 * @classdesc
 * The Tween Manager is a default Scene Plugin which controls and updates Tweens.
 *
 * @class TweenManager
 * @memberof Phaser.Tweens
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene which owns this Tween Manager.
 */
var TweenManager = new Class({

    initialize:

    function TweenManager (scene)
    {
        /**
         * The Scene which owns this Tween Manager.
         *
         * @name Phaser.Tweens.TweenManager#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * The Systems object of the Scene which owns this Tween Manager.
         *
         * @name Phaser.Tweens.TweenManager#systems
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.systems = scene.sys;

        /**
         * The time scale of the Tween Manager.
         *
         * This value scales the time delta between two frames, thus influencing the speed of time for all Tweens owned by this Tween Manager.
         *
         * @name Phaser.Tweens.TweenManager#timeScale
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.timeScale = 1;

        /**
         * This toggles the updating state of this Tween Manager.
         *
         * Setting `paused` to `true` (or calling the `pauseAll` method) will
         * stop this Tween Manager from updating any of its tweens, including
         * newly created ones. Set back to `false` to resume playback.
         *
         * @name Phaser.Tweens.TweenManager#paused
         * @type {boolean}
         * @default false
         * @since 3.60.0
         */
        this.paused = false;

        /**
         * Is this Tween Manager currently processing the tweens as part of
         * its 'update' loop? This is set to 'true' at the start of 'update'
         * and reset to 'false' at the end of the function. Allows you to trap
         * Tween Manager status during tween callbacks.
         *
         * @name Phaser.Tweens.TweenManager#processing
         * @type {boolean}
         * @default false
         * @since 3.60.0
         */
        this.processing = false;

        /**
         * An array of Tweens which are actively being processed by the Tween Manager.
         *
         * @name Phaser.Tweens.TweenManager#tweens
         * @type {Phaser.Tweens.Tween[]}
         * @since 3.60.0
         */
        this.tweens = [];

        scene.sys.events.once(SceneEvents.BOOT, this.boot, this);
        scene.sys.events.on(SceneEvents.START, this.start, this);
    },

    /**
     * This method is called automatically, only once, when the Scene is first created.
     * Do not invoke it directly.
     *
     * @method Phaser.Tweens.TweenManager#boot
     * @private
     * @since 3.5.1
     */
    boot: function ()
    {
        this.systems.events.once(SceneEvents.DESTROY, this.destroy, this);
    },

    /**
     * This method is called automatically by the Scene when it is starting up.
     * It is responsible for creating local systems, properties and listening for Scene events.
     * Do not invoke it directly.
     *
     * @method Phaser.Tweens.TweenManager#start
     * @private
     * @since 3.5.0
     */
    start: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.on(SceneEvents.UPDATE, this.update, this);
        eventEmitter.once(SceneEvents.SHUTDOWN, this.shutdown, this);

        this.timeScale = 1;
        this.paused = false;
    },

    /**
     * Create a Tween and return it, but does not add it to this Tween Manager.
     *
     * Please note that a Tween will not manipulate any target property that begins with an underscore.
     *
     * In order to play this tween, you'll need to add it to a Tween Manager via
     * the `TweenManager.existing` method.
     *
     * @method Phaser.Tweens.TweenManager#create
     * @since 3.0.0
     *
     * @param {Phaser.Types.Tweens.TweenBuilderConfig|object} config - The configuration object for the Tween.
     *
     * @return {Phaser.Tweens.Tween} The created Tween object.
     */
    create: function (config)
    {
        return TweenBuilder(this, config);
    },

    /**
     * Create a Tween and add it to this Tween Manager.
     *
     * Playback will start immediately unless the tween has been configured to be paused.
     *
     * Please note that a Tween will not manipulate any target property that begins with an underscore.
     *
     * @method Phaser.Tweens.TweenManager#add
     * @since 3.0.0
     *
     * @param {Phaser.Types.Tweens.TweenBuilderConfig|Phaser.Types.Tweens.TweenBuilderConfig[]|object|object[]} config - The configuration object for the Tween. Or an array of configuration objects, in which case a series of chained Tweens is created.
     *
     * @return {Phaser.Tweens.Tween|Phaser.Tweens.Tween[]} The created Tween, or if an array of configs was provided then an array of Tweens is returned.
     */
    add: function (config)
    {
        var tween;

        if (Array.isArray(config))
        {
            var result = [];
            var prevTween = null;

            for (var i = 0; i < config.length; i++)
            {
                tween = TweenBuilder(this, config[i]);

                this.tweens.push(tween.init(i > 0));

                if (i > 0)
                {
                    prevTween.chain(tween);
                }

                prevTween = tween;

                result.push(tween);
            }

            return result;
        }
        else
        {
            tween = TweenBuilder(this, config);

            this.tweens.push(tween.init());

            return tween;
        }
    },

    /**
     * Check to see if the given Tween instance exists within this Tween Manager.
     *
     * Will return `true` as long as the Tween is being processed by this Tween Manager.
     *
     * Will return `false` if not present, or has a state of `REMOVED` or `DESTROYED`.
     *
     * @method Phaser.Tweens.TweenManager#has
     * @since 3.60.0
     *
     * @param {Phaser.Tweens.Tween} tween - The Tween instance to check.
     *
     * @return {boolean} `true` if the Tween exists within this Tween Manager, otherwise `false`.
     */
    has: function (tween)
    {
        return (this.tweens.indexOf(tween) > -1);
    },

    /**
     * Add an existing Tween to this Tween Manager.
     *
     * Playback will start immediately unless the tween has been configured to be paused.
     *
     * @method Phaser.Tweens.TweenManager#existing
     * @since 3.0.0
     *
     * @param {Phaser.Tweens.Tween} tween - The Tween to add.
     *
     * @return {this} This Tween Manager instance.
     */
    existing: function (tween)
    {
        if (!this.has(tween))
        {
            this.tweens.push(tween.init());
        }

        return this;
    },

    /**
     * Create a Number Tween and add it to the active Tween list.
     *
     * Playback will start immediately unless the tween has been configured to be paused.
     *
     * Please note that a Tween will not manipulate any target property that begins with an underscore.
     *
     * @method Phaser.Tweens.TweenManager#addCounter
     * @since 3.0.0
     *
     * @param {Phaser.Types.Tweens.NumberTweenBuilderConfig} config - The configuration object for the Number Tween.
     *
     * @return {Phaser.Tweens.Tween} The created Number Tween.
     */
    addCounter: function (config)
    {
        var tween = NumberTweenBuilder(this, config);

        this.tweens.push(tween.init());

        return tween;
    },

    /**
     * Creates a Stagger function to be used by a Tween property.
     *
     * The stagger function will allow you to stagger changes to the value of the property across all targets of the tween.
     *
     * This is only worth using if the tween has multiple targets.
     *
     * The following will stagger the delay by 100ms across all targets of the tween, causing them to scale down to 0.2
     * over the duration specified:
     *
     * ```javascript
     * this.tweens.add({
     *     targets: [ ... ],
     *     scale: 0.2,
     *     ease: 'linear',
     *     duration: 1000,
     *     delay: this.tweens.stagger(100)
     * });
     * ```
     *
     * The following will stagger the delay by 500ms across all targets of the tween using a 10 x 6 grid, staggering
     * from the center out, using a cubic ease.
     *
     * ```javascript
     * this.tweens.add({
     *     targets: [ ... ],
     *     scale: 0.2,
     *     ease: 'linear',
     *     duration: 1000,
     *     delay: this.tweens.stagger(500, { grid: [ 10, 6 ], from: 'center', ease: 'cubic.out' })
     * });
     * ```
     *
     * @method Phaser.Tweens.TweenManager#stagger
     * @since 3.19.0
     *
     * @param {(number|number[])} value - The amount to stagger by, or an array containing two elements representing the min and max values to stagger between.
     * @param {Phaser.Types.Tweens.StaggerConfig} config - The configuration object for the Stagger function.
     *
     * @return {function} The stagger function.
     */
    stagger: function (value, options)
    {
        return StaggerBuilder(value, options);
    },

    /**
     * Updates all Tweens belonging to this Tween Manager.
     *
     * This is skipped is `TweenManager.paused = true`.
     *
     * @method Phaser.Tweens.TweenManager#update
     * @since 3.0.0
     *
     * @param {number} timestamp - The current time in milliseconds.
     * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     */
    update: function (timestamp, delta)
    {
        if (this.paused)
        {
            return;
        }

        this.processing = true;

        //  Scale the delta
        delta *= this.timeScale;

        var i;
        var tween;
        var toDestroy = [];
        var list = this.tweens;

        //  By not caching the length we can immediately update tweens added this frame
        for (i = 0; i < list.length; i++)
        {
            tween = list[i];

            //  If Tween.update returns 'true' then it means it has completed,
            //  so move it to the destroy list
            if (tween.update(timestamp, delta))
            {
                if (tween.persist)
                {
                    tween.state = TWEEN_CONST.FINISHED;
                }
                else
                {
                    toDestroy.push(tween);
                }
            }
        }

        //  Clean-up the 'toDestroy' list
        var count = toDestroy.length;

        if (count && list.length > 0)
        {
            for (i = 0; i < count; i++)
            {
                tween = toDestroy[i];

                var idx = list.indexOf(tween);

                if (idx > -1 && (tween.state === TWEEN_CONST.PENDING_REMOVE || tween.state === TWEEN_CONST.DESTROYED))
                {
                    list.splice(idx, 1);

                    tween.destroy();
                }
            }

            toDestroy.length = 0;
        }

        this.processing = false;
    },

    /**
     * Removes the given Tween from this Tween Manager, even if it hasn't started
     * playback yet. If this method is called while the Tween Manager is processing
     * an update loop, then the tween will be flagged for removal at the start of
     * the next frame. Otherwise, it is removed immediately.
     *
     * The removed tween is _not_ destroyed. It is just removed from this Tween Manager.
     *
     * @method Phaser.Tweens.TweenManager#remove
     * @since 3.17.0
     *
     * @param {Phaser.Tweens.Tween} tween - The Tween to be removed.
     *
     * @return {this} This Tween Manager instance.
     */
    remove: function (tween)
    {
        if (this.processing)
        {
            //  Remove it on the next frame
            tween.state = TWEEN_CONST.PENDING_REMOVE;
        }
        else
        {
            //  Remove it immediately
            ArrayRemove(this.tweens, tween);

            tween.state = TWEEN_CONST.REMOVED;
        }

        return this;
    },

    /**
     * Resets the given Tween.
     *
     * If the Tween does not belong to this Tween Manager, it will first be added.
     *
     * Then it will seek to position 0 and playback will start on the next frame.
     *
     * @method Phaser.Tweens.TweenManager#reset
     * @since 3.60.0
     *
     * @param {Phaser.Tweens.Tween} tween - The Tween to be reset.
     *
     * @return {this} This Tween Manager instance.
     */
    reset: function (tween)
    {
        this.existing(tween);

        tween.seek();

        tween.state = TWEEN_CONST.ACTIVE;

        return this;
    },

    /**
     * Checks if a Tween is active and adds it to the Tween Manager at the start of the frame if it isn't.
     *
     * @method Phaser.Tweens.TweenManager#makeActive
     * @since 3.0.0
     *
     * @param {Phaser.Tweens.Tween} tween - The Tween to check.
     *
     * @return {this} This Tween Manager instance.
     */
    makeActive: function (tween)
    {
        this.existing(tween);

        tween.state = TWEEN_CONST.ACTIVE;

        return this;
    },

    /**
     * Passes all Tweens to the given callback.
     *
     * @method Phaser.Tweens.TweenManager#each
     * @since 3.0.0
     *
     * @param {function} callback - The function to call.
     * @param {object} [scope] - The scope (`this` object) to call the function with.
     * @param {...*} [args] - The arguments to pass into the function. Its first argument will always be the Tween currently being iterated.
     *
     * @return {this} This Tween Manager instance.
     */
    each: function (callback, scope)
    {
        var i;
        var args = [ null ];

        for (i = 1; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }

        this.tweens.forEach(function (tween)
        {
            args[0] = tween;

            callback.apply(scope, args);
        });

        return this;
    },

    /**
     *
     *
     * @method Phaser.Tweens.TweenManager#getTotal
     * @since 3.60.0
     *
     * @return {} stuff
     */
    getTotal: function ()
    {
        var tweens = this.tweens;
        var active = 0;

        for (var i = 0; i < tweens.length; i++)
        {
            if (tweens[i].state === TWEEN_CONST.ACTIVE)
            {
                active++;
            }
        }

        return { active: active, total: tweens.length };
    },

    /**
     * Returns an array containing references to of all Tweens in this Tween Manager.
     *
     * @method Phaser.Tweens.TweenManager#getAllTweens
     * @since 3.0.0
     *
     * @return {Phaser.Tweens.Tween[]} A new array containing references to all Tweens.
     */
    getAllTweens: function ()
    {
        return this.tweens.slice();
    },

    /**
     * Returns the scale of the time delta for all Tweens owned by this Tween Manager.
     *
     * @method Phaser.Tweens.TweenManager#getGlobalTimeScale
     * @since 3.0.0
     *
     * @return {number} The scale of the time delta, usually 1.
     */
    getGlobalTimeScale: function ()
    {
        return this.timeScale;
    },

    /**
     * Sets a new scale of the time delta for this Tween Manager.
     *
     * The time delta is the time elapsed between two consecutive frames and influences the speed of time for this Tween Manager and all Tweens it owns. Values higher than 1 increase the speed of time, while values smaller than 1 decrease it. A value of 0 freezes time and is effectively equivalent to pausing all Tweens.
     *
     * @method Phaser.Tweens.TweenManager#setGlobalTimeScale
     * @since 3.0.0
     *
     * @param {number} value - The new scale of the time delta, where 1 is the normal speed.
     *
     * @return {this} This Tween Manager instance.
     */
    setGlobalTimeScale: function (value)
    {
        this.timeScale = value;

        return this;
    },

    /**
     * Returns an array of all Tweens in the Tween Manager which affect the given target, or array of targets.
     *
     * It's possible for this method to return tweens that are about to be removed from
     * the Tween Manager. You should check the state of the returned tween before acting
     * upon it.
     *
     * @method Phaser.Tweens.TweenManager#getTweensOf
     * @since 3.0.0
     *
     * @param {object|array} target - The target to look for. Provide an array to look for multiple targets.
     *
     * @return {Phaser.Tweens.Tween[]} A new array containing all Tweens which affect the given target(s).
     */
    getTweensOf: function (target)
    {
        var output = [];
        var list = this.tweens;

        target = Flatten(target);

        var targetLen = target.length;

        for (var i = 0; i < list.length; i++)
        {
            var tween = list[i];

            for (var t = 0; t < targetLen; t++)
            {
                if (tween.hasTarget(target[t]))
                {
                    output.push(tween);
                }
            }
        }

        return output;
    },

    /**
     * Checks if the given object is being affected by a _playing_ Tween.
     *
     * If the Tween is paused, this method will return false.
     *
     * @method Phaser.Tweens.TweenManager#isTweening
     * @since 3.0.0
     *
     * @param {object} target - The object to check if a tween is active for it, or not.
     *
     * @return {boolean} Returns `true` if a tween is active on the given target, otherwise `false`.
     */
    isTweening: function (target)
    {
        var list = this.tweens;
        var tween;

        for (var i = 0; i < list.length; i++)
        {
            tween = list[i];

            if (tween.isPlaying() && tween.hasTarget(target))
            {
                return true;
            }
        }

        return false;
    },

    /**
     * Destroys all Tweens in this Tween Manager.
     *
     * The tweens will erase all references to any targets they hold
     * and be stopped immediately.
     *
     * If this method is called while the Tween Manager is running its
     * update process, then the tweens will be removed at the start of
     * the next frame. Outside of this, they are removed immediately.
     *
     * @method Phaser.Tweens.TweenManager#killAll
     * @since 3.0.0
     *
     * @return {this} This Tween Manager instance.
     */
    killAll: function ()
    {
        var tweens = (this.processing) ? this.getAllTweens() : this.tweens;

        for (var i = 0; i < tweens.length; i++)
        {
            tweens[i].destroy();
        }

        if (!this.processing)
        {
            tweens.length = 0;
        }

        return this;
    },

    /**
     * Stops all Tweens which affect the given target or array of targets.
     *
     * The tweens will erase all references to any targets they hold
     * and be stopped immediately.
     *
     * If this method is called while the Tween Manager is running its
     * update process, then the tweens will be removed at the start of
     * the next frame. Outside of this, they are removed immediately.
     *
     * @see {@link #getTweensOf}
     *
     * @method Phaser.Tweens.TweenManager#killTweensOf
     * @since 3.0.0
     *
     * @param {(object|array)} target - The target to kill the tweens of. Provide an array to use multiple targets.
     *
     * @return {this} This Tween Manager instance.
     */
    killTweensOf: function (target)
    {
        var tweens = this.getTweensOf(target);

        for (var i = 0; i < tweens.length; i++)
        {
            tweens[i].destroy();
        }

        return this;
    },

    /**
     * Pauses this Tween Manager. No Tweens will update while paused.
     *
     * This includes tweens created after this method was called.
     *
     * See `TweenManager#resumeAll` to resume the playback.
     *
     * As of Phaser 3.60 you can also toggle the boolean property `TweenManager.paused`.
     *
     * @method Phaser.Tweens.TweenManager#pauseAll
     * @since 3.0.0
     *
     * @return {this} This Tween Manager instance.
     */
    pauseAll: function ()
    {
        this.paused = true;

        return this;
    },

    /**
     * Resumes playback of this Tween Manager.
     *
     * All active Tweens will continue updating.
     *
     * See `TweenManager#pauseAll` to pause the playback.
     *
     * As of Phaser 3.60 you can also toggle the boolean property `TweenManager.paused`.
     *
     * @method Phaser.Tweens.TweenManager#resumeAll
     * @since 3.0.0
     *
     * @return {this} This Tween Manager instance.
     */
    resumeAll: function ()
    {
        this.paused = false;

        return this;
    },

    /**
     * The Scene that owns this plugin is shutting down.
     *
     * We need to kill and reset all internal properties as well as stop listening to Scene events.
     *
     * @method Phaser.Tweens.TweenManager#shutdown
     * @since 3.0.0
     */
    shutdown: function ()
    {
        this.killAll();

        this.tweens = [];

        var eventEmitter = this.systems.events;

        eventEmitter.off(SceneEvents.UPDATE, this.update, this);
        eventEmitter.off(SceneEvents.SHUTDOWN, this.shutdown, this);
    },

    /**
     * The Scene that owns this plugin is being destroyed.
     * We need to shutdown and then kill off all external references.
     *
     * @method Phaser.Tweens.TweenManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.shutdown();

        this.scene.sys.events.off(SceneEvents.START, this.start, this);

        this.scene = null;
        this.systems = null;
    }

});

PluginCache.register('TweenManager', TweenManager, 'tweens');

module.exports = TweenManager;
