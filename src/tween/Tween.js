/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Tween allows you to alter one or more properties of a target object over a defined period of time.
* This can be used for things such as alpha fading Sprites, scaling them or motion.
*
* Use {@link #to} or {@link #from} to set-up the tween values. You can create multiple tweens on the same object
* by calling Tween.to multiple times on the same Tween. Additional tweens specified in this way become "child" tweens and
* are played through in sequence.
*
* You can use {@link #timeScale} and {@link #reverse} to control the playback of the Tween and its children.
*
* @class Phaser.Tween
* @constructor
* @param {object} target - The target object, such as a Phaser.Sprite or Phaser.Sprite.scale.
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
    * @property {Phaser.TweenManager} manager - Reference to the TweenManager responsible for updating this Tween.
    */
    this.manager = manager;

    /**
    * @property {Array} timeline - An Array of TweenData objects that comprise the different parts of this Tween.
    */
    this.timeline = [];

    /**
    * If set to `true` the current tween will play in reverse.
    * If the tween hasn't yet started this has no effect.
    * If there are child tweens then all child tweens will play in reverse from the current point.
    * @property {boolean} reverse
    * @default
    */
    this.reverse = false;

    /**
    * The speed at which the tweens will run. A value of 1 means it will match the game frame rate. 0.5 will run at half the frame rate. 2 at double the frame rate, etc.
    * If a tweens duration is 1 second but timeScale is 0.5 then it will take 2 seconds to complete.
    * 
    * @property {number} timeScale
    * @default
    */
    this.timeScale = 1;

    /**
    * @property {number} repeatCounter - If the Tween and any child tweens are set to repeat this contains the current repeat count.
    */
    this.repeatCounter = 0;

    /**
    * @property {number} repeatDelay - The amount of time in ms between repeats of this tween and any child tweens.
    */
    this.repeatDelay = 0;

    /**
    * @property {boolean} pendingDelete - True if this Tween is ready to be deleted by the TweenManager.
    * @default
    * @readonly
    */
    this.pendingDelete = false;

    /**
    * The onStart event is fired when the Tween begins. If there is a delay before the tween starts then onStart fires after the delay is finished.
    * It will be sent 2 parameters: the target object and this tween.
    * @property {Phaser.Signal} onStart
    */
    this.onStart = new Phaser.Signal();

    /**
    * The onLoop event is fired if the Tween or any child tween loops.
    * It will be sent 2 parameters: the target object and this tween.
    * @property {Phaser.Signal} onLoop
    */
    this.onLoop = new Phaser.Signal();

    /**
    * The onRepeat event is fired if the Tween and all of its children repeats. If this tween has no children this will never be fired.
    * It will be sent 2 parameters: the target object and this tween.
    * @property {Phaser.Signal} onRepeat
    */
    this.onRepeat = new Phaser.Signal();

    /**
    * The onChildComplete event is fired when the Tween or any of its children completes.
    * Fires every time a child completes unless a child is set to repeat forever.
    * It will be sent 2 parameters: the target object and this tween.
    * @property {Phaser.Signal} onChildComplete
    */
    this.onChildComplete = new Phaser.Signal();

    /**
    * The onComplete event is fired when the Tween and all of its children completes. Does not fire if the Tween is set to loop or repeatAll(-1).
    * It will be sent 2 parameters: the target object and this tween.
    * @property {Phaser.Signal} onComplete
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
    * @readonly
    */
    this.current = 0;

    /**
    * @property {object} properties - Target property cache used when building the child data values.
    */
    this.properties = {};

    /**
    * @property {Phaser.Tween} chainedTween - If this Tween is chained to another this holds a reference to it.
    */
    this.chainedTween = null;

    /**
    * @property {boolean} isPaused - Is this Tween paused or not?
    * @default
    */
    this.isPaused = false;

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
    * @property {?integer} _nextChildDelay - Cache used to handle `delay` before child added.
    * @private
    */
    this._nextChildDelay = null;

};

Phaser.Tween.prototype = {

    /**
    * Sets this tween to be a `to` tween on the properties given.
    *
    * A `to` tween starts at the current value and tweens to the destination value given.
    * For example a Sprite with an `x` coordinate of 100 could be tweened to `x` 200 by giving a properties object of `{ x: 200 }`.
    *
    * The ease function allows you define the rate of change. You can pass either a function such as Phaser.Easing.Circular.Out or a string such as "Circ".
    * "easeIn", "easeOut", and "easeInOut" variants are supported for all ease types.
    *
    * @method Phaser.Tween#to
    * @param {object} properties - An object containing the properties you want to tween, such as `Sprite.x` or `Sound.volume`. Given as a JavaScript object.
    * @param {number} [duration=1000] - Duration of this tween in ms.
    * @param {function|string} [ease=null] - Easing function. If not set it will default to Phaser.Easing.Default, which is Phaser.Easing.Linear.None by default but can be over-ridden.
    * @param {boolean} [autoStart=false] - Set to `true` to allow this tween to start automatically. Otherwise call Tween.start().
    * @param {number} [delay=(previous delay)] - Delay before this tween will start in milliseconds. Defaults to previous {@link #delay} call, or 0.
    * @param {number} [repeat=0] - Should the tween automatically restart once complete? If you want it to run forever set as -1. This only effects this induvidual tween, not any chained tweens.
    * @param {boolean} [yoyo=false] - A tween that yoyos will reverse itself and play backwards automatically. A yoyo'd tween doesn't fire the Tween.onComplete event, so listen for Tween.onLoop instead.
    * @return {Phaser.Tween} This Tween object.
    */
    to: function (properties, duration, ease, autoStart, delay, repeat, yoyo) {

        if (typeof duration === 'undefined') { duration = 1000; }
        if (typeof ease === 'undefined') { ease = Phaser.Easing.Default; }
        if (typeof autoStart === 'undefined') { autoStart = false; }

        if (typeof delay === 'undefined') { delay = this._nextChildDelay || 0; }
        this._nextChildDelay = null;

        if (typeof repeat === 'undefined') { repeat = 0; }
        if (typeof yoyo === 'undefined') { yoyo = false; }

        if (typeof ease === 'string' && this.manager.easeMap[ease])
        {
            ease = this.manager.easeMap[ease];
        }

        if (this.isRunning)
        {
            console.warn('Phaser.Tween.to cannot be called after Tween.start');
            return this;
        }

        this.timeline.push(new Phaser.TweenData(this).to(properties, duration, ease, delay, repeat, yoyo));

        if (autoStart)
        {
            this.start();
        }

        return this;

    },

    /**
    * Sets this tween to be a `from` tween on the properties given.
    *
    * A `from` tween sets the target to the destination value and tweens to its current value.
    * For example a Sprite with an `x` coordinate of 100 tweened from `x` 500 would be set to `x` 500 and then tweened to `x` 100 by giving a properties object of `{ x: 500 }`.
    *
    * The ease function allows you define the rate of change. You can pass either a function such as Phaser.Easing.Circular.Out or a string such as "Circ".
    * "easeIn", "easeOut", and "easeInOut" variants are supported for all ease types.
    *
    * @method Phaser.Tween#from
    * @param {object} properties - An object containing the properties you want to tween., such as `Sprite.x` or `Sound.volume`. Given as a JavaScript object.
    * @param {number} [duration=1000] - Duration of this tween in ms.
    * @param {function|string} [ease=null] - Easing function. If not set it will default to Phaser.Easing.Default, which is Phaser.Easing.Linear.None by default but can be over-ridden.
    * @param {boolean} [autoStart=false] - Set to `true` to allow this tween to start automatically. Otherwise call Tween.start().
    * @param {number} [delay=(previous delay)] - Delay before this tween will start in milliseconds. Defaults to previous {@link #delay} call, or 0.
    * @param {number} [repeat=0] - Should the tween automatically restart once complete? If you want it to run forever set as -1. This only effects this induvidual tween, not any chained tweens.
    * @param {boolean} [yoyo=false] - A tween that yoyos will reverse itself and play backwards automatically. A yoyo'd tween doesn't fire the Tween.onComplete event, so listen for Tween.onLoop instead.
    * @return {Phaser.Tween} This Tween object.
    */
    from: function (properties, duration, ease, autoStart, delay, repeat, yoyo) {

        if (typeof duration === 'undefined') { duration = 1000; }
        if (typeof ease === 'undefined') { ease = Phaser.Easing.Default; }
        if (typeof autoStart === 'undefined') { autoStart = false; }

        if (typeof delay === 'undefined') { delay = this._nextChildDelay || 0; }
        this._nextChildDelay = null;

        if (typeof repeat === 'undefined') { repeat = 0; }
        if (typeof yoyo === 'undefined') { yoyo = false; }

        if (typeof ease === 'string' && this.manager.easeMap[ease])
        {
            ease = this.manager.easeMap[ease];
        }

        if (this.isRunning)
        {
            console.warn('Phaser.Tween.from cannot be called after Tween.start');
            return this;
        }

        this.timeline.push(new Phaser.TweenData(this).from(properties, duration, ease, delay, repeat, yoyo));

        if (autoStart)
        {
            this.start();
        }

        return this;

    },

    /**
    * Starts the Tween running.
    *
    * Can also be called by the autoStart parameter of `Tween.to` or `Tween.from`.
    * This sets the `Tween.isRunning` property to `true` and dispatches a `Tween.onStart` signal.
    *
    * If the Tween has a delay set then nothing will start tweening until the delay has expired.
    *
    * @method Phaser.Tween#start
    * @param {number} [index=0] - If this Tween contains child tweens you can specify which one to start from. The default is zero, i.e. the first tween created.
    * @return {Phaser.Tween} This tween. Useful for method chaining.
    */
    start: function (index) {

        if (typeof index === 'undefined') { index = 0; }

        if (this.game === null || this.target === null || this.timeline.length === 0 || this.isRunning)
        {
            return this;
        }

        // Per `delay`, if not cleared by adding another child it is applied to the first child.
        if (this._nextChildDelay !== null)
        {
            console.warn("Phaser.Tween.start - delay added after all children applied to first child");
            this.timeline[0].delay = this._nextChildDelay;
            this._nextChildDelay = null;
        }

        //  Populate the tween data
        for (var i = 0; i < this.timeline.length; i++)
        {
            //  Build our master property list with the starting values
            for (var property in this.timeline[i].vEnd)
            {
                this.properties[property] = this.target[property] || 0;

                if (!Array.isArray(this.properties[property]))
                {
                    //  Ensures we're using numbers, not strings
                    this.properties[property] *= 1.0;
                }
            }
        }

        for (var i = 0; i < this.timeline.length; i++)
        {
            this.timeline[i].loadValues();
        }

        this.manager.add(this);

        this.isRunning = true;

        if (index < 0 || index > this.timeline.length - 1)
        {
            index = 0;
        }

        this.current = index;

        this.timeline[this.current].start();

        this.onStart.dispatch(this.target, this);

        return this;

    },

    /**
    * Stops the tween if running and flags it for deletion from the TweenManager.
    * If called directly the `Tween.onComplete` signal is not dispatched and no chained tweens are started unless the complete parameter is set to `true`.
    * If you just wish to pause a tween then use Tween.pause instead.
    *
    * @method Phaser.Tween#stop
    * @param {boolean} [complete=false] - Set to `true` to dispatch the Tween.onComplete signal.
    * @return {Phaser.Tween} This tween. Useful for method chaining.
    */
    stop: function (complete) {

        if (typeof complete === 'undefined') { complete = false; }

        this.isRunning = false;

        this._onUpdateCallback = null;
        this._onUpdateCallbackContext = null;

        if (complete)
        {
            this.onComplete.dispatch(this.target, this);

            if (this.chainedTween)
            {
                this.chainedTween.start();
            }
        }

        this.manager.remove(this);

        return this;

    },

    /**
    * Sets the delay in milliseconds (cumulative with other delay calls) for the _next_ child added, if it does not have a delay manually specified.
    *
    * If there are no children added after method is called then this sets the delay of when the _first_ child will start.
    *
    * If an index of -1 is supplied then the delay will apply to all _currently added_ tweens only.
    *
    * The delay is counted from when the tween is started with `Tween.start`.
    * If the tween is already running this method doesn't do anything for the current active tween.
    *
    * @method Phaser.Tween#delay
    * @param {number} duration - The amount of time, in ms, before the _next_ child (see above) will wait before starting.
    * @param {number} [index=(next added child)] - By default delay affects the _next_ added child; specifying an index will affect a particular _existing_ child, or all children is -1 is used.
    * @return {Phaser.Tween} This tween. Useful for method chaining.
    */
    delay: function (duration, index) {

        duration = duration || 0;

        if (typeof index === 'undefined')
        {
            // Apply to next added child (cummulative with any previous delays not yet applied)
            this._nextChildDelay = (this._nextChildDelay || 0) + duration;
            return this;
        }

        if (index === -1)
        {
            for (var i = 0; i < this.timeline.length; i++)
            {
                this.timeline[i].delay = duration;
            }
        }
        else
        {
            this.timeline[index].delay = duration;
        }

        return this;

    },

    /**
    * Sets the number of times the _previously_ added child will repeat.    
    *
    * If an index of -1 is supplied then the delay will apply to all _currently added_ children only.
    *
    * This method has no effect if called before any children have been added.
    *
    * Use {@link #repeatAll} to yoyo this Tween and _all_ of its children.
    *
    * @method Phaser.Tween#repeat
    * @param {number} [total=1] - The number of times to repeat the _previously_ added child.
    * @param {number} [index=(previous child)] - By default this affects the _previous_ added child; specifying an index will affect a particular _existing_ child, or all children is -1 is used.
    * @return {Phaser.Tween} This tween. Useful for method chaining.
    */
    repeat: function (total, index) {

        if (!this.timeline.length) {
            console.warn("Phaser.Tween.repeat - ignored: called before any child added");
            return this;
        }

        if (typeof total === 'undefined') { total = 1; }

        if (typeof index === 'undefined') { index = this.timeline.length - 1; }

        if (index === -1)
        {
            for (var i = 0; i < this.timeline.length; i++)
            {
                this.timeline[i].repeatCounter = total;
            }
        }
        else
        {
            this.timeline[index].repeatCounter = total;
        }

        return this;

    },

    /*
    * Enable/disable the yoyo on the _previously_ added child.
    *
    * A Tween that has yoyo set to true will run through from its starting values to its end values and then play back in reverse from end to start.
    * Used in combination with repeat you can create endless loops.
    *
    * If an index of -1 is supplied then the delay will apply to all _currently added_ children only.
    *
    * This method has no effect if called before any children have been added.
    *
    * Use {@link #yoyoAll} to yoyo this Tween and _all_ of its children.
    *
    * @method Phaser.Tween#yoyo
    * @param {number} [enable=true] - Enable yoyo on the _previously_ added child?
    * @param {number} [index=(previous child)] - By default this affects the _previous_ added child; specifying an index will affect a particular _existing_ child, or all children is -1 is used.
    * @return {Phaser.Tween} This tween. Useful for method chaining.
    */
    yoyo: function(enable, index) {

        if (!this.timeline.length) {
            console.warn("Phaser.Tween.yoyo - ignored: called before any child added");
            return this;
        }

        if (typeof enable === 'undefined') { enable = true; }

        if (typeof index === 'undefined') { index = this.timeline.length - 1; }

        if (index === -1)
        {
            for (var i = 0; i < this.timeline.length; i++)
            {
                this.timeline[i].yoyo = enable;
            }
        }
        else
        {
            this.timeline[index].yoyo = enable;
        }

        return this;

    },

    /**
    * Set easing function this tween will use, i.e. Phaser.Easing.Linear.None.
    * The ease function allows you define the rate of change. You can pass either a function such as Phaser.Easing.Circular.Out or a string such as "Circ".
    * ".easeIn", ".easeOut" and "easeInOut" variants are all supported for all ease types.
    * If you have child tweens and pass -1 as the index value it sets the easing function defined here across all of them.
    *
    * @method Phaser.Tween#easing
    * @param {function|string} ease - The easing function this tween will use, i.e. Phaser.Easing.Linear.None.
    * @param {number} [index=0] - If this tween has more than one child this allows you to target a specific child. If set to -1 it will set the easing function on all children.
    * @return {Phaser.Tween} This tween. Useful for method chaining.
    */
    easing: function (ease, index) {

        if (typeof index === 'undefined') { index = 0; }

        if (typeof ease === 'string' && this.manager.easeMap[ease])
        {
            ease = this.manager.easeMap[ease];
        }

        if (index === -1)
        {
            for (var i = 0; i < this.timeline.length; i++)
            {
                this.timeline[i].easingFunction = ease;
            }
        }
        else
        {
            this.timeline[index].easingFunction = ease;
        }

        return this;

    },

    /**
    * Sets the interpolation function the tween will use. By default it uses Phaser.Math.linearInterpolation.
    * Also available: Phaser.Math.bezierInterpolation and Phaser.Math.catmullRomInterpolation.
    * The interpolation function is only used if the target properties is an array.
    * If you have child tweens and pass -1 as the index value and it will set the interpolation function across all of them.
    *
    * @method Phaser.Tween#interpolation
    * @param {function} interpolation - The interpolation function to use (Phaser.Math.linearInterpolation by default)
    * @param {number} [index=0] - If this tween has more than one child this allows you to target a specific child. If set to -1 it will set the interpolation function on all children.
    * @return {Phaser.Tween} This tween. Useful for method chaining.
    */
    interpolation: function (interpolation, index) {

        if (typeof index === 'undefined') { index = 0; }

        if (index === -1)
        {
            for (var i = 0; i < this.timeline.length; i++)
            {
                this.timeline[i].interpolationFunction = interpolation;
            }
        }
        else
        {
            this.timeline[index].interpolationFunction = interpolation;
        }

        return this;

    },

    /**
    * Set how many times this tween and all of its children will repeat.
    *
    * A tween (A) with 3 children (B,C,D) with a `repeatAll` value of 2 would play as: ABCDABCD before completing.
    * When all child tweens have completed Tween.onLoop will be dispatched.
    *
    * @method Phaser.Tween#repeat
    * @param {number} total - How many times this tween and all children should repeat before completing. Set to zero to remove an active repeat. Set to -1 to repeat forever.
    * @return {Phaser.Tween} This tween. Useful for method chaining.
    */
    repeatAll: function (total) {

        if (typeof total === 'undefined') { total = 0; }

        this.repeatCounter = total;

        return this;

    },

    /**
    * This method allows you to chain tweens together.
    *
    * Any tween chained to this tween will have its `Tween.start` method called
    * as soon as this tween completes. If this tween never completes (i.e. repeatAll or loop is set) then the chain will never progress.
    * Note that `Tween.onComplete` will fire when *this* tween completes, not when the whole chain completes.
    * For that you should listen to `onComplete` on the final tween in your chain.
    * 
    * If you pass multiple tweens to this method they will be joined into a single long chain.
    * For example if this is Tween A and you pass in B, C and D then B will be chained to A, C will be chained to B and D will be chained to C.
    * Any previously chained tweens that may have been set will be overwritten.
    *
    * @method Phaser.Tween#chain
    * @param {...Phaser.Tween} tweens - One or more tweens that will be chained to this one.
    * @return {Phaser.Tween} This tween. Useful for method chaining.
    */
    chain: function () {

        var i = arguments.length;

        while (i--)
        {
            if (i > 0)
            {
                arguments[i - 1].chainedTween = arguments[i];
            }
            else
            {
                this.chainedTween = arguments[i];
            }
        }

        return this;

    },

    /**
    * Enables the looping of this tween and all children.
    *
    * A `value` of `true` is the same as setting `Tween.repeatAll(-1)`;
    * a `value` of `false` it is the same as setting `Tween.repeatAll(0)`.
    *
    * Usage:
    *
    *     game.add.tween(p).to({ x: 700 }, 1000, Phaser.Easing.Linear.None, true)
    *       .to({ y: 300 }, 1000, Phaser.Easing.Linear.None)
    *       .to({ x: 0 }, 1000, Phaser.Easing.Linear.None)
    *       .to({ y: 0 }, 1000, Phaser.Easing.Linear.None)
    *       .loopAll();
    *
    * If this tween has no children this method has no effect.
    *
    * @method Phaser.Tween#loop
    * @param {boolean} [value=true] - If `true` this tween and any child tweens will loop once they reach the end. Set to `false` to remove an active loop.
    * @return {Phaser.Tween} This tween. Useful for method chaining.
    */
    loopAll: function (value) {

        if (typeof value === 'undefined') { value = true; }

        if (value)
        {
            this.repeatAll(-1);
        }
        else
        {
            this.repeatAll(0);
        }

        return this;

    },

    /**
    * Sets a callback to be fired each time this tween updates.
    *
    * @method Phaser.Tween#onUpdateCallback
    * @param {function} callback - The callback to invoke each time this tween is updated. Set to `null` to remove an already active callback.
    * @param {object} callbackContext - The context in which to call the onUpdate callback.
    * @return {Phaser.Tween} This tween. Useful for method chaining.
    */
    onUpdateCallback: function (callback, callbackContext) {

        this._onUpdateCallback = callback;
        this._onUpdateCallbackContext = callbackContext;

        return this;

    },

    /**
    * Pauses the tween. Resume playback with Tween.resume.
    *
    * @method Phaser.Tween#pause
    */
    pause: function () {

        this.isPaused = true;

        this._codePaused = true;

        this._pausedTime = this.game.time.time;

    },

    /**
    * This is called by the core Game loop. Do not call it directly, instead use Tween.pause.
    * 
    * @private
    * @method Phaser.Tween#_pause
    */
    _pause: function () {

        if (!this._codePaused)
        {
            this.isPaused = true;

            this._pausedTime = this.game.time.time;
        }

    },

    /**
    * Resumes a paused tween.
    *
    * @method Phaser.Tween#resume
    */
    resume: function () {

        if (this.isPaused)
        {
            this.isPaused = false;

            this._codePaused = false;

            for (var i = 0; i < this.timeline.length; i++)
            {
                if (!this.timeline[i].isRunning)
                {
                    this.timeline[i].startTime += (this.game.time.time - this._pausedTime);
                }
            }
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
            this.resume();
        }

    },

    /**
    * Core tween update function called by the TweenManager. Does not need to be invoked directly.
    *
    * @method Phaser.Tween#update
    * @param {number} time - A timestamp passed in by the TweenManager.
    * @return {boolean} false if the tween and all child tweens have completed and should be deleted from the manager, otherwise true (still active).
    */
    update: function (time) {

        if (this.pendingDelete)
        {
            return false;
        }

        if (this.isPaused)
        {
            return true;
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
            this.onLoop.dispatch(this.target, this);
            return true;
        }
        else if (status === Phaser.TweenData.COMPLETE)
        {
            var complete = false;

            //  What now?
            if (this.reverse)
            {
                this.current--;

                if (this.current < 0)
                {
                    this.current = this.timeline.length - 1;
                    complete = true;
                }
            }
            else
            {
                this.current++;

                if (this.current === this.timeline.length)
                {
                    this.current = 0;
                    complete = true;
                }
            }

            if (complete)
            {
                //  We've reached the start or end of the child tweens (depending on Tween.reverse), should we repeat it?
                if (this.repeatCounter === -1)
                {
                    this.timeline[this.current].start();
                    this.onRepeat.dispatch(this.target, this);
                    return true;
                }
                else if (this.repeatCounter > 0)
                {
                    this.repeatCounter--;

                    this.timeline[this.current].start();
                    this.onRepeat.dispatch(this.target, this);
                    return true;
                }
                else
                {
                    //  No more repeats and no more children, so we're done
                    this.isRunning = false;
                    this.onComplete.dispatch(this.target, this);

                    if (this.chainedTween)
                    {
                        this.chainedTween.start();
                    }

                    return false;
                }
            }
            else
            {
                //  We've still got some children to go
                this.onChildComplete.dispatch(this.target, this);
                this.timeline[this.current].start();
                return true;
            }
        }

    },

    /**
    * This will generate an array populated with the tweened object values from start to end.
    * It works by running the tween simulation at the given frame rate based on the values set-up in Tween.to and Tween.from.
    * It ignores delay and repeat counts and any chained tweens, but does include child tweens.
    * Just one play through of the tween data is returned, including yoyo if set.
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

        if (typeof data === 'undefined') { data = []; }

        //  Populate the tween data
        for (var i = 0; i < this.timeline.length; i++)
        {
            //  Build our master property list with the starting values
            for (var property in this.timeline[i].vEnd)
            {
                this.properties[property] = this.target[property] || 0;

                if (!Array.isArray(this.properties[property]))
                {
                    //  Ensures we're using numbers, not strings
                    this.properties[property] *= 1.0;
                }
            }
        }

        for (var i = 0; i < this.timeline.length; i++)
        {
            this.timeline[i].loadValues();
        }

        for (var i = 0; i < this.timeline.length; i++)
        {
            data = data.concat(this.timeline[i].generateData(frameRate));
        }

        return data;

    }

};

/**
* Enables the looping of this tween and all child tweens: see {@link #loopAll}
*
* @method Phaser.Tween#loop
* @param {boolean} [value=true] - If `true` this tween and any child tweens will loop once they reach the end. Set to `false` to remove an active loop.
* @return {Phaser.Tween} This tween. Useful for method chaining.
* @deprecated This is an alias for {@link #loopAll}.
*/
Phaser.Tween.prototype.loop = Phaser.Tween.prototype.loopAll;

/**
* @name Phaser.Tween#totalDuration
* @property {Phaser.TweenData} totalDuration - Gets the total duration of this Tween, including all child tweens, in milliseconds.
*/
Object.defineProperty(Phaser.Tween.prototype, 'totalDuration', {

    get: function () {

        var total = 0;

        for (var i = 0; i < this.timeline.length; i++)
        {
            total += this.timeline[i].duration;
        }

        return total;

    }

});

Phaser.Tween.prototype.constructor = Phaser.Tween;
