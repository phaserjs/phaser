
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

    this._add = [];
    this._pending = [];
    this._active = [];
    this._destroy = [];
};

TweenManager.prototype.constructor = TweenManager;

TweenManager.prototype = {

    boot: function ()
    {
        //  State is starting up
    },

    add: function (config)
    {
        var tweens = TweenBuilder(this, config);

        if (tweens.length === 1)
        {
            return tweens[0];
        }
        else
        {
            return tweens;
        }
    },

    queue: function (tween)
    {
        this._add.push(tween);

        return tween;
    },

    //  Add a 'to' GSAP equivalent?

    exists: function (tween)
    {
    },

    get: function (target)
    {
    },

    update: function (timestamp, delta)
    {
        var list = this._add;
        var i;
        var tween;

        //  Process the addition list first
        //  This stops callbacks and out of sync events from populating the active array mid-way during the update
        if (list.length)
        {
            for (i = 0; i < list.length; i++)
            {
                tween = list[i];

                //  Return true if the Tween should be started right away, otherwise false
                if (tween.init())
                {
                    tween.start(timestamp);

                    this._active.push(tween);
                }
                else
                {
                    this._pending.push(tween);
                }
            }

            list.length = 0;
        }

        //  Process active tweens
        list = this._active;

        for (i = 0; i < list.length; i++)
        {
            tween = list[i];

            tween.update(timestamp, delta);
        }
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
