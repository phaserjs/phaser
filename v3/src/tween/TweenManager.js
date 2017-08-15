
var Class = require('../utils/Class');
var TweenBuilder = require('./TweenBuilder');

var TweenManager = new Class({

    initialize:

    function TweenManager (scene)
    {
        //  The Scene the Tween Manager belongs to (tweens are Scene specific, not Game global)
        this.scene = scene;

        this.timeScale = 1;

        this._add = [];
        this._pending = [];
        this._active = [];
        this._destroy = [];

        this._toProcess = 0;
    },

    //  Scene is starting up
    boot: function ()
    {
        this.timeScale = 1;
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

    begin: function ()
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
        var idx = this._pending.indexOf(tween);

        if (idx !== -1)
        {
            this._pending.splice(idx, 1);
        }

        this._add.push(tween);

        this._toProcess++;
    },

    setGlobalTimeScale: function (value)
    {
        this.timeScale = value;

        return this;
    },

    getGlobalTimeScale: function ()
    {
        return this.timeScale;
    },

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

    //  Single Target or an Array of targets
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

    //  Single Target only
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

    // kill: function (vars, target)
    // {
    // },

    killAll: function ()
    {
        var tweens = this.getAllTweens();

        for (var i = 0; i < tweens.length; i++)
        {
            tweens[i].stop();
        }

        return this;
    },

    //  Single Target or an Array of targets
    killTweensOf: function (target)
    {
        var tweens = this.getTweensOf(target);

        for (var i = 0; i < tweens.length; i++)
        {
            tweens[i].stop();
        }

        return this;
    },

    pauseAll: function ()
    {
        var list = this._active;

        for (var i = 0; i < list.length; i++)
        {
            list[i].pause();
        }

        return this;
    },

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
    * Passes all Tweens to the given callback.
    *
    * @method each
    * @param {function} callback - The function to call.
    * @param {object} [thisArg] - Value to use as `this` when executing callback.
    * @param {...*} [arguments] - Additional arguments that will be passed to the callback, after the child.
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

    //  Scene that owns this manager is shutting down
    shutdown: function ()
    {
        this.killAll();

        this._add = [];
        this._pending = [];
        this._active = [];
        this._destroy = [];

        this._toProcess = 0;
    },

    //  Game level nuke
    destroy: function ()
    {
        this.shutdown();
    }

});

module.exports = TweenManager;
