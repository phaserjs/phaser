var Class = require('../utils/Class');
var GetFastValue = require('../utils/object/GetFastValue');

var TimerEvent = new Class({

    initialize:

    function TimerEvent (config)
    {
        /**
        * @property {number} delay - The delay in ms at which this TimerEvent fires.
        */
        this.delay = 0;

        /**
        * @property {number} repeatCount - If this TimerEvent repeats it will do so this many times.
        */
        this.repeatCount = 0;

        /**
        * @property {boolean} loop - True if this TimerEvent loops, otherwise false.
        */
        this.loop = false;

        /**
        * @property {function} callback - The callback that will be called when the TimerEvent occurs.
        */
        this.callback;

        /**
        * @property {object} callbackContext - The context in which the callback will be called.
        */
        this.callbackScope;

        /**
        * @property {any[]} arguments - Additional arguments to be passed to the callback.
        */
        this.args;

        //  Scale the time causing this TimerEvent to update
        this.timeScale = 1;

        //  Start this many MS into the elapsed (useful if you want a long duration with repeat, but for the first loop to fire quickly)
        this.startAt = 0;

        this.elapsed = 0;

        this.paused = false;

        this.hasDispatched = false;

        this.reset(config);
    },

    reset: function (config)
    {
        this.delay = GetFastValue(config, 'delay', 0);

        this.repeatCount = GetFastValue(config, 'repeat', 0);

        this.loop = GetFastValue(config, 'loop', false);

        this.callback = GetFastValue(config, 'callback', undefined);

        this.callbackScope = GetFastValue(config, 'callbackScope', this.callback);

        this.args = GetFastValue(config, 'args', []);

        this.timeScale = GetFastValue(config, 'timeScale', 1);

        this.startAt = GetFastValue(config, 'startAt', 0);

        this.paused = GetFastValue(config, 'paused', false);

        //  This works for setting an infinite repeat too
        if (this.repeatCount === -1)
        {
            this.loop = true;
        }

        this.elapsed = 0;
        this.hasDispatched = false;

        return this;
    },

    getProgress: function ()
    {
        return (this.elapsed / this.delay);
    },

    getElapsed: function ()
    {
        return this.elapsed;
    },

    getElapsedSeconds: function ()
    {
        return this.elapsed * 0.001;
    },

    remove: function (dispatchCallback)
    {
        if (dispatchCallback === undefined) { dispatchCallback = false; }

        this.elapsed = this.delay;

        this.hasDispatched = !!dispatchCallback;

        this.loop = false;
        this.repeatCount = 0;
    },

    //  Called internaly, private
    destroy: function ()
    {
        this.callback = undefined;
        this.callbackScope = undefined;
        this.args.length = 0;
    }

});

module.exports = TimerEvent;
