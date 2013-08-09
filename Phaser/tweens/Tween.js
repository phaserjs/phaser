/// <reference path="../_definitions.ts" />
/**
* Phaser - Tween
*
* Based heavily on tween.js by sole (https://github.com/sole/tween.js) converted to TypeScript and integrated into Phaser
*/
var Phaser;
(function (Phaser) {
    var Tween = (function () {
        /**
        * Tween constructor
        * Create a new <code>Tween</code>.
        *
        * @param object {object} Target object will be affected by this tween.
        * @param game {Phaser.Game} Current game instance.
        */
        function Tween(object, game) {
            /**
            * Reference to the target object.
            * @type {object}
            */
            this._object = null;
            this._pausedTime = 0;
            /**
            * Start values container.
            * @type {object}
            */
            this._valuesStart = {};
            /**
            * End values container.
            * @type {object}
            */
            this._valuesEnd = {};
            /**
            * How long this tween will perform.
            * @type {number}
            */
            this._duration = 1000;
            this._delayTime = 0;
            this._startTime = null;
            /**
            * Will this tween automatically restart when it completes?
            * @type {boolean}
            */
            this._loop = false;
            /**
            * A yoyo tween is one that plays once fully, then reverses back to the original tween values before completing.
            * @type {boolean}
            */
            this._yoyo = false;
            this._yoyoCount = 0;
            /**
            * Contains chained tweens.
            * @type {Tweens[]}
            */
            this._chainedTweens = [];
            this.isRunning = false;
            this._object = object;

            this.game = game;
            this._manager = this.game.tweens;
            this._interpolationFunction = this.game.math.linearInterpolation;
            this._easingFunction = Phaser.Easing.Linear.None;

            this._chainedTweens = [];
            this.onStart = new Phaser.Signal();
            this.onUpdate = new Phaser.Signal();
            this.onComplete = new Phaser.Signal();
        }
        /**
        * Configure the Tween
        * @param properties {object} Propertis you want to tween.
        * @param [duration] {number} duration of this tween.
        * @param [ease] {any} Easing function.
        * @param [autoStart] {boolean} Whether this tween will start automatically or not.
        * @param [delay] {number} delay before this tween will start, defaults to 0 (no delay)
        * @param [loop] {boolean} Should the tween automatically restart once complete? (ignores any chained tweens)
        * @return {Tween} Itself.
        */
        Tween.prototype.to = function (properties, duration, ease, autoStart, delay, loop, yoyo) {
            if (typeof duration === "undefined") { duration = 1000; }
            if (typeof ease === "undefined") { ease = null; }
            if (typeof autoStart === "undefined") { autoStart = false; }
            if (typeof delay === "undefined") { delay = 0; }
            if (typeof loop === "undefined") { loop = false; }
            if (typeof yoyo === "undefined") { yoyo = false; }
            this._duration = duration;

            //  If properties isn't an object this will fail, sanity check it here somehow?
            this._valuesEnd = properties;

            if (ease !== null) {
                this._easingFunction = ease;
            }

            if (delay > 0) {
                this._delayTime = delay;
            }

            this._loop = loop;
            this._yoyo = yoyo;
            this._yoyoCount = 0;

            if (autoStart === true) {
                return this.start();
            } else {
                return this;
            }
        };

        Tween.prototype.loop = function (value) {
            this._loop = value;
            return this;
        };

        Tween.prototype.yoyo = function (value) {
            this._yoyo = value;
            this._yoyoCount = 0;
            return this;
        };

        /**
        * Start to tween.
        */
        Tween.prototype.start = function (looped) {
            if (typeof looped === "undefined") { looped = false; }
            if (this.game === null || this._object === null) {
                return;
            }

            if (looped == false) {
                this._manager.add(this);

                this.onStart.dispatch(this._object);
            }

            this._startTime = this.game.time.now + this._delayTime;
            this.isRunning = true;

            for (var property in this._valuesEnd) {
                if (this._object[property] === null || !(property in this._object)) {
                    throw Error('Phaser.Tween interpolation of null value of non-existing property');
                    continue;
                }

                if (this._valuesEnd[property] instanceof Array) {
                    if (this._valuesEnd[property].length === 0) {
                        continue;
                    }

                    // create a local copy of the Array with the start value at the front
                    this._valuesEnd[property] = [this._object[property]].concat(this._valuesEnd[property]);
                }

                if (looped == false) {
                    this._valuesStart[property] = this._object[property];
                }
            }

            return this;
        };

        Tween.prototype.reverse = function () {
            var tempObj = {};

            for (var property in this._valuesStart) {
                tempObj[property] = this._valuesStart[property];
                this._valuesStart[property] = this._valuesEnd[property];
                this._valuesEnd[property] = tempObj[property];
            }

            this._yoyoCount++;

            return this.start(true);
        };

        Tween.prototype.reset = function () {
            for (var property in this._valuesStart) {
                this._object[property] = this._valuesStart[property];
            }

            return this.start(true);
        };

        Tween.prototype.clear = function () {
            this._chainedTweens = [];

            this.onStart.removeAll();
            this.onUpdate.removeAll();
            this.onComplete.removeAll();

            return this;
        };

        /**
        * Stop tweening.
        */
        Tween.prototype.stop = function () {
            if (this._manager !== null) {
                this._manager.remove(this);
            }

            this.isRunning = false;

            this.onComplete.dispose();

            return this;
        };

        Object.defineProperty(Tween.prototype, "parent", {
            set: function (value) {
                this.game = value;
                this._manager = this.game.tweens;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Tween.prototype, "delay", {
            get: function () {
                return this._delayTime;
            },
            set: function (amount) {
                this._delayTime = amount;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Tween.prototype, "easing", {
            get: function () {
                return this._easingFunction;
            },
            set: function (easing) {
                this._easingFunction = easing;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Tween.prototype, "interpolation", {
            get: function () {
                return this._interpolationFunction;
            },
            set: function (interpolation) {
                this._interpolationFunction = interpolation;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Add another chained tween, which will start automatically when the one before it completes.
        * @param tween {Phaser.Tween} Tween object you want to chain with this.
        * @return {Phaser.Tween} Itselfe.
        */
        Tween.prototype.chain = function (tween) {
            this._chainedTweens.push(tween);

            return this;
        };

        Tween.prototype.pause = function () {
            this._paused = true;
        };

        Tween.prototype.resume = function () {
            this._paused = false;
            this._startTime += this.game.time.pauseDuration;
        };

        /**
        * Update tweening.
        * @param time {number} Current time from game clock.
        * @return {boolean} Return false if this completed and no need to update, otherwise return true.
        */
        Tween.prototype.update = function (time) {
            if (this._paused || time < this._startTime) {
                return true;
            }

            this._tempElapsed = (time - this._startTime) / this._duration;
            this._tempElapsed = this._tempElapsed > 1 ? 1 : this._tempElapsed;

            this._tempValue = this._easingFunction(this._tempElapsed);

            for (var property in this._valuesStart) {
                if (this._valuesEnd[property] instanceof Array) {
                    this._object[property] = this._interpolationFunction(this._valuesEnd[property], this._tempValue);
                } else {
                    this._object[property] = this._valuesStart[property] + (this._valuesEnd[property] - this._valuesStart[property]) * this._tempValue;
                }
            }

            this.onUpdate.dispatch(this._object, this._tempValue);

            if (this._tempElapsed == 1) {
                if (this._yoyo) {
                    if (this._yoyoCount == 0) {
                        //  Reverse the tween
                        this.reverse();
                        return true;
                    } else {
                        if (this._loop == false) {
                            this.onComplete.dispatch(this._object);

                            for (var i = 0; i < this._chainedTweens.length; i++) {
                                this._chainedTweens[i].start();
                            }

                            return false;
                        } else {
                            //  YoYo and Loop are both on
                            this._yoyoCount = 0;
                            this.reverse();
                            return true;
                        }
                    }
                }

                if (this._loop) {
                    this._yoyoCount = 0;
                    this.reset();
                    return true;
                } else {
                    this.onComplete.dispatch(this._object);

                    for (var i = 0; i < this._chainedTweens.length; i++) {
                        this._chainedTweens[i].start();
                    }

                    if (this._chainedTweens.length == 0) {
                        this.isRunning = false;
                    }

                    return false;
                }
            }

            return true;
        };
        return Tween;
    })();
    Phaser.Tween = Tween;
})(Phaser || (Phaser = {}));
