/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var NumberTweenBuilder = require('./builders/NumberTweenBuilder');
var PluginManager = require('../boot/PluginManager');
var TimelineBuilder = require('./builders/TimelineBuilder');
var TWEEN_CONST = require('./tween/const');
var TweenBuilder = require('./builders/TweenBuilder');

//  Phaser.Tweens.TweenManager

/**
 * @classdesc
 * [description]
 *
 * @class TweenManager
 * @memberOf Phaser.Tweens
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 */
var TweenManager = new Class({

    initialize:

    function TweenManager (scene)
    {
        /**
         * [description]
         *
         * @name Phaser.Tweens.TweenManager#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * [description]
         *
         * @name Phaser.Tweens.TweenManager#systems
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
         * @name Phaser.Tweens.TweenManager#timeScale
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.timeScale = 1;

        /**
         * [description]
         *
         * @name Phaser.Tweens.TweenManager#_add
         * @type {array}
         * @private
         * @since 3.0.0
         */
        this._add = [];

        /**
         * [description]
         *
         * @name Phaser.Tweens.TweenManager#_pending
         * @type {array}
         * @private
         * @since 3.0.0
         */
        this._pending = [];

        /**
         * [description]
         *
         * @name Phaser.Tweens.TweenManager#_active
         * @type {array}
         * @private
         * @since 3.0.0
         */
        this._active = [];

        /**
         * [description]
         *
         * @name Phaser.Tweens.TweenManager#_destroy
         * @type {array}
         * @private
         * @since 3.0.0
         */
        this._destroy = [];

        /**
         * [description]
         *
         * @name Phaser.Tweens.TweenManager#_toProcess
         * @type {integer}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._toProcess = 0;
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.TweenManager#boot
     * @since 3.0.0
     */
    boot: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.on('preupdate', this.preUpdate, this);
        eventEmitter.on('update', this.update, this);
        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);

        this.timeScale = 1;
    },

    /**
     * Create a Tween Timeline and return it, but do NOT add it to the active or pending Tween lists.
     *
     * @method Phaser.Tweens.TweenManager#createTimeline
     * @since 3.0.0
     *
     * @param {object} config - [description]
     *
     * @return {Phaser.Tweens.Timeline} [description]
     */
    createTimeline: function (config)
    {
        return TimelineBuilder(this, config);
    },

    /**
     * Create a Tween Timeline and add it to the active Tween list/
     *
     * @method Phaser.Tweens.TweenManager#timeline
     * @since 3.0.0
     *
     * @param {object} config - [description]
     *
     * @return {Phaser.Tweens.Timeline} [description]
     */
    timeline: function (config)
    {
        var timeline = TimelineBuilder(this, config);

        if (!timeline.paused)
        {
            this._add.push(timeline);

            this._toProcess++;
        }

        return timeline;
    },

    /**
     * Create a Tween and return it, but do NOT add it to the active or pending Tween lists.
     *
     * @method Phaser.Tweens.TweenManager#create
     * @since 3.0.0
     *
     * @param {object} config - [description]
     *
     * @return {Phaser.Tweens.Tween} [description]
     */
    create: function (config)
    {
        return TweenBuilder(this, config);
    },

    /**
     * Create a Tween and add it to the active Tween list.
     *
     * @method Phaser.Tweens.TweenManager#add
     * @since 3.0.0
     *
     * @param {object} config - [description]
     *
     * @return {Phaser.Tweens.Tween} [description]
     */
    add: function (config)
    {
        var tween = TweenBuilder(this, config);

        this._add.push(tween);

        this._toProcess++;

        return tween;
    },

    /**
     * Add an existing tween into the active Tween list.
     *
     * @method Phaser.Tweens.TweenManager#existing
     * @since 3.0.0
     *
     * @param {Phaser.Tweens.Tween} tween - [description]
     *
     * @return {Phaser.Tweens.TweenManager} This Tween Manager object.
     */
    existing: function (tween)
    {
        this._add.push(tween);

        this._toProcess++;

        return this;
    },

    /**
     * Create a Tween and add it to the active Tween list.
     *
     * @method Phaser.Tweens.TweenManager#addCounter
     * @since 3.0.0
     *
     * @param {object} config - [description]
     *
     * @return {Phaser.Tweens.Tween} [description]
     */
    addCounter: function (config)
    {
        var tween = NumberTweenBuilder(this, config);

        this._add.push(tween);

        this._toProcess++;

        return tween;
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.TweenManager#preUpdate
     * @since 3.0.0
     */
    preUpdate: function ()
    {
        if (this._toProcess === 0)
        {
            //  Quick bail
            return;
        }

        var list = this._destroy;
        var active = this._active;
        var i;
        var tween;

        //  Clear the 'destroy' list
        for (i = 0; i < list.length; i++)
        {
            tween = list[i];

            //  Remove from the 'active' array
            var idx = active.indexOf(tween);

            if (idx !== -1)
            {
                tween.state = TWEEN_CONST.REMOVED;
                active.splice(idx, 1);
            }
        }

        list.length = 0;

        //  Process the addition list
        //  This stops callbacks and out of sync events from populating the active array mid-way during the update

        list = this._add;

        for (i = 0; i < list.length; i++)
        {
            tween = list[i];

            if (tween.state === TWEEN_CONST.PENDING_ADD)
            {
                //  Return true if the Tween should be started right away, otherwise false
                if (tween.init())
                {
                    tween.play();

                    this._active.push(tween);
                }
                else
                {
                    this._pending.push(tween);
                }
            }
        }

        list.length = 0;

        this._toProcess = 0;
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.TweenManager#update
     * @since 3.0.0
     *
     * @param {number} timestamp - [description]
     * @param {number} delta - [description]
     */
    update: function (timestamp, delta)
    {
        //  Process active tweens
        var list = this._active;
        var tween;

        //  Scale the delta
        delta *= this.timeScale;

        for (var i = 0; i < list.length; i++)
        {
            tween = list[i];

            //  If Tween.update returns 'true' then it means it has completed,
            //  so move it to the destroy list
            if (tween.update(timestamp, delta))
            {
                this._destroy.push(tween);
                this._toProcess++;
            }
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.TweenManager#makeActive
     * @since 3.0.0
     *
     * @param {Phaser.Tweens.Tween} tween - [description]
     *
     * @return {Phaser.Tweens.TweenManager} This Tween Manager object.
     */
    makeActive: function (tween)
    {
        if (this._add.indexOf(tween) !== -1 || this._active.indexOf(tween) !== -1)
        {
            return;
        }

        var idx = this._pending.indexOf(tween);

        if (idx !== -1)
        {
            this._pending.splice(idx, 1);
        }

        this._add.push(tween);

        tween.state = TWEEN_CONST.PENDING_ADD;

        this._toProcess++;

        return this;
    },

    /**
     * Passes all Tweens to the given callback.
     *
     * @method Phaser.Tweens.TweenManager#each
     * @since 3.0.0
     *
     * @param {function} callback - [description]
     * @param {object} [scope] - [description]
     * @param {...*} [arguments] - [description]
     */
    each: function (callback, scope)
    {
        var args = [ null ];

        for (var i = 1; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }

        for (var texture in this.list)
        {
            args[0] = this.list[texture];

            callback.apply(scope, args);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.TweenManager#getAllTweens
     * @since 3.0.0
     *
     * @return {Phaser.Tweens.Tween[]} [description]
     */
    getAllTweens: function ()
    {
        var list = this._active;
        var output = [];

        for (var i = 0; i < list.length; i++)
        {
            output.push(list[i]);
        }

        return output;
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.TweenManager#getGlobalTimeScale
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    getGlobalTimeScale: function ()
    {
        return this.timeScale;
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.TweenManager#getTweensOf
     * @since 3.0.0
     *
     * @param {(object|array)} target - [description]
     *
     * @return {Phaser.Tweens.Tween[]} [description]
     */
    getTweensOf: function (target)
    {
        var list = this._active;
        var tween;
        var output = [];
        var i;

        if (Array.isArray(target))
        {
            for (i = 0; i < list.length; i++)
            {
                tween = list[i];

                for (var t = 0; t < target.length; i++)
                {
                    if (tween.hasTarget(target[t]))
                    {
                        output.push(tween);
                    }
                }
            }
        }
        else
        {
            for (i = 0; i < list.length; i++)
            {
                tween = list[i];

                if (tween.hasTarget(target))
                {
                    output.push(tween);
                }
            }
        }

        return output;
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.TweenManager#isTweening
     * @since 3.0.0
     *
     * @param {object} target - [description]
     *
     * @return {boolean} [description]
     */
    isTweening: function (target)
    {
        var list = this._active;
        var tween;

        for (var i = 0; i < list.length; i++)
        {
            tween = list[i];

            if (tween.hasTarget(target) && tween.isPlaying())
            {
                return true;
            }
        }

        return false;
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.TweenManager#killAll
     * @since 3.0.0
     *
     * @return {Phaser.Tweens.TweenManager} [description]
     */
    killAll: function ()
    {
        var tweens = this.getAllTweens();

        for (var i = 0; i < tweens.length; i++)
        {
            tweens[i].stop();
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.TweenManager#killTweensOf
     * @since 3.0.0
     *
     * @param {(object|array)} target - [description]
     *
     * @return {Phaser.Tweens.TweenManager} [description]
     */
    killTweensOf: function (target)
    {
        var tweens = this.getTweensOf(target);

        for (var i = 0; i < tweens.length; i++)
        {
            tweens[i].stop();
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.TweenManager#pauseAll
     * @since 3.0.0
     *
     * @return {Phaser.Tweens.TweenManager} [description]
     */
    pauseAll: function ()
    {
        var list = this._active;

        for (var i = 0; i < list.length; i++)
        {
            list[i].pause();
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.TweenManager#resumeAll
     * @since 3.0.0
     *
     * @return {Phaser.Tweens.TweenManager} [description]
     */
    resumeAll: function ()
    {
        var list = this._active;

        for (var i = 0; i < list.length; i++)
        {
            list[i].resume();
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.TweenManager#setGlobalTimeScale
     * @since 3.0.0
     *
     * @param {float} value - [description]
     *
     * @return {Phaser.Tweens.TweenManager} [description]
     */
    setGlobalTimeScale: function (value)
    {
        this.timeScale = value;

        return this;
    },

    /**
     * Scene that owns this manager is shutting down.
     *
     * @method Phaser.Tweens.TweenManager#shutdown
     * @since 3.0.0
     */
    shutdown: function ()
    {
        this.killAll();

        this._add = [];
        this._pending = [];
        this._active = [];
        this._destroy = [];

        this._toProcess = 0;
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.TweenManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.shutdown();
    }

});

PluginManager.register('TweenManager', TweenManager, 'tweens');

module.exports = TweenManager;
