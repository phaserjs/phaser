
var EventDispatcher = require('../events/EventDispatcher');
var Tween = require('./Tween');

var TweenManager = function (state)
{
    //  The State the Tween Manager belongs to (tweens are State specific, not Game global)
    this.state = state;

    /**
    * @property {EventDispatcher} events - Global / Global Game System Events
    */
    this.events = new EventDispatcher(); // should use State event dispatcher?

    this.pending = [];
    this.active = [];
};

TweenManager.prototype.constructor = TweenManager;

TweenManager.prototype = {

    boot: function ()
    {
        //  State is starting up
    },

    add: function (config)
    {
        var tween = new Tween(this, config);

        this.pending.push(tween);

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
        var list = this.pending;
        var i;

        //  Process the pending list first
        //  This stops callbacks and out of sync events from populating the active array mid-way during the update
        if (list.length)
        {
            for (i = 0; i < list.length; i++)
            {
                list[i].init(timestamp, delta);
            }

            list.length = 0;
        }

        //  Process active tweens
        list = this.active;

        for (i = 0; i < list.length; i++)
        {
            list[i].update(timestamp, delta);
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
