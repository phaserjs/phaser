var Class = require('../utils/Class');
var NumberTweenBuilder = require('./builders/NumberTweenBuilder');
var PluginManager = require('../plugins/PluginManager');
var TimelineBuilder = require('./builders/TimelineBuilder');
var TWEEN_CONST = require('./tween/const');
var TweenBuilder = require('./builders/TweenBuilder');

//  Phaser.Tweens.TweenManager

var TweenManager = new Class({

    initialize:

    function TweenManager (scene)
    {
        //  The Scene that owns this plugin
        this.scene = scene;

        this.systems = scene.sys;

        if (!scene.sys.settings.isBooted)
        {
            scene.sys.events.once('boot', this.boot, this);
        }

        this.timeScale = 1;

        this._add = [];
        this._pending = [];
        this._active = [];
        this._destroy = [];

        this._toProcess = 0;
    },

    boot: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.on('preupdate', this.preUpdate, this);
        eventEmitter.on('update', this.update, this);
        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);

        this.timeScale = 1;
    },

    //  Create a Tween Timeline and return it, but do NOT add it to the active or pending Tween lists
    createTimeline: function (config)
    {
        return TimelineBuilder(this, config);
    },

    //  Create a Tween Timeline and add it to the active Tween list
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

    //  Create a Tween and return it, but do NOT add it to the active or pending Tween lists
    create: function (config)
    {
        return TweenBuilder(this, config);
    },

    //  Create a Tween and add it to the active Tween list
    add: function (config)
    {
        var tween = TweenBuilder(this, config);

        this._add.push(tween);

        this._toProcess++;

        return tween;
    },

    //  Add an existing tween into the active Tween list
    existing: function (tween)
    {
        this._add.push(tween);

        this._toProcess++;

        return this;
    },

    //  Create a Tween and add it to the active Tween list
    addCounter: function (config)
    {
        var tween = NumberTweenBuilder(this, config);

        this._add.push(tween);

        this._toProcess++;

        return tween;
    },

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

        list.length = 0;

        this._toProcess = 0;
    },

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

    // Passes all Tweens to the given callback.

    /**
     * [description]
     *
     * @method Phaser.Tweens.TweenManager#each
     * @since 3.0.0
     *
     * @param {function} callback - [description]
     * @param {object} [thisArg] - [description]
     * @param {...*} [arguments] - [description]
     */
    each: function (callback, thisArg)
    {
        var args = [ null ];

        for (var i = 1; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }

        for (var texture in this.list)
        {
            args[0] = this.list[texture];

            callback.apply(thisArg, args);
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
     * @param {object|array} target - [description]
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
     * @param {any} target - [description]
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
     * @param {object|array} target - [description]
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

    //  Scene that owns this manager is shutting down

    /**
     * [description]
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
