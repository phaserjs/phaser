/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Phaser.Tween contains at least one TweenData object. It contains all of the tween data values, such as the
* starting and ending values, the ease function, interpolation and duration. The Tween acts as a timeline manager for
* TweenData objects and can contain multiple TweenData objects.
*
* @class Phaser.TweenData
* @constructor
* @param {Phaser.Tween} parent - The Tween that owns this TweenData object.
*/
Phaser.TweenData = function (parent) {

    /**
    * @property {Phaser.Tween} parent - The Tween which owns this TweenData.
    */
    this.parent = parent;

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = parent.game;

    /**
    * @property {object} vStart - An object containing the values at the start of the tween.
    * @private
    */
    this.vStart = {};

    /**
    * @property {object} vStartCache - Cached starting values.
    * @private
    */
    this.vStartCache = {};

    /**
    * @property {object} vEnd - An object containing the values at the end of the tween.
    * @private
    */
    this.vEnd = {};

    /**
    * @property {object} vEndCache - Cached ending values.
    * @private
    */
    this.vEndCache = {};

    /**
    * @property {number} duration - The duration of the tween in ms.
    * @default
    */
    this.duration = 1000;

    /**
    * @property {number} percent - A value between 0 and 1 that represents how far through the duration this tween is.
    * @readonly
    */
    this.percent = 0;

    /**
    * @property {number} value - The current calculated value.
    * @readonly
    */
    this.value = 0;

    /**
    * @property {number} repeatCounter - If the Tween is set to repeat this contains the current repeat count.
    */
    this.repeatCounter = 0;

    /**
    * @property {number} repeatDelay - The amount of time in ms between repeats of this tween.
    */
    this.repeatDelay = 0;

    /**
    * @property {boolean} interpolate - True if the Tween will use interpolation (i.e. is an Array to Array tween)
    * @default
    */
    this.interpolate = false;

    /**
    * @property {boolean} yoyo - True if the Tween is set to yoyo, otherwise false.
    * @default
    */
    this.yoyo = false;

    /**
    * @property {number} yoyoDelay - The amount of time in ms between yoyos of this tween.
    */
    this.yoyoDelay = 0;

    /**
    * @property {boolean} inReverse - When a Tween is yoyoing this value holds if it's currently playing forwards (false) or in reverse (true).
    * @default
    */
    this.inReverse = false;

    /**
    * @property {number} delay - The amount to delay by until the Tween starts (in ms). Only applies to the start, use repeatDelay to handle repeats.
    * @default
    */
    this.delay = 0;

    /**
    * @property {number} dt - Current time value.
    */
    this.dt = 0;

    /**
    * @property {number} startTime - The time the Tween started or null if it hasn't yet started.
    */
    this.startTime = null;

    /**
    * @property {function} easingFunction - The easing function used for the Tween.
    * @default Phaser.Easing.Default
    */
    this.easingFunction = Phaser.Easing.Default;

    /**
    * @property {function} interpolationFunction - The interpolation function used for the Tween.
    * @default Phaser.Math.linearInterpolation
    */
    this.interpolationFunction = Phaser.Math.linearInterpolation;

    /**
    * @property {object} interpolationContext - The interpolation function context used for the Tween.
    * @default Phaser.Math
    */
    this.interpolationContext = Phaser.Math;

    /**
    * @property {boolean} isRunning - If the tween is running this is set to `true`. Unless Phaser.Tween a TweenData that is waiting for a delay to expire is *not* considered as running.
    * @default
    */
    this.isRunning = false;

    /**
    * @property {boolean} isFrom - Is this a from tween or a to tween?
    * @default
    */
    this.isFrom = false;

};

/**
* @constant
* @type {number}
*/
Phaser.TweenData.PENDING = 0;

/**
* @constant
* @type {number}
*/
Phaser.TweenData.RUNNING = 1;

/**
* @constant
* @type {number}
*/
Phaser.TweenData.LOOPED = 2;

/**
* @constant
* @type {number}
*/
Phaser.TweenData.COMPLETE = 3;

Phaser.TweenData.prototype = {

    /**
    * Sets this tween to be a `to` tween on the properties given. A `to` tween starts at the current value and tweens to the destination value given.
    * For example a Sprite with an `x` coordinate of 100 could be tweened to `x` 200 by giving a properties object of `{ x: 200 }`.
    *
    * @method Phaser.TweenData#to
    * @param {object} properties - The properties you want to tween, such as `Sprite.x` or `Sound.volume`. Given as a JavaScript object.
    * @param {number} [duration=1000] - Duration of this tween in ms.
    * @param {function} [ease=null] - Easing function. If not set it will default to Phaser.Easing.Default, which is Phaser.Easing.Linear.None by default but can be over-ridden at will.
    * @param {number} [delay=0] - Delay before this tween will start, defaults to 0 (no delay). Value given is in ms.
    * @param {number} [repeat=0] - Should the tween automatically restart once complete? If you want it to run forever set as -1. This ignores any chained tweens.
    * @param {boolean} [yoyo=false] - A tween that yoyos will reverse itself and play backwards automatically. A yoyo'd tween doesn't fire the Tween.onComplete event, so listen for Tween.onLoop instead.
    * @return {Phaser.TweenData} This Tween object.
    */
    to: function (properties, duration, ease, delay, repeat, yoyo) {

        this.vEnd = properties;
        this.duration = duration;
        this.easingFunction = ease;
        this.delay = delay;
        this.repeatCounter = repeat;
        this.yoyo = yoyo;

        this.isFrom = false;

        return this;

    },

    /**
    * Sets this tween to be a `from` tween on the properties given. A `from` tween sets the target to the destination value and tweens to its current value.
    * For example a Sprite with an `x` coordinate of 100 tweened from `x` 500 would be set to `x` 500 and then tweened to `x` 100 by giving a properties object of `{ x: 500 }`.
    *
    * @method Phaser.TweenData#from
    * @param {object} properties - The properties you want to tween, such as `Sprite.x` or `Sound.volume`. Given as a JavaScript object.
    * @param {number} [duration=1000] - Duration of this tween in ms.
    * @param {function} [ease=null] - Easing function. If not set it will default to Phaser.Easing.Default, which is Phaser.Easing.Linear.None by default but can be over-ridden at will.
    * @param {number} [delay=0] - Delay before this tween will start, defaults to 0 (no delay). Value given is in ms.
    * @param {number} [repeat=0] - Should the tween automatically restart once complete? If you want it to run forever set as -1. This ignores any chained tweens.
    * @param {boolean} [yoyo=false] - A tween that yoyos will reverse itself and play backwards automatically. A yoyo'd tween doesn't fire the Tween.onComplete event, so listen for Tween.onLoop instead.
    * @return {Phaser.TweenData} This Tween object.
    */
    from: function (properties, duration, ease, delay, repeat, yoyo) {

        this.vEnd = properties;
        this.duration = duration;
        this.easingFunction = ease;
        this.delay = delay;
        this.repeatCounter = repeat;
        this.yoyo = yoyo;

        this.isFrom = true;

        return this;

    },

    /**
    * Starts the Tween running.
    *
    * @method Phaser.TweenData#start
    * @return {Phaser.TweenData} This Tween object.
    */
    start: function () {

        this.startTime = this.game.time.time + this.delay;

        if (this.parent.reverse)
        {
            this.dt = this.duration;
        }
        else
        {
            this.dt = 0;
        }

        if (this.delay > 0)
        {
            this.isRunning = false;
        }
        else
        {
            this.isRunning = true;
        }

        if (this.isFrom)
        {
            //  Reverse them all and instant set them
            for (var property in this.vStartCache)
            {
                this.vStart[property] = this.vEndCache[property];
                this.vEnd[property] = this.vStartCache[property];
                this.parent.target[property] = this.vStart[property];
            }
        }

        this.value = 0;
        this.yoyoCounter = 0;

        return this;

    },

    /**
    * Loads the values from the target object into this Tween.
    *
    * @private
    * @method Phaser.TweenData#loadValues
    * @return {Phaser.TweenData} This Tween object.
    */
    loadValues: function () {

        for (var property in this.parent.properties)
        {
            //  Load the property from the parent object
            this.vStart[property] = this.parent.properties[property];

            //  Check if an Array was provided as property value
            if (Array.isArray(this.vEnd[property]))
            {
                if (this.vEnd[property].length === 0)
                {
                    continue;
                }

                if (this.percent === 0)
                {
                    //  Put the start value at the beginning of the array
                    //  but we only want to do this once, if the Tween hasn't run before
                    this.vEnd[property] = [this.vStart[property]].concat(this.vEnd[property]);
                }
            }

            if (typeof this.vEnd[property] !== 'undefined')
            {
                if (typeof this.vEnd[property] === 'string')
                {
                    //  Parses relative end values with start as base (e.g.: +10, -3)
                    this.vEnd[property] = this.vStart[property] + parseFloat(this.vEnd[property], 10);
                }

                this.parent.properties[property] = this.vEnd[property];
            }
            else
            {
                //  Null tween
                this.vEnd[property] = this.vStart[property];
            }

            this.vStartCache[property] = this.vStart[property];
            this.vEndCache[property] = this.vEnd[property];
        }

        return this;

    },

    /**
    * Updates this Tween. This is called automatically by Phaser.Tween.
    *
    * @protected
    * @method Phaser.TweenData#update
    * @param {number} time - A timestamp passed in by the Tween parent.
    * @return {number} The current status of this Tween. One of the Phaser.TweenData constants: PENDING, RUNNING, LOOPED or COMPLETE.
    */
    update: function (time) {

        if (!this.isRunning)
        {
            if (time >= this.startTime)
            {
                this.isRunning = true;
            }
            else
            {
                return Phaser.TweenData.PENDING;
            }
        }
        else
        {
            //  Is Running, but is waiting to repeat
            if (time < this.startTime)
            {
                return Phaser.TweenData.RUNNING;
            }
        }

        var ms = (this.parent.frameBased) ? this.game.time.physicsElapsedMS : this.game.time.elapsedMS;

        if (this.parent.reverse)
        {
            this.dt -= ms * this.parent.timeScale;
            this.dt = Math.max(this.dt, 0);
        }
        else
        {
            this.dt += ms * this.parent.timeScale;
            this.dt = Math.min(this.dt, this.duration);
        }

        this.percent = this.dt / this.duration;

        this.value = this.easingFunction(this.percent);

        for (var property in this.vEnd)
        {
            var start = this.vStart[property];
            var end = this.vEnd[property];

            if (Array.isArray(end))
            {
                this.parent.target[property] = this.interpolationFunction.call(this.interpolationContext, end, this.value);
            }
            else
            {
                this.parent.target[property] = start + ((end - start) * this.value);
            }
        }

        if ((!this.parent.reverse && this.percent === 1) || (this.parent.reverse && this.percent === 0))
        {
            return this.repeat();
        }
        
        return Phaser.TweenData.RUNNING;

    },

    /**
    * This will generate an array populated with the tweened object values from start to end.
    * It works by running the tween simulation at the given frame rate based on the values set-up in Tween.to and Tween.from.
    * Just one play through of the tween data is returned, including yoyo if set.
    *
    * @method Phaser.TweenData#generateData
    * @param {number} [frameRate=60] - The speed in frames per second that the data should be generated at. The higher the value, the larger the array it creates.
    * @return {array} An array of tweened values.
    */
    generateData: function (frameRate) {

        if (this.parent.reverse)
        {
            this.dt = this.duration;
        }
        else
        {
            this.dt = 0;
        }

        var data = [];
        var complete = false;
        var fps = (1 / frameRate) * 1000;

        do
        {
            if (this.parent.reverse)
            {
                this.dt -= fps;
                this.dt = Math.max(this.dt, 0);
            }
            else
            {
                this.dt += fps;
                this.dt = Math.min(this.dt, this.duration);
            }

            this.percent = this.dt / this.duration;

            this.value = this.easingFunction(this.percent);

            var blob = {};

            for (var property in this.vEnd)
            {
                var start = this.vStart[property];
                var end = this.vEnd[property];

                if (Array.isArray(end))
                {
                    blob[property] = this.interpolationFunction(end, this.value);
                }
                else
                {
                    blob[property] = start + ((end - start) * this.value);
                }
            }

            data.push(blob);

            if ((!this.parent.reverse && this.percent === 1) || (this.parent.reverse && this.percent === 0))
            {
                complete = true;
            }

        } while (!complete);

        if (this.yoyo)
        {
            var reversed = data.slice();
            reversed.reverse();
            data = data.concat(reversed);
        }

        return data;

    },

    /**
    * Checks if this Tween is meant to repeat or yoyo and handles doing so.
    *
    * @private
    * @method Phaser.TweenData#repeat
    * @return {number} Either Phaser.TweenData.LOOPED or Phaser.TweenData.COMPLETE.
    */
    repeat: function () {

        //  If not a yoyo and repeatCounter = 0 then we're done
        if (this.yoyo)
        {
            //  We're already in reverse mode, which means the yoyo has finished and there's no repeats, so end
            if (this.inReverse && this.repeatCounter === 0)
            {
                //  Restore the properties
                for (var property in this.vStartCache)
                {
                    this.vStart[property] = this.vStartCache[property];
                    this.vEnd[property] = this.vEndCache[property];
                }

                this.inReverse = false;

                return Phaser.TweenData.COMPLETE;
            }

            this.inReverse = !this.inReverse;
        }
        else
        {
            if (this.repeatCounter === 0)
            {
                return Phaser.TweenData.COMPLETE;
            }
        }

        if (this.inReverse)
        {
            //  If inReverse we're going from vEnd to vStartCache
            for (var property in this.vStartCache)
            {
                this.vStart[property] = this.vEndCache[property];
                this.vEnd[property] = this.vStartCache[property];
            }
        }
        else
        {
            //  If not inReverse we're just repopulating the cache again
            for (var property in this.vStartCache)
            {
                this.vStart[property] = this.vStartCache[property];
                this.vEnd[property] = this.vEndCache[property];
            }

            //  -1 means repeat forever, otherwise decrement the repeatCounter
            //  We only decrement this counter if the tween isn't doing a yoyo, as that doesn't count towards the repeat total
            if (this.repeatCounter > 0)
            {
                this.repeatCounter--;
            }
        }

        this.startTime = this.game.time.time;

        if (this.yoyo && this.inReverse)
        {
            this.startTime += this.yoyoDelay;
        }
        else if (!this.inReverse)
        {
            this.startTime += this.repeatDelay;
        }

        if (this.parent.reverse)
        {
            this.dt = this.duration;
        }
        else
        {
            this.dt = 0;
        }

        return Phaser.TweenData.LOOPED;

    }

};

Phaser.TweenData.prototype.constructor = Phaser.TweenData;
