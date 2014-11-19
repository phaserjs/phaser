/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A bundle of tween values as used by Phaser.Tween.
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
    * @property {object} vEnd - Cached ending values.
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
    * @readOnly
    */
    this.percent = 0;

    /**
    * @property {number} value - The current calculated value.
    * @readOnly
    */
    this.value = 0;

    /**
    * @property {number} repeatCounter - If the Tween is set to repeat this contains the current repeat count.
    */
    this.repeatCounter = 0;

    /**
    * @property {boolean} yoyo - True if the Tween is set to yoyo, otherwise false.
    * @default
    */
    this.yoyo = false;

    /**
    * @property {boolean} inReverse - When a Tween is yoyoing this value holds if it's currently playing forwards (false) or in reverse (true).
    * @default
    */
    this.inReverse = false;

    /**
    * @property {number} delay - The amount to delay by until the Tween starts (in ms).
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
    * @method Phaser.Tween#to
    * @param {object} properties - The properties you want to tween, such as `Sprite.x` or `Sound.volume`. Given as a JavaScript object.
    * @param {number} [duration=1000] - Duration of this tween in ms.
    * @param {function} [ease=null] - Easing function. If not set it will default to Phaser.Easing.Default, which is Phaser.Easing.Linear.None by default but can be over-ridden at will.
    * @param {boolean} [autoStart=false] - Whether this tween will start automatically or not.
    * @param {number} [delay=0] - Delay before this tween will start, defaults to 0 (no delay). Value given is in ms.
    * @param {number} [repeat=0] - Should the tween automatically restart once complete? If you want it to run forever set as -1. This ignores any chained tweens.
    * @param {boolean} [yoyo=false] - A tween that yoyos will reverse itself and play backwards automatically. A yoyo'd tween doesn't fire the Tween.onComplete event, so listen for Tween.onLoop instead.
    * @return {Phaser.TweenData} This Tween object.
    */
    to: function (properties, duration, ease, autoStart, delay, repeat, yoyo) {

        console.log('TweenData to', arguments);

        this.vEnd = properties;
        this.duration = duration;
        this.easingFunction = ease;
        this.delay = delay;
        this.repeatCounter = repeat;
        this.yoyo = yoyo;

        this.started = false;
        this.value = 0;

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

        if (this.delay === 0)
        {
            this.loadValues();
        }

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

        this.started = true;
        this.dt = 0;
        this.yoyoCounter = 0;

        for (var property in this.vEnd)
        {
            //  Check if an Array was provided as property value
            if (Array.isArray(this.vEnd[property]))
            {
                if (this.vEnd[property].length === 0)
                {
                    continue;
                }

                //  Create a local copy of the Array with the start value at the front
                this.vEnd[property] = [this.parent.target[property]].concat(this.vEnd[property]);
            }

            this.vStart[property] = this.parent.target[property] || 0;

            if (!Array.isArray(this.vStart[property]))
            {
                this.vStart[property] *= 1.0; // Ensures we're using numbers, not strings
            }

            if (typeof this.vEnd[property] === 'string')
            {
                //  Parses relative end values with start as base (e.g.: +10, -3)
                this.vEnd[property] = this.vStart[property] + parseFloat(this.vEnd[property], 10);
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
    * @return {number} The current status of this Tween. One of the Phaser.TweenData constants: PENDING, RUNNING, LOOPED or COMPLETE.
    */
    update: function () {

        if (!this.started)
        {
            if (this.game.time.time >= this.startTime)
            {
                this.loadValues();
            }
            else
            {
                return Phaser.TweenData.PENDING;
            }
        }

        if (this.parent.reverse)
        {
            this.dt -= (this.game.time.physicsElapsed * 1000) * this.parent.speed;
            this.dt = Math.max(this.dt, 0);
        }
        else
        {
            this.dt += (this.game.time.physicsElapsed * 1000) * this.parent.speed;
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
                this.parent.target[property] = this.interpolationFunction(end, this.value);
            }
            else
            {
                this.parent.target[property] = start + (end - start) * this.value;
            }
        }

        if ((!this.parent.reverse && this.percent === 1) || (this.parent.reverse && this.percent === 0))
        {
            return this.repeat();
        }
        
        return Phaser.TweenData.RUNNING;

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

        this.startTime = this.game.time.time + this.delay;

        this.dt = 0;

        return Phaser.TweenData.LOOPED;

    }

};

Phaser.TweenData.prototype.constructor = Phaser.TweenData;
