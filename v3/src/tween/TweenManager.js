
var EventDispatcher = require('../events/EventDispatcher');
var TweenBuilder = require('./TweenBuilder');

var TweenManager = function (state)
{
    //  The State the Tween Manager belongs to (tweens are State specific, not Game global)
    this.state = state;

    /**
    * @property {EventDispatcher} events - Global / Global Game System Events
    */
    this.events = new EventDispatcher(); // should use State event dispatcher?

    //  TODO:
    //  Add _pool array and make the queue re-use objects within it.
    //  Add a pool max size.

    this._add = [];
    this._pending = [];
    this._active = [];
    this._destroy = [];

    this._toProcess = 0;
};

TweenManager.prototype.constructor = TweenManager;

TweenManager.prototype = {

    boot: function ()
    {
        //  State is starting up
    },

    add: function (config)
    {
        var tween = TweenBuilder(this, config);

        this._add.push(tween);

        this._toProcess++;

        return tween;
    },

    timeline: function ()
    {
        // return new Timeline(this);
    },

    //  Add a 'to' GSAP equivalent?

    exists: function (tween)
    {
    },

    get: function (target)
    {
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

    globalTimeScale: function ()
    {
    },

    getAllTweens: function ()
    {
    },

    getTweensOf: function (target)
    {
    },

    isTweening: function (target)
    {
    },

    kill: function (vars, target)
    {
    },

    killAll: function ()
    {
    },

    killTweensOf: function (target)
    {
    },

    pauseAll: function ()
    {
    },

    resumeAll: function ()
    {
    },

    delayedCall: function ()
    {
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

    shutdown: function ()
    {
        //  State is shutting down (swapping to another State)
    }

};

module.exports = TweenManager;
