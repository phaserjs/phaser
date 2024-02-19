/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ArrayRemove = require('../utils/array/Remove');
var Class = require('../utils/Class');
var Flatten = require('../utils/array/Flatten');
var NumberTweenBuilder = require('./builders/NumberTweenBuilder');
var PluginCache = require('../plugins/PluginCache');
var SceneEvents = require('../scene/events');
var StaggerBuilder = require('./builders/StaggerBuilder');
var Tween = require('./tween/Tween');
var TweenBuilder = require('./builders/TweenBuilder');
var TweenChain = require('./tween/TweenChain');
var TweenChainBuilder = require('./builders/TweenChainBuilder');

/**
 * @classdesc
 * The Tween Manager is a default Scene Plugin which controls and updates Tweens.
 *
 * A tween is a way to alter one or more properties of a target object over a defined period of time.
 *
 * Tweens are created by calling the `add` method and passing in the configuration object.
 *
 * ```js
 * const logo = this.add.image(100, 100, 'logo');
 *
 * this.tweens.add({
 *   targets: logo,
 *   x: 600,
 *   ease: 'Power1',
 *   duration: 2000
 * });
 * ```
 *
 * See the `TweenBuilderConfig` for all of the options you have available.
 *
 * Playback will start immediately unless the tween has been configured to be paused.
 *
 * Please note that a Tween will not manipulate any target property that begins with an underscore.
 *
 * Tweens are designed to be 'fire-and-forget'. They automatically destroy themselves once playback
 * is complete, to free-up memory and resources. If you wish to keep a tween after playback, i.e. to
 * play it again at a later time, then you should set the `persist` property to `true` in the config.
 * However, doing so means it's entirely up to _you_ to destroy the tween when you're finished with it,
 * otherwise it will linger in memory forever.
 *
 * If you wish to chain Tweens together for sequential playback, see the `TweenManager.chain` method.
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
         * The Scene Systems Event Emitter.
         *
         * @name Phaser.Tweens.TweenManager#events
         * @type {Phaser.Events.EventEmitter}
         * @since 3.60.0
         */
        this.events = scene.sys.events;

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

        /**
         * The time the Tween Manager was updated.
         *
         * @name Phaser.Tweens.TweenManager#time
         * @type {number}
         * @since 3.60.0
         */
        this.time = 0;

        /**
         * The time the Tween Manager was started.
         *
         * @name Phaser.Tweens.TweenManager#startTime
         * @type {number}
         * @since 3.60.0
         */
        this.startTime = 0;

        /**
         * The time the Tween Manager should next update.
         *
         * @name Phaser.Tweens.TweenManager#nextTime
         * @type {number}
         * @since 3.60.0
         */
        this.nextTime = 0;

        /**
         * The time the Tween Manager previously updated.
         *
         * @name Phaser.Tweens.TweenManager#prevTime
         * @type {number}
         * @since 3.60.0
         */
        this.prevTime = 0;

        /**
         * The maximum amount of time, in milliseconds, the browser can
         * lag for, before lag smoothing is applied.
         *
         * See the `TweenManager.setLagSmooth` method for further details.
         *
         * @name Phaser.Tweens.TweenManager#maxLag
         * @type {number}
         * @default 500
         * @since 3.60.0
         */
        this.maxLag = 500;

        /**
         * The amount of time, in milliseconds, that is used to set the
         * delta when lag smoothing is applied.
         *
         * See the `TweenManager.setLagSmooth` method for further details.
         *
         * @name Phaser.Tweens.TweenManager#lagSkip
         * @type {number}
         * @default 33
         * @since 3.60.0
         */
        this.lagSkip = 33;

        /**
         * An internal value that holds the fps rate.
         *
         * @name Phaser.Tweens.TweenManager#gap
         * @type {number}
         * @since 3.60.0
         */
        this.gap = 1000 / 240;

        this.events.once(SceneEvents.BOOT, this.boot, this);
        this.events.on(SceneEvents.START, this.start, this);
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
        this.events.once(SceneEvents.DESTROY, this.destroy, this);
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
        this.timeScale = 1;
        this.paused = false;

        this.startTime = Date.now();
        this.prevTime = this.startTime;
        this.nextTime = this.gap;

        this.events.on(SceneEvents.UPDATE, this.update, this);
        this.events.once(SceneEvents.SHUTDOWN, this.shutdown, this);
    },

    /**
     * Create a Tween and return it, but does not add it to this Tween Manager.
     *
     * Please note that a Tween will not manipulate any target property that begins with an underscore.
     *
     * In order to play this tween, you'll need to add it to a Tween Manager via
     * the `TweenManager.existing` method.
     *
     * You can optionally pass an **array** of Tween Configuration objects to this method and it will create
     * one Tween per entry in the array. If an array is given, an array of tweens is returned.
     *
     * @method Phaser.Tweens.TweenManager#create
     * @since 3.0.0
     *
     * @param {Phaser.Types.Tweens.TweenBuilderConfig|Phaser.Types.Tweens.TweenBuilderConfig[]|object|object[]} config - A Tween Configuration object. Or an array of Tween Configuration objects.
     *
     * @return {Phaser.Tweens.Tween|Phaser.Tweens.Tween[]} The created Tween, or an array of Tweens if an array of tween configs was provided.
     */
    create: function (config)
    {
        if (!Array.isArray(config))
        {
            config = [ config ];
        }

        var result = [];

        for (var i = 0; i < config.length; i++)
        {
            var tween = config[i];

            if (tween instanceof Tween || tween instanceof TweenChain)
            {
                //  Allow them to send an array of mixed instances and configs
                result.push(tween);
            }
            else if (Array.isArray(tween.tweens))
            {
                result.push(TweenChainBuilder(this, tween));
            }
            else
            {
                result.push(TweenBuilder(this, tween));
            }
        }

        return (result.length === 1) ? result[0] : result;
    },

    /**
     * Create a Tween and add it to this Tween Manager by passing a Tween Configuration object.
     *
     * Example, run from within a Scene:
     *
     * ```js
     * const logo = this.add.image(100, 100, 'logo');
     *
     * this.tweens.add({
     *   targets: logo,
     *   x: 600,
     *   ease: 'Power1',
     *   duration: 2000
     * });
     * ```
     *
     * See the `TweenBuilderConfig` for all of the options you have available.
     *
     * Playback will start immediately unless the tween has been configured to be paused.
     *
     * Please note that a Tween will not manipulate any target property that begins with an underscore.
     *
     * Tweens are designed to be 'fire-and-forget'. They automatically destroy themselves once playback
     * is complete, to free-up memory and resources. If you wish to keep a tween after playback, i.e. to
     * play it again at a later time, then you should set the `persist` property to `true` in the config.
     * However, doing so means it's entirely up to _you_ to destroy the tween when you're finished with it,
     * otherwise it will linger in memory forever.
     *
     * If you wish to chain Tweens together for sequential playback, see the `TweenManager.chain` method.
     *
     * @method Phaser.Tweens.TweenManager#add
     * @since 3.0.0
     *
     * @param {Phaser.Types.Tweens.TweenBuilderConfig|Phaser.Types.Tweens.TweenChainBuilderConfig|Phaser.Tweens.Tween|Phaser.Tweens.TweenChain} config - A Tween Configuration object, or a Tween or TweenChain instance.
     *
     * @return {Phaser.Tweens.Tween} The created Tween.
     */
    add: function (config)
    {
        var tween = config;
        var tweens = this.tweens;

        if (tween instanceof Tween || tween instanceof TweenChain)
        {
            tweens.push(tween.reset());
        }
        else
        {
            if (Array.isArray(tween.tweens))
            {
                tween = TweenChainBuilder(this, tween);
            }
            else
            {
                tween = TweenBuilder(this, tween);
            }

            tweens.push(tween.reset());
        }

        return tween;
    },

    /**
     * Create multiple Tweens and add them all to this Tween Manager, by passing an array of Tween Configuration objects.
     *
     * See the `TweenBuilderConfig` for all of the options you have available.
     *
     * Playback will start immediately unless the tweens have been configured to be paused.
     *
     * Please note that a Tween will not manipulate any target property that begins with an underscore.
     *
     * Tweens are designed to be 'fire-and-forget'. They automatically destroy themselves once playback
     * is complete, to free-up memory and resources. If you wish to keep a tween after playback, i.e. to
     * play it again at a later time, then you should set the `persist` property to `true` in the config.
     * However, doing so means it's entirely up to _you_ to destroy the tween when you're finished with it,
     * otherwise it will linger in memory forever.
     *
     * If you wish to chain Tweens together for sequential playback, see the `TweenManager.chain` method.
     *
     * @method Phaser.Tweens.TweenManager#addMultiple
     * @since 3.60.0
     *
     * @param {Phaser.Types.Tweens.TweenBuilderConfig[]|object[]} configs - An array of Tween Configuration objects.
     *
     * @return {Phaser.Tweens.Tween[]} An array of created Tweens.
     */
    addMultiple: function (configs)
    {
        var tween;
        var result = [];
        var tweens = this.tweens;

        for (var i = 0; i < configs.length; i++)
        {
            tween = configs[i];

            if (tween instanceof Tween || tween instanceof TweenChain)
            {
                tweens.push(tween.reset());
            }
            else
            {
                if (Array.isArray(tween.tweens))
                {
                    tween = TweenChainBuilder(this, tween);
                }
                else
                {
                    tween = TweenBuilder(this, tween);
                }

                tweens.push(tween.reset());
            }

            result.push(tween);
        }

        return result;
    },

    /**
     * Create a sequence of Tweens, chained to one-another, and add them to this Tween Manager.
     *
     * The tweens are played in order, from start to finish. You can optionally set the chain
     * to repeat as many times as you like. Once the chain has finished playing, or repeating if set,
     * all tweens in the chain will be destroyed automatically. To override this, set the `persist`
     * argument to 'true'.
     *
     * Playback will start immediately unless the _first_ Tween has been configured to be paused.
     *
     * Please note that Tweens will not manipulate any target property that begins with an underscore.
     *
     * @method Phaser.Tweens.TweenManager#chain
     * @since 3.60.0
     *
     * @param {Phaser.Types.Tweens.TweenChainBuilderConfig|object} tweens - A Tween Chain configuration object.
     *
     * @return {Phaser.Tweens.TweenChain} The Tween Chain instance.
     */
    chain: function (config)
    {
        var chain = TweenChainBuilder(this, config);

        this.tweens.push(chain.init());

        return chain;
    },

    /**
     * Returns an array containing this Tween and all Tweens chained to it,
     * in the order in which they will be played.
     *
     * If there are no chained Tweens an empty array is returned.
     *
     * @method Phaser.Tweens.TweenManager#getChainedTweens
     * @since 3.60.0
     *
     * @param {Phaser.Tweens.Tween} tween - The Tween to return the chain from.
     *
     * @return {Phaser.Tweens.Tween[]} An array of the chained tweens, or an empty array if there aren't any.
     */
    getChainedTweens: function (tween)
    {
        return tween.getChainedTweens();
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
            this.tweens.push(tween.reset());
        }

        return this;
    },

    /**
     * Create a Number Tween and add it to the active Tween list.
     *
     * A Number Tween is a special kind of tween that doesn't have a target. Instead,
     * it allows you to tween between 2 numeric values. The default values are
     * `0` and `1`, but you can change them via the `from` and `to` properties.
     *
     * You can get the current tweened value via the `Tween.getValue()` method.
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

        this.tweens.push(tween.reset());

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
     * Set the limits that are used when a browser encounters lag, or delays that cause the elapsed
     * time between two frames to exceed the expected amount. If this occurs, the Tween Manager will
     * act as if the 'skip' amount of times has passed, in order to maintain strict tween sequencing.
     *
     * This is enabled by default with the values 500ms for the lag limit and 33ms for the skip.
     *
     * You should not set these to low values, as it won't give time for the browser to ever
     * catch-up with itself and reclaim sync.
     *
     * Call this method with no arguments to disable smoothing.
     *
     * Call it with the arguments `500` and `33` to reset to the defaults.
     *
     * @method Phaser.Tweens.TweenManager#setLagSmooth
     * @since 3.60.0
     *
     * @param {number} [limit=0] - If the browser exceeds this amount, in milliseconds, it will act as if the 'skip' amount has elapsed instead.
     * @param {number} [skip=0] - The amount, in milliseconds, to use as the step delta should the browser lag beyond the 'limit'.
     *
     * @return {this} This Tween Manager instance.
     */
    setLagSmooth: function (limit, skip)
    {
        if (limit === undefined) { limit = 1 / 1e-8; }
        if (skip === undefined) { skip = 0; }

        this.maxLag = limit;
        this.lagSkip = Math.min(skip, this.maxLag);

        return this;
    },

    /**
     * Limits the Tween system to run at a particular frame rate.
     *
     * You should not set this _above_ the frequency of the browser,
     * but instead can use it to throttle the frame rate lower, should
     * you need to in certain situations.
     *
     * @method Phaser.Tweens.TweenManager#setFps
     * @since 3.60.0
     *
     * @param {number} [fps=240] - The frame rate to tick at.
     *
     * @return {this} This Tween Manager instance.
     */
    setFps: function (fps)
    {
        if (fps === undefined) { fps = 240; }

        this.gap = 1000 / fps;
        this.nextTime = this.time * 1000 + this.gap;

        return this;
    },

    /**
     * Internal method that calculates the delta value, along with the other timing values,
     * and returns the new delta.
     *
     * You should not typically call this method directly.
     *
     * @method Phaser.Tweens.TweenManager#getDelta
     * @since 3.60.0
     *
     * @param {boolean} [tick=false] - Is this a manual tick, or an automated tick?
     *
     * @return {number} The new delta value.
     */
    getDelta: function (tick)
    {
        var elapsed = Date.now() - this.prevTime;

        if (elapsed > this.maxLag)
        {
            this.startTime += elapsed - this.lagSkip;
        }

        this.prevTime += elapsed;

        var time = this.prevTime - this.startTime;
        var overlap = time - this.nextTime;
        var delta = time - this.time * 1000;

        if (overlap > 0 || tick)
        {
            time /= 1000;
            this.time = time;
            this.nextTime += overlap + (overlap >= this.gap ? 4 : this.gap - overlap);
        }
        else
        {
            delta = 0;
        }

        return delta;
    },

    /**
     * Manually advance the Tween system by one step.
     *
     * This will update all Tweens even if the Tween Manager is currently
     * paused.
     *
     * @method Phaser.Tweens.TweenManager#tick
     * @since 3.60.0
     *
     * @return {this} This Tween Manager instance.
     */
    tick: function ()
    {
        this.step(true);

        return this;
    },

    /**
     * Internal update handler.
     *
     * Calls `TweenManager.step` as long as the Tween Manager has not
     * been paused.
     *
     * @method Phaser.Tweens.TweenManager#update
     * @since 3.0.0
     */
    update: function ()
    {
        if (!this.paused)
        {
            this.step(false);
        }
    },

    /**
     * Updates all Tweens belonging to this Tween Manager.
     *
     * Called automatically by `update` and `tick`.
     *
     * @method Phaser.Tweens.TweenManager#step
     * @since 3.60.0
     *
     * @param {boolean} [tick=false] - Is this a manual tick, or an automated tick?
     */
    step: function (tick)
    {
        if (tick === undefined) { tick = false; }

        var delta = this.getDelta(tick);

        if (delta <= 0)
        {
            //  If we've got a negative delta, skip this step
            return;
        }

        this.processing = true;

        var i;
        var tween;
        var toDestroy = [];
        var list = this.tweens;

        //  By not caching the length we can immediately update tweens added
        //  this frame (such as chained tweens)
        for (i = 0; i < list.length; i++)
        {
            tween = list[i];

            //  If Tween.update returns 'true' then it means it has completed,
            //  so move it to the destroy list
            if (tween.update(delta))
            {
                toDestroy.push(tween);
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

                if (idx > -1 && (tween.isPendingRemove() || tween.isDestroyed()))
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
            tween.setPendingRemoveState();
        }
        else
        {
            //  Remove it immediately
            ArrayRemove(this.tweens, tween);

            tween.setRemovedState();
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

        tween.setActiveState();

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

        tween.setActiveState();

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
     * Returns an array containing references to all Tweens in this Tween Manager.
     *
     * It is safe to mutate the returned array. However, acting upon any of the Tweens
     * within it, will adjust those stored in this Tween Manager, as they are passed
     * by reference and not cloned.
     *
     * If you wish to get tweens for a specific target, see `getTweensOf`.
     *
     * @method Phaser.Tweens.TweenManager#getTweens
     * @since 3.0.0
     *
     * @return {Phaser.Tweens.Tween[]} A new array containing references to all Tweens.
     */
    getTweens: function ()
    {
        return this.tweens.slice();
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
     * @param {(object|object[])} target - The target to look for. Provide an array to look for multiple targets.
     *
     * @return {Phaser.Tweens.Tween[]} A new array containing all Tweens which affect the given target(s).
     */
    getTweensOf: function (target)
    {
        var output = [];
        var list = this.tweens;

        if (!Array.isArray(target))
        {
            target = [ target ];
        }
        else
        {
            target = Flatten(target);
        }

        var targetLen = target.length;

        for (var i = 0; i < list.length; i++)
        {
            var tween = list[i];

            for (var t = 0; t < targetLen; t++)
            {
                if (!tween.isDestroyed() && tween.hasTarget(target[t]))
                {
                    output.push(tween);
                }
            }
        }

        return output;
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
        var tweens = (this.processing) ? this.getTweens() : this.tweens;

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

        this.events.off(SceneEvents.UPDATE, this.update, this);
        this.events.off(SceneEvents.SHUTDOWN, this.shutdown, this);
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

        this.events.off(SceneEvents.START, this.start, this);

        this.scene = null;
        this.events = null;
    }

});

PluginCache.register('TweenManager', TweenManager, 'tweens');

module.exports = TweenManager;
