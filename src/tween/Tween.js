/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Tween constructor
* Create a new <code>Tween</code>.
*
* @class Phaser.Tween
* @constructor
* @param {object} object - Target object will be affected by this tween.
* @param {Phaser.Game} game - Current game instance.
* @param {Phaser.TweenManager} manager - The TweenManager responsible for looking after this Tween.
*/
Phaser.Tween = function (object, game, manager) {

    /**
    * Reference to the target object.
    * @property {object} _object
    * @private
    */
    this._object = object;

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

    /**
    * @property {Phaser.TweenManager} _manager - Reference to the TweenManager.
    * @private
    */
    this._manager = manager;

    /**
    * @property {object} _valuesStart - Private value object.
    * @private
    */
    this._valuesStart = {};

    /**
    * @property {object} _valuesEnd - Private value object.
    * @private
    */
    this._valuesEnd = {};

    /**
    * @property {object} _valuesStartRepeat - Private value object.
    * @private
    */
    this._valuesStartRepeat = {};

    /**
    * @property {number} _duration - Private duration counter.
    * @private
    * @default
    */
    this._duration = 1000;

    /**
    * @property {number} _repeat - Private repeat counter.
    * @private
    * @default
    */
    this._repeat = 0;

    /**
    * @property {boolean} _yoyo - Private yoyo flag.
    * @private
    * @default
    */
    this._yoyo = false;

    /**
    * @property {boolean} _reversed - Private reversed flag.
    * @private
    * @default
    */
    this._reversed = false;

    /**
    * @property {number} _delayTime - Private delay counter.
    * @private
    * @default
    */
    this._delayTime = 0;

    /**
    * @property {number} _startTime - Private start time counter.
    * @private
    * @default null
    */
    this._startTime = null;

    /**
    * @property {function} _easingFunction - The easing function used for the tween.
    * @private
    */
    this._easingFunction = Phaser.Easing.Linear.None;

    /**
    * @property {function} _interpolationFunction - The interpolation function used for the tween.
    * @private
    */
    this._interpolationFunction = Phaser.Math.linearInterpolation;

    /**
    * @property {array} _chainedTweens - A private array of chained tweens.
    * @private
    */
    this._chainedTweens = [];

    /**
    * @property {boolean} _onStartCallbackFired - Private flag.
    * @private
    * @default
    */
    this._onStartCallbackFired = false;

    /**
    * @property {function} _onUpdateCallback - An onUpdate callback.
    * @private
    * @default null
    */
    this._onUpdateCallback = null;

    /**
    * @property {object} _onUpdateCallbackContext - The context in which to call the onUpdate callback.
    * @private
    * @default null
    */
    this._onUpdateCallbackContext = null;

    /**
    * @property {boolean} _paused - Is this Tween paused or not?
    * @private
    * @default
    */
    this._paused = false;

    /**
    * @property {number} _pausedTime - Private pause timer.
    * @private
    * @default
    */
    this._pausedTime = 0;

    /**
    * @property {boolean} _codePaused - Was the Tween paused by code or by Game focus loss?
    * @private
    */
    this._codePaused = false;

    /**
    * @property {boolean} pendingDelete - If this tween is ready to be deleted by the TweenManager.
    * @default
    */
    this.pendingDelete = false;

    // Set all starting values present on the target object - why? this will copy loads of properties we don't need - commenting out for now
    // for (var field in object)
    // {
    //     this._valuesStart[field] = parseFloat(object[field], 10);
    // }

    /**
    * @property {Phaser.Signal} onStart - The onStart event is fired when the Tween begins.
    */
    this.onStart = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onLoop - The onLoop event is fired if the Tween loops.
    */
    this.onLoop = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onComplete - The onComplete event is fired when the Tween completes. Does not fire if the Tween is set to loop.
    */
    this.onComplete = new Phaser.Signal();

    /**
    * @property {boolean} isRunning - If the tween is running this is set to true, otherwise false. Tweens that are in a delayed state, waiting to start, are considered as being running.
    * @default
    */
    this.isRunning = false;

};

Phaser.Tween.prototype = {

    /**
    * Sets this tween to be a `to` tween on the properties given. A `to` tween starts at the current value and tweens to the destination value given.
    * For example a Sprite with an `x` coordinate of 100 could be tweened to `x` 200 by giving a properties object of `{ x: 200 }`.
    *
    * @method Phaser.Tween#to
    * @param {object} properties - The properties you want to tween, such as `Sprite.x` or `Sound.volume`. Given as a JavaScript object.
    * @param {number} [duration=1000] - Duration of this tween in ms.
    * @param {function} [ease=null] - Easing function. If not set it will default to Phaser.Easing.Linear.None.
    * @param {boolean} [autoStart=false] - Whether this tween will start automatically or not.
    * @param {number} [delay=0] - Delay before this tween will start, defaults to 0 (no delay). Value given is in ms.
    * @param {number} [repeat=0] - Should the tween automatically restart once complete? If you want it to run forever set as Number.MAX_VALUE. This ignores any chained tweens.
    * @param {boolean} [yoyo=false] - A tween that yoyos will reverse itself and play backwards automatically. A yoyo'd tween doesn't fire the Tween.onComplete event, so listen for Tween.onLoop instead.
    * @return {Phaser.Tween} This Tween object.
    */
    to: function (properties, duration, ease, autoStart, delay, repeat, yoyo) {

        duration = duration || 1000;
        ease = ease || null;
        autoStart = autoStart || false;
        delay = delay || 0;
        repeat = repeat || 0;
        yoyo = yoyo || false;

        if (yoyo && repeat === 0)
        {
            repeat = 1;
        }

        var self;

        if (this._parent)
        {
            self = this._manager.create(this._object);
            this._lastChild.chain(self);
            this._lastChild = self;
        }
        else
        {
            self = this;
            this._parent = this;
            this._lastChild = this;
        }

        self._repeat = repeat;
        self._duration = duration;
        self._valuesEnd = properties;

        if (ease !== null)
        {
            self._easingFunction = ease;
        }

        if (delay > 0)
        {
            self._delayTime = delay;
        }

        self._yoyo = yoyo;

        if (autoStart)
        {
            return this.start();
        }
        else
        {
            return this;
        }

    },

    /**
    * Sets this tween to be a `from` tween on the properties given. A `from` tween starts at the given value and tweens to the current values.
    * For example a Sprite with an `x` coordinate of 100 could be tweened from `x: 200` by giving a properties object of `{ x: 200 }`.
    *
    * @method Phaser.Tween#from
    * @param {object} properties - Properties you want to tween from.
    * @param {number} [duration=1000] - Duration of this tween in ms.
    * @param {function} [ease=null] - Easing function. If not set it will default to Phaser.Easing.Linear.None.
    * @param {boolean} [autoStart=false] - Whether this tween will start automatically or not.
    * @param {number} [delay=0] - Delay before this tween will start, defaults to 0 (no delay). Value given is in ms.
    * @param {number} [repeat=0] - Should the tween automatically restart once complete? If you want it to run forever set as Number.MAX_VALUE. This ignores any chained tweens.
    * @param {boolean} [yoyo=false] - A tween that yoyos will reverse itself and play backwards automatically. A yoyo'd tween doesn't fire the Tween.onComplete event, so listen for Tween.onLoop instead.
    * @return {Phaser.Tween} This Tween object.
    */
    from: function(properties, duration, ease, autoStart, delay, repeat, yoyo) {

        var _cache = {};

        for (var prop in properties)
        {
            _cache[prop] = this._object[prop];
            this._object[prop] = properties[prop];
        }

        return this.to(_cache, duration, ease, autoStart, delay, repeat, yoyo);

    },

    /**
    * Starts the tween running. Can also be called by the autoStart parameter of Tween.to.
    *
    * @method Phaser.Tween#start
    * @return {Phaser.Tween} Itself.
    */
    start: function () {

        if (this.game === null || this._object === null)
        {
            return;
        }

        this._manager.add(this);

        this.isRunning = true;

        this._onStartCallbackFired = false;

        this._startTime = this.game.time.now + this._delayTime;

        for (var property in this._valuesEnd)
        {
            // check if an Array was provided as property value
            if (Array.isArray(this._valuesEnd[property]))
            {
                if (this._valuesEnd[property].length === 0)
                {
                    continue;
                }

                // create a local copy of the Array with the start value at the front
                this._valuesEnd[property] = [this._object[property]].concat(this._valuesEnd[property]);
            }

            this._valuesStart[property] = this._object[property];

            if (!Array.isArray(this._valuesStart[property]))
            {
                this._valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
            }

            this._valuesStartRepeat[property] = this._valuesStart[property] || 0;

        }

        return this;

    },

    /**
    * This will generate an array populated with the tweened object values from start to end.
    * It works by running the tween simulation at the given frame rate based on the values set-up in Tween.to and similar functions.
    * It ignores delay and repeat counts and any chained tweens. Just one play through of tween data is returned, including yoyo if set.
    *
    * @method Phaser.Tween#generateData
    * @param {number} [frameRate=60] - The speed in frames per second that the data should be generated at. The higher the value, the larger the array it creates.
    * @param {array} [data] - If given the generated data will be appended to this array, otherwise a new array will be returned.
    * @return {array} An array of tweened values.
    */
    generateData: function (frameRate, data) {

        if (this.game === null || this._object === null)
        {
            return null;
        }

        this._startTime = 0;

        for (var property in this._valuesEnd)
        {
            // Check if an Array was provided as property value
            if (Array.isArray(this._valuesEnd[property]))
            {
                if (this._valuesEnd[property].length === 0)
                {
                    continue;
                }

                // create a local copy of the Array with the start value at the front
                this._valuesEnd[property] = [this._object[property]].concat(this._valuesEnd[property]);
            }

            this._valuesStart[property] = this._object[property];

            if (!Array.isArray(this._valuesStart[property]))
            {
                this._valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
            }

            this._valuesStartRepeat[property] = this._valuesStart[property] || 0;
        }

        //  Simulate the tween. We will run for frameRate * (this._duration / 1000) (ms)
        var time = 0;
        var total = Math.floor(frameRate * (this._duration / 1000));
        var tick = this._duration / total;

        var output = [];

        while (total--)
        {
            var property;

            var elapsed = (time - this._startTime) / this._duration;
            elapsed = elapsed > 1 ? 1 : elapsed;

            var value = this._easingFunction(elapsed);
            var blob = {};

            for (property in this._valuesEnd)
            {
                var start = this._valuesStart[property] || 0;
                var end = this._valuesEnd[property];

                if (end instanceof Array)
                {
                    blob[property] = this._interpolationFunction(end, value);
                }
                else
                {
                    // Parses relative end values with start as base (e.g.: +10, -3)
                    if (typeof(end) === 'string')
                    {
                        end = start + parseFloat(end, 10);
                    }

                    // protect against non numeric properties.
                    if (typeof(end) === 'number')
                    {
                        blob[property] = start + ( end - start ) * value;
                    }
                }
            }

            output.push(blob);

            time += tick;
        }

        if (this._yoyo)
        {
            var reversed = output.slice();
            reversed.reverse();
            output = output.concat(reversed);
        }

        if (typeof data !== 'undefined')
        {
            data = data.concat(output);

            return data;
        }
        else
        {
            return output;
        }

    },

    /**
    * Stops the tween if running and removes it from the TweenManager. If there are any onComplete callbacks or events they are not dispatched.
    *
    * @method Phaser.Tween#stop
    * @return {Phaser.Tween} Itself.
    */
    stop: function () {

        this.isRunning = false;

        this._onUpdateCallback = null;

        this._manager.remove(this);

        return this;

    },

    /**
    * Sets a delay time before this tween will start.
    *
    * @method Phaser.Tween#delay
    * @param {number} amount - The amount of the delay in ms.
    * @return {Phaser.Tween} Itself.
    */
    delay: function (amount) {

        this._delayTime = amount;
        return this;

    },

    /**
    * Sets the number of times this tween will repeat.
    *
    * @method Phaser.Tween#repeat
    * @param {number} times - How many times to repeat.
    * @return {Phaser.Tween} Itself.
    */
    repeat: function (times) {

        this._repeat = times;

        return this;

    },

    /**
    * A tween that has yoyo set to true will run through from start to finish, then reverse from finish to start.
    * Used in combination with repeat you can create endless loops.
    *
    * @method Phaser.Tween#yoyo
    * @param {boolean} yoyo - Set to true to yoyo this tween.
    * @return {Phaser.Tween} Itself.
    */
    yoyo: function(yoyo) {

        this._yoyo = yoyo;

        if (yoyo && this._repeat === 0)
        {
            this._repeat = 1;
        }

        return this;

    },

    /**
    * Set easing function this tween will use, i.e. Phaser.Easing.Linear.None.
    *
    * @method Phaser.Tween#easing
    * @param {function} easing - The easing function this tween will use, i.e. Phaser.Easing.Linear.None.
    * @return {Phaser.Tween} Itself.
    */
    easing: function (easing) {

        this._easingFunction = easing;
        return this;

    },

    /**
    * Set interpolation function the tween will use, by default it uses Phaser.Math.linearInterpolation.
    * Also available: Phaser.Math.bezierInterpolation and Phaser.Math.catmullRomInterpolation.
    *
    * @method Phaser.Tween#interpolation
    * @param {function} interpolation - The interpolation function to use (Phaser.Math.linearInterpolation by default)
    * @return {Phaser.Tween} Itself.
    */
    interpolation: function (interpolation) {

        this._interpolationFunction = interpolation;
        return this;

    },

    /**
    * You can chain tweens together by passing a reference to the chain function. This enables one tween to call another on completion.
    * You can pass as many tweens as you like to this function, they will each be chained in sequence.
    *
    * @method Phaser.Tween#chain
    * @return {Phaser.Tween} Itself.
    */
    chain: function () {

        this._chainedTweens = arguments;
        return this;

    },

    /**
    * Loop a chain of tweens
    *
    * Usage:
    * game.add.tween(p).to({ x: 700 }, 1000, Phaser.Easing.Linear.None, true)
    * .to({ y: 300 }, 1000, Phaser.Easing.Linear.None)
    * .to({ x: 0 }, 1000, Phaser.Easing.Linear.None)
    * .to({ y: 0 }, 1000, Phaser.Easing.Linear.None)
    * .loop();
    * @method Phaser.Tween#loop
    * @return {Phaser.Tween} Itself.
    */
    loop: function() {

        this._lastChild.chain(this);
        return this;

    },

    /**
    * Sets a callback to be fired each time this tween updates.
    *
    * @method Phaser.Tween#onUpdateCallback
    * @param {function} callback - The callback to invoke each time this tween is updated.
    * @param {object} callbackContext - The context in which to call the onUpdate callback.
    * @return {Phaser.Tween} Itself.
    */
    onUpdateCallback: function (callback, callbackContext) {

        this._onUpdateCallback = callback;
        this._onUpdateCallbackContext = callbackContext;

        return this;

    },

    /**
    * Pauses the tween.
    *
    * @method Phaser.Tween#pause
    */
    pause: function () {

        this._codePaused = true;
        this._paused = true;
        this._pausedTime = this.game.time.now;

    },

    /**
    * This is called by the core Game loop. Do not call it directly, instead use Tween.pause.
    * @method Phaser.Tween#_pause
    * @private
    */
    _pause: function () {

        if (!this._codePaused)
        {
            this._paused = true;
            this._pausedTime = this.game.time.now;
        }

    },

    /**
    * Resumes a paused tween.
    *
    * @method Phaser.Tween#resume
    */
    resume: function () {

        if (this._paused)
        {
            this._paused = false;
            this._codePaused = false;

            this._startTime += (this.game.time.now - this._pausedTime);
        }

    },

    /**
    * This is called by the core Game loop. Do not call it directly, instead use Tween.pause.
    * @method Phaser.Tween#_resume
    * @private
    */
    _resume: function () {

        if (this._codePaused)
        {
            return;
        }
        else
        {
            this._startTime += this.game.time.pauseDuration;
            this._paused = false;
        }

    },

    /**
    * Core tween update function called by the TweenManager. Does not need to be invoked directly.
    *
    * @method Phaser.Tween#update
    * @param {number} time - A timestamp passed in by the TweenManager.
    * @return {boolean} false if the tween has completed and should be deleted from the manager, otherwise true (still active).
    */
    update: function (time) {

        if (this.pendingDelete)
        {
            return false;
        }

        if (this._paused || time < this._startTime)
        {
            return true;
        }

        var property;

        if (time < this._startTime)
        {
            return true;
        }

        if (this._onStartCallbackFired === false)
        {
            this.onStart.dispatch(this._object);
            this._onStartCallbackFired = true;
        }

        var elapsed = (time - this._startTime) / this._duration;
        elapsed = elapsed > 1 ? 1 : elapsed;

        var value = this._easingFunction(elapsed);

        for (property in this._valuesEnd)
        {
            var start = this._valuesStart[property] || 0;
            var end = this._valuesEnd[property];

            if (end instanceof Array)
            {
                this._object[property] = this._interpolationFunction(end, value);
            }
            else
            {
                // Parses relative end values with start as base (e.g.: +10, -3)
                if (typeof(end) === 'string')
                {
                    end = start + parseFloat(end, 10);
                }

                // protect against non numeric properties.
                if (typeof(end) === 'number')
                {
                    this._object[property] = start + ( end - start ) * value;
                }
            }
        }

        if (this._onUpdateCallback !== null)
        {
            this._onUpdateCallback.call(this._onUpdateCallbackContext, this, value);

            if (!this.isRunning)
            {
                return false;
            }
        }

        if (elapsed == 1)
        {
            if (this._repeat > 0)
            {
                if (isFinite(this._repeat))
                {
                    this._repeat--;
                }

                // reassign starting values, restart by making startTime = now
                for (property in this._valuesStartRepeat)
                {
                    if (typeof(this._valuesEnd[property]) === 'string')
                    {
                        this._valuesStartRepeat[property] = this._valuesStartRepeat[property] + parseFloat(this._valuesEnd[property], 10);
                    }

                    if (this._yoyo)
                    {
                        var tmp = this._valuesStartRepeat[property];
                        this._valuesStartRepeat[property] = this._valuesEnd[property];
                        this._valuesEnd[property] = tmp;
                    }

                    this._valuesStart[property] = this._valuesStartRepeat[property];
                }

                if (this._yoyo)
                {
                    this._reversed = !this._reversed;
                }

                this._startTime = time + this._delayTime;

                this.onLoop.dispatch(this._object);

                return true;
            }
            else
            {
                this.isRunning = false;
                this.onComplete.dispatch(this._object);

                for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i ++)
                {
                    this._chainedTweens[i].start(time);
                }

                return false;
            }

        }

        return true;

    }

};

Phaser.Tween.prototype.constructor = Phaser.Tween;
