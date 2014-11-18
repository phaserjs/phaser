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
    * @property {object} valuesStart - An object containing the values at the start of the tween.
    */
    this.valuesStart = {};

    /**
    * @property {object} valuesStartRepeat - Private value object.
    */
    this.valuesStartRepeat = {};

    /**
    * @property {object} valuesEnd - An object containing the values at the end of the tween.
    */
    this.valuesEnd = {};

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
Phaser.TweenData.RUNNING = 1;
Phaser.TweenData.LOOPED = 2;
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
    * @return {Phaser.Tween} This Tween object.
    */
    to: function (properties, duration, ease, autoStart, delay, repeat, yoyo) {

        this.valuesEnd = properties;
        this.duration = duration;
        this.easingFunction = ease;
        this.delay = delay;
        this.repeatCounter = repeat;
        this.yoyo = yoyo;

        this.started = false;
        this.value = 0;

        return this;

    },

    start: function () {

        this.startTime = this.game.time.time + this.delay;

        if (this.delay === 0)
        {
            this.loadStartValues();
        }

        return this;

    },

    loadStartValues: function () {

        this.started = true;
        this.time = 0;

        for (var property in this.valuesEnd)
        {
            //  Check if an Array was provided as property value
            if (Array.isArray(this.valuesEnd[property]))
            {
                if (this.valuesEnd[property].length === 0)
                {
                    continue;
                }

                //  Create a local copy of the Array with the start value at the front
                this.valuesEnd[property] = [this.parent.target[property]].concat(this.valuesEnd[property]);
            }

            this.valuesStart[property] = this.parent.target[property];

            if (!Array.isArray(this.valuesStart[property]))
            {
                this.valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
            }

            this.valuesStartRepeat[property] = this.valuesStart[property] || 0;
        }

        console.log('loadStartValues');

    },

    update: function (time) {

        if (!this.started)
        {
            if (this.game.time.time >= this.startTime)
            {
                this.loadStartValues();
            }
            else
            {
                return Phaser.TweenData.PENDING;
            }
        }

        this.percent = (time - this.startTime) / (this.duration * this.game.time.slowMotion);

        if (this.percent > 1)
        {
            this.percent = 1;
        }

        this.value = this.easingFunction(this.percent);

        for (var property in this.valuesEnd)
        {
            var start = this.valuesStart[property] || 0;
            var end = this.valuesEnd[property];

            if (end instanceof Array)
            {
                this.parent.target[property] = this.interpolationFunction(end, this.value);
            }
            else
            {
                //  Parses relative end values with start as base (e.g.: +10, -3)
                if (typeof(end) === 'string')
                {
                    end = start + parseFloat(end, 10);
                }

                // protect against non numeric properties.
                if (typeof(end) === 'number')
                {
                    this.parent.target[property] = start + ( end - start ) * this.value;
                }
            }
        }

        if (this.percent === 1)
        {
            if (this.repeatCounter > 0 || this.repeatCounter === -1)
            {
                return this.repeat(time);
            }
            else
            {
                return Phaser.TweenData.COMPLETE;
            }
        }
        else
        {
            return Phaser.TweenData.RUNNING;
        }

    },

    complete: function (time) {

        //  -1 means repeat forever, otherwise decrement the repeatCounter
        if (this.repeatCounter > -1)
        {
            this.repeatCounter--;
        }

        //  Reassign starting values, restart by making startTime = now
        for (var property in this.valuesStartRepeat)
        {
            if (typeof(this.valuesEnd[property]) === 'string')
            {
                this.valuesStartRepeat[property] = this.valuesStartRepeat[property] + parseFloat(this.valuesEnd[property], 10);
            }

            if (this.yoyo)
            {
                var tmp = this.valuesStartRepeat[property];
                this.valuesStartRepeat[property] = this.valuesEnd[property];
                this.valuesEnd[property] = tmp;
            }

            this._valuesStart[property] = this.valuesStartRepeat[property];
        }

        if (this.yoyo)
        {
            this.inReverse = !this.inReverse;
        }

        this.startTime = time + this._delay;

        return Phaser.TweenData.LOOPED;

    }

};

Phaser.TweenData.prototype.constructor = Phaser.TweenData;
