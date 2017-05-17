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

    this.ease;
    this.duration = 1000;
    this.yoyo = false;
    this.repeat = 0;
    this.loop = false;
    this.delay = 0;
    this.onCompleteDelay = 0;
    this.elasticity = 0;

    // this.startAt

    this.progress = 0;
    this.startTime = 0;
    this.elapsed = 0;

    // 0 = forward, 1 = reverse
    this.direction = 0;

    this.useFrames = false;
    this.paused = false;
    this.running = false;
    this.pending = true;

    //  Callbacks

    this.onStart;
    this.onStartScope;
    this.onStartParams;

    this.onUpdate;
    this.onUpdateScope;
    this.onUpdateParams;

    this.onRepeat;
    this.onRepeatScope;
    this.onRepeatParams;

    this.onComplete;
    this.onCompleteScope;
    this.onCompleteParams;

    this.callbackScope;
};

Tween.prototype.constructor = Tween;

Tween.prototype = {

    init: function ()
    {
        console.log('Tween init', (!this.paused));

        return (!this.paused);
    },

    start: function (timestep)
    {
        console.log('Tween started');

        this.startTime = timestep;

        this.start = this.target[this.key];
        this.current = this.start;
        this.end = this.value();

        this.paused = false;
        this.running = true;
    },

    update: function (timestep, delta)
    {
        if (!this.running)
        {
            return;
        }

        this.elapsed += delta;

        if (this.elapsed > this.duration)
        {
            this.elapsed = this.duration;
        }

        this.progress = this.elapsed / this.duration;

        var p = this.ease(this.progress);

        this.current = this.start + ((this.end - this.start) * p);

        this.target[this.key] = this.current;

        if (this.progress === 1)
        {
            this.running = false;
        }
    },

    eventCallback: function (type, callback, params, scope)
    {
        var types = [ 'onStart', 'onUpdate', 'onRepeat', 'onComplete' ];

        if (types.indexOf(type) !== -1)
        {
            this[type] = callback;
            this[type + 'Params'] = params;
            this[type + 'Scope'] = scope;
        }

        return this;
    },

    timeScale: function ()
    {

    }

};

module.exports = Tween;
