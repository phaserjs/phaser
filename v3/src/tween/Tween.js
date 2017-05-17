var Tween = function (manager, target, key, value)
{
    this.manager = manager;

    this.target = target;

    this.key = key;

    //  A function to call when starting the tween, to populate the 'start' and 'end' values with
    this.value = value;

    this.start;
    this.current;
    this.end;

    this.ease; // the ease function this tween uses
    this.duration = 1000; // duration of the tween in ms/frames, excludes time for yoyo or repeats
    this.yoyo = false; // alternate the tween back to its start position again?
    this.repeat = 0; // number of times to repeat the tween (-1 = forever, same as setting loop=true)
    this.loop = false; // infinitely loop this tween?
    this.delay = 0; // time in ms/frames between tween will start its first run
    this.repeatDelay = 0; // time in ms/frames before repeat will start
    this.onCompleteDelay = 0; // time in ms/frames before the 'onComplete' event fires
    this.elasticity = 0;

    //  Changes the property to be this before starting the tween
    this.startAt;

    this.progress = 0; // between 0 and 1 showing completion of current portion of tween
    this.elapsed = 0; // delta counter
    this.countdown = 0; // delta countdown timer

    this.repeatCounter = 0; // how many repeats are left to run?

    //  0 = Waiting to be added to the TweenManager
    //  1 = Paused (dev needs to invoke Tween.start)
    //  2 = Started, but waiting for delay to expire
    //  3 = Playing Forward
    //  4 = Playing Backwards
    //  5 = Completed
    this.state = 0;

    //  if true then duration, delay, etc values are all frame totals
    this.useFrames = false;

    this.paused = false;

    this.callbacks = {
        onStart: { callback: null, scope: null, params: null },
        onUpdate: { callback: null, scope: null, params: null },
        onRepeat: { callback: null, scope: null, params: null },
        onComplete: { callback: null, scope: null, params: null }
    };

    this.callbackScope;
};

Tween.prototype.constructor = Tween;

Tween.prototype = {

    init: function ()
    {
        this.state = 1;

        return (!this.paused);
    },

    start: function ()
    {
        if (this.state !== 1)
        {
            return;
        }

        this.loadValues();

        if (this.delay > 0)
        {
            this.countdown = this.delay;
            this.state = 2;
        }
    },

    loadValues: function ()
    {
        this.start = this.target[this.key];
        this.current = this.start;
        this.end = this.value();

        if (this.repeat === -1)
        {
            this.loop = true;
        }

        this.repeatCounter = (this.loop) ? Number.MAX_SAFE_INTEGER : this.repeat;

        this.state = 3;
    },

    update: function (timestep, delta)
    {
        if (this.state === 2)
        {
            //  Waiting for delay to expire
            this.countdown -= (this.useFrames) ? 1 : delta;

            if (this.countdown <= 0)
            {
                this.state = 3;
            }
        }

        if (this.state === 3)
        {
            //  Playing forwards
            this.forward(delta);
        }
        else if (this.state === 4)
        {
            //  Playing backwards
            this.backward(delta);
        }

        //  Complete? Delete from the Tween Manager
        return (this.state !== 5);
    },

    //  Merge with Backwards and include in update?
    forward: function (delta)
    {
        var elapsed = this.elapsed;
        var duration = this.duration;

        elapsed += (this.useFrames) ? 1 : delta;

        if (elapsed > duration)
        {
            elapsed = duration;
        }

        var progress = elapsed / duration;

        var p = this.ease(progress, 0.1, this.elasticity);

        //  Optimize
        this.current = this.start + ((this.end - this.start) * p);

        this.target[this.key] = this.current;

        this.elapsed = elapsed;
        this.progress = progress;

        if (progress === 1)
        {
            //  Tween has reached end
            //  Do we yoyo or repeat?

            this.state = this.processRepeat();
        }
    },

    backward: function (delta)
    {
        var elapsed = this.elapsed;
        var duration = this.duration;

        elapsed += (this.useFrames) ? 1 : delta;

        if (elapsed > duration)
        {
            elapsed = duration;
        }

        var progress = elapsed / duration;

        var p = this.ease(1 - progress, 0.1, this.elasticity);

        //  Optimize
        this.current = this.start + ((this.end - this.start) * p);

        this.target[this.key] = this.current;

        this.elapsed = elapsed;
        this.progress = progress;

        if (progress === 1)
        {
            //  Tween has reached start
            //  Do we yoyo or repeat?

            this.state = this.processRepeat();
        }
    },

    processRepeat: function ()
    {
        //  Playing forward, and Yoyo is enabled?
        if (this.state === 3 && this.yoyo)
        {
            //  Play backwards
            this.elapsed = 0;
            this.progress = 0;

            return 4;
        }
        else if (this.repeatCounter > 0)
        {
            this.repeatCounter--;

            //  Reset the elapsed
            this.current = this.start;
            this.elapsed = 0;
            this.progress = 0;

            //  Delay?
            if (this.repeatDelay > 0)
            {
                this.countdown = this.repeatDelay;

                return 2;
            }
            else
            {
                return 3;
            }
        }

        return 5;
    },

    eventCallback: function (type, callback, params, scope)
    {
        var types = [ 'onStart', 'onUpdate', 'onRepeat', 'onComplete' ];

        if (types.indexOf(type) !== -1)
        {
            this.callbacks[type] = { callback: callback, scope: scope, params: params };
        }

        return this;
    },

    timeScale: function ()
    {

    }

};

module.exports = Tween;
