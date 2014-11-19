/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Create a new Tween.
*
* @class Phaser.Tween
* @constructor
* @param {object} target - The target object, such as a Phaser.Sprite or property like Phaser.Sprite.scale.
* @param {Phaser.Game} game - Current game instance.
* @param {Phaser.TweenManager} manager - The TweenManager responsible for looking after this Tween.
*/
Phaser.Tween = function (target, game, manager) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

    /**
    * @property {object} target - The target object, such as a Phaser.Sprite or property like Phaser.Sprite.scale.
    */
    this.target = target;

    /**
    * @property {object} parent - Reference to the parent tween if part of a chained tween.
    */
    // this.parent = null;

    /**
    * @property {Phaser.TweenManager} manager - Reference to the TweenManager responsible for updating this Tween.
    */
    this.manager = manager;

    /**
    * @property {Array} timeline - An Array of TweenData objects that comprise the different parts of this Tween.
    */
    this.timeline = [];

    /**
    * @property {boolean} reverse - If set to `true` the current tween will play in reverse. If the tween hasn't yet started this has no effect. If there are child tweens then all child tweens will play in reverse from the current point.
    * @default
    */
    this.reverse = false;

    /**
    * @property {number} speed - The speed at which the tweens will run. A value of 1 means it will match the game frame rate. 0.5 will run at half the frame rate. 2 at double the frame rate and so on.
    * @default
    */
    this.speed = 1;

    /**
    * @property {number} repeatCounter - If the Tween and any child tweens are set to repeat this contains the current repeat count.
    */
    this.repeatCounter = 0;

    /**
    * @property {boolean} _onStartCallbackFired - Private flag.
    * @private
    * @default
    */
    // this._onStartCallbackFired = false;

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
    * @property {boolean} pendingDelete - True if this Tween is ready to be deleted by the TweenManager.
    * @default
    * @readOnly
    */
    this.pendingDelete = false;

    //  Move all of these to TweenManager?

    /**
    * @property {Phaser.Signal} onStart - The onStart event is fired when the Tween begins. If there is a delay before the tween starts then onStart fires after the delay is finished.
    */
    this.onStart = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onStart - The onStart event is fired when the Tween begins. If there is a delay before the tween starts then onStart fires after the delay is finished.
    */
    this.onChildStart = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onLoop - The onLoop event is fired if the Tween loops. If there are chained tweens it fires after all the child tweens have completed.
    */
    this.onLoop = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onComplete - The onComplete event is fired when the Tween completes. Does not fire if the Tween is set to loop.
    */
    this.onComplete = new Phaser.Signal();

    /**
    * @property {boolean} isRunning - If the tween is running this is set to true, otherwise false. Tweens that are in a delayed state or waiting to start are considered as being running.
    * @default
    */
    this.isRunning = false;

    /**
    * @property {number} current - The current Tween child being run.
    * @default
    * @readOnly
    */
    this.current = 0;

};

Phaser.Tween.prototype = {

    /**
    * Sets this tween to be a `to` tween on the properties given. A `to` tween starts at the current value and tweens to the destination value given.
    * For example a Sprite with an `x` coordinate of 100 could be tweened to `x` 200 by giving a properties object of `{ x: 200 }`.
    * The ease function allows you define the rate of change. You can pass either a function such as Phaser.Easing.Circular.Out or a string such as "Circ".
    * ".easeIn", ".easeOut" and "easeInOut" variants are all supported for all ease types.
    *
    * @method Phaser.Tween#to
    * @param {object} properties - An object containing the properties you want to tween., such as `Sprite.x` or `Sound.volume`. Given as a JavaScript object.
    * @param {number} [duration=1000] - Duration of this tween in ms.
    * @param {function|string} [ease=null] - Easing function. If not set it will default to Phaser.Easing.Default, which is Phaser.Easing.Linear.None by default but can be over-ridden.
    * @param {boolean} [autoStart=false] - Set to `true` to allow this tween to start automatically. Otherwise call Tween.start().
    * @param {number} [delay=0] - Delay before this tween will start in milliseconds. Defaults to 0, no delay.
    * @param {number} [repeat=0] - Should the tween automatically restart once complete? If you want it to run forever set as -1. This only effects this induvidual tween, not any chained tweens.
    * @param {boolean} [yoyo=false] - A tween that yoyos will reverse itself and play backwards automatically. A yoyo'd tween doesn't fire the Tween.onComplete event, so listen for Tween.onLoop instead.
    * @return {Phaser.Tween} This Tween object.
    */
    to: function (properties, duration, ease, autoStart, delay, repeat, yoyo) {

        if (typeof duration === 'undefined') { duration = 1000; }
        if (typeof ease === 'undefined') { ease = Phaser.Easing.Default; }
        if (typeof autoStart === 'undefined') { autoStart = false; }
        if (typeof delay === 'undefined') { delay = 0; }
        if (typeof repeat === 'undefined') { repeat = 0; }
        if (typeof yoyo === 'undefined') { yoyo = false; }

        if (typeof ease === 'string' && this.manager.easeMap[ease])
        {
            ease = this.manager.easeMap[ease];
        }

        this.timeline.push(new Phaser.TweenData(this).to(properties, duration, ease, autoStart, delay, repeat, yoyo));

        if (autoStart)
        {
            this.start();
        }

        return this;

    },

    /**
    * Sets this tween to be a `from` tween on the properties given. A `from` tween starts at the given value and tweens to the current values.
    * For example a Sprite with an `x` coordinate of 100 could be tweened from `x: 200` by giving a properties object of `{ x: 200 }`.
    * The ease function allows you define the rate of change. You can pass either a function such as Phaser.Easing.Circular.Out or a string such as "Circ".
    * ".easeIn", ".easeOut" and "easeInOut" variants are all supported for all ease types.
    *
    * @method Phaser.Tween#from
    * @param {object} properties - An object containing the properties you want to tween., such as `Sprite.x` or `Sound.volume`. Given as a JavaScript object.
    * @param {number} [duration=1000] - Duration of this tween in ms.
    * @param {function|string} [ease=null] - Easing function. If not set it will default to Phaser.Easing.Default, which is Phaser.Easing.Linear.None by default but can be over-ridden.
    * @param {boolean} [autoStart=false] - Set to `true` to allow this tween to start automatically. Otherwise call Tween.start().
    * @param {number} [delay=0] - Delay before this tween will start in milliseconds. Defaults to 0, no delay.
    * @param {number} [repeat=0] - Should the tween automatically restart once complete? If you want it to run forever set as -1. This only effects this induvidual tween, not any chained tweens.
    * @param {boolean} [yoyo=false] - A tween that yoyos will reverse itself and play backwards automatically. A yoyo'd tween doesn't fire the Tween.onComplete event, so listen for Tween.onLoop instead.
    * @return {Phaser.Tween} This Tween object.
    */
    from: function(properties, duration, ease, autoStart, delay, repeat, yoyo) {

        if (typeof duration === 'undefined') { duration = 1000; }
        if (typeof ease === 'undefined') { ease = Phaser.Easing.Default; }
        if (typeof autoStart === 'undefined') { autoStart = false; }
        if (typeof delay === 'undefined') { delay = 0; }
        if (typeof repeat === 'undefined') { repeat = 0; }
        if (typeof yoyo === 'undefined') { yoyo = false; }

        if (typeof ease === 'string' && this.manager.easeMap[ease])
        {
            ease = this.manager.easeMap[ease];
        }

        this.timeline.push(new Phaser.TweenData(this).from(properties, duration, ease, autoStart, delay, repeat, yoyo));

        if (autoStart)
        {
            this.start();
        }

        return this;

    },

    /**
    * Starts the tween running. Can also be called by the autoStart parameter of `Tween.to.`
    * This sets the Tween.isRunning property to true and fires the onStartCallback if one is defined.
    * If the Tween has a delay set then nothing will start tweening until that delay has expired.
    *
    * @method Phaser.Tween#start
    * @param {number} [index=0] - If this Tween contains child tweens you can specify which one to start from. The default is zero, i.e. the first tween created.
    * @return {Phaser.Tween} This tween. Useful for method chaining.
    */
    start: function (index) {

        if (this.game === null || this.target === null || this.timeline.length === 0)
        {
            return this;
        }

        if (typeof index === 'undefined') { index = 0; }

        this.manager.add(this);

        this.isRunning = true;

        this._onStartCallbackFired = false;

        // this.startTime = this.game.time.time + this._delay;

        if (index < 0 || index > this.timeline.length - 1)
        {
            index = 0;
        }

        this.current = index;

        this.timeline[this.current].start();

        return this;

    },

    /**
    * Stops the tween if running and removes it from the TweenManager.
    * If called directly and there are any `onComplete` callbacks or events they are not dispatched.
    * Any chained or child tweens will be ignored.
    *
    * @method Phaser.Tween#stop
    * @return {Phaser.Tween} This tween. Useful for method chaining.
    */
    stop: function () {

        this.isRunning = false;

        this._onUpdateCallback = null;
        this._onStartCallbackFired = false;

        this.manager.remove(this);

        return this;

    },

    /**
    * Sets a delay time in ms before this tween will start.
    * The delay is invoked as soon as you call `Tween.start`.
    *
    * @method Phaser.Tween#delay
    * @param {number} time - The amount of time in ms that the Tween should wait until it begins, once `Tween.start` is called.
    * @return {Phaser.Tween} This tween. Useful for method chaining.
    */
    delay: function (time) {

        this._delay = time;

        return this;

    },

    /**
    * Sets the number of times this Tween will repeat.
    * If you have chained tweens this value sets the number of times *all* of the children will repeat before this Tween ends.
    *
    * @method Phaser.Tween#repeat
    * @param {number} total - How many times to repeat. Set to zero to remove an active repeat. Set to -1 to repeat forever.
    * @return {Phaser.Tween} This tween. Useful for method chaining.
    */
    repeat: function (total) {

        this.repeatCounter = total;

        return this;

    },

    /**
    * A Tween that has yoyo set to true will run through from its starting values to its end values and then play back in reverse from end to start.
    * Used in combination with repeat you can create endless loops.
    * If you have chained tweens this value sets the number of times *all* of the children
    *
    * @method Phaser.Tween#yoyo
    * @param {boolean} yoyo - Set to true to yoyo this tween.
    * @return {Phaser.Tween} This tween. Useful for method chaining.
    */
    yoyo: function(yoyo) {

        this.yoyo = yoyo;

        if (yoyo && this.repeatCounter === 0)
        {
            this.repeatCounter = 1;
        }

        return this;

    },

    /**
    * Set easing function this tween will use, i.e. Phaser.Easing.Linear.None.
    *
    * @method Phaser.Tween#easing
    * @param {function} easing - The easing function this tween will use, i.e. Phaser.Easing.Linear.None.
    * @return {Phaser.Tween} This tween. Useful for method chaining.
    */
    easing: function (easing) {

        this.easingFunction = easing;
        return this;

    },

    /**
    * Set interpolation function the tween will use, by default it uses Phaser.Math.linearInterpolation.
    * Also available: Phaser.Math.bezierInterpolation and Phaser.Math.catmullRomInterpolation.
    *
    * @method Phaser.Tween#interpolation
    * @param {function} interpolation - The interpolation function to use (Phaser.Math.linearInterpolation by default)
    * @return {Phaser.Tween} This tween. Useful for method chaining.
    */
    interpolation: function (interpolation) {

        this.interpolationFunction = interpolation;
        return this;

    },

    /**
    * You can chain tweens together by passing a reference to the chain function. This enables one tween to call another on completion.
    * You can pass as many tweens as you like to this function, they will each be chained in sequence.
    *
    * @method Phaser.Tween#chain
    * @return {Phaser.Tween} This tween. Useful for method chaining.
    */
    chain: function () {

        this.chainedTweens = arguments;
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
    * @param {boolean} [value=true] - If true this tween and any chained tweens will loop once they reach the end. Set to false to remove an active loop.
    * @return {Phaser.Tween} This tween. Useful for method chaining.
    */
    loop: function(value) {

        if (typeof value === 'undefined') { value = true; }

        this._loop = true;

        return this;

    },

    /**
    * Sets a callback to be fired each time this tween updates.
    *
    * @method Phaser.Tween#onUpdateCallback
    * @param {function} callback - The callback to invoke each time this tween is updated.
    * @param {object} callbackContext - The context in which to call the onUpdate callback.
    * @return {Phaser.Tween} This tween. Useful for method chaining.
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

            this.startTime += (this.game.time.now - this._pausedTime);
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
            this.startTime += this.game.time.pauseDuration;
            this._paused = false;
        }

    },

    /**
    * Core tween update function called by the TweenManager. Does not need to be invoked directly.
    *
    * @method Phaser.Tween#update
    * @param {number} time - A timestamp passed in by the TweenManager.
    * @return {boolean} false if the tween and all chained tweens have completed and should be deleted from the manager, otherwise true (still active).
    */
    update: function (time) {

        if (this.pendingDelete)
        {
            return false;
        }

        // if (this._paused || time < this.startTime)
        if (this._paused)
        {
            return true;
        }

        if (this._onStartCallbackFired === false)
        {
            this.onStart.dispatch(this.target);
            this._onStartCallbackFired = true;
        }
 
        var status = this.timeline[this.current].update(time);

        if (status === Phaser.TweenData.PENDING)
        {
            return true;
        }
        else if (status === Phaser.TweenData.RUNNING)
        {
            if (this._onUpdateCallback !== null)
            {
                this._onUpdateCallback.call(this._onUpdateCallbackContext, this, this.timeline[this.current].value, this.timeline[this.current]);
            }

            //  In case the update callback modifies this tween
            return this.isRunning;
        }
        else if (status === Phaser.TweenData.LOOPED)
        {
            this.onLoop.dispatch(this.target, this.timeline[this.current]);
            return true;
        }
        else if (status === Phaser.TweenData.COMPLETE)
        {
            if (this.current < this.timeline.length - 1)
            {
                this.current++;
                this.timeline[this.current].start();
                return true;
            }
            else
            {
                //  No more tweens in the chain
                this.isRunning = false;
                this.onComplete.dispatch(this.target, this.timeline[this.current]);
                return false;
            }

        }

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

        if (this.game === null || this.target === null)
        {
            return null;
        }

        this.startTime = 0;

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
                this._valuesEnd[property] = [this.target[property]].concat(this._valuesEnd[property]);
            }

            this._valuesStart[property] = this.target[property];

            if (!Array.isArray(this._valuesStart[property]))
            {
                this._valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
            }

            this._valuesStartRepeat[property] = this._valuesStart[property] || 0;
        }

        //  Simulate the tween. We will run for frameRate * (this.duration / 1000) (ms)
        var time = 0;
        var total = Math.floor(frameRate * (this.duration / 1000));
        var tick = this.duration / total;

        var output = [];

        while (total--)
        {
            var property;

            var percent = (time - this.startTime) / this.duration;
            percent = percent > 1 ? 1 : percent;

            var value = this.easingFunction(percent);
            var blob = {};

            for (property in this._valuesEnd)
            {
                var start = this._valuesStart[property] || 0;
                var end = this._valuesEnd[property];

                if (end instanceof Array)
                {
                    blob[property] = this.interpolationFunction(end, value);
                }
                else
                {
                    if (typeof end === 'string')
                    {
                        //  Parses relative end values with start as base (e.g.: +10, -3)
                        end = start + parseFloat(end, 10);
                    }
                    else if (typeof end === 'number')
                    {
                        //  Protect against non numeric properties.
                        blob[property] = start + (end - start) * value;
                    }
                }
            }

            output.push(blob);

            time += tick;
        }

        var blob = {};

        for (property in this._valuesEnd)
        {
            blob[property] = this._valuesEnd[property];
        }

        output.push(blob);

        if (this.yoyo)
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

    }

};

Phaser.Tween.prototype.constructor = Phaser.Tween;
