/// <reference path="../Game.ts" />
/// <reference path="easing/Back.ts" />
/// <reference path="easing/Bounce.ts" />
/// <reference path="easing/Circular.ts" />
/// <reference path="easing/Cubic.ts" />
/// <reference path="easing/Elastic.ts" />
/// <reference path="easing/Exponential.ts" />
/// <reference path="easing/Linear.ts" />
/// <reference path="easing/Quadratic.ts" />
/// <reference path="easing/Quartic.ts" />
/// <reference path="easing/Quintic.ts" />
/// <reference path="easing/Sinusoidal.ts" />

/**
* Phaser - Tween
*
* Based heavily on tween.js by sole (https://github.com/sole/tween.js) converted to TypeScript and integrated into Phaser
*/

module Phaser {

    export class Tween {

        /**
         * Tween constructor
         * Create a new <code>Tween</code>.
         *
         * @param object {object} Target object will be affected by this tween.
         * @param game {Phaser.Game} Current game instance.
         */
        constructor(object, game:Phaser.Game) {

            this._object = object;

            this._game = game;
            this._manager = this._game.tweens;
            this._interpolationFunction = this._game.math.linearInterpolation;
            this._easingFunction = Phaser.Easing.Linear.None;

            this._chainedTweens = [];
            this.onStart = new Phaser.Signal();
            this.onUpdate = new Phaser.Signal();
            this.onComplete = new Phaser.Signal();

        }

        /**
         * Local private reference to game.
         */
        private _game: Phaser.Game;

        /**
         * Manager of this tween.
         * @type {Phaser.TweenManager}
         */
        private _manager: Phaser.TweenManager;

        /**
         * Reference to the target object.
         * @type {object}
         */
	    private _object = null;
        private _pausedTime: number = 0;

        /**
         * Start values container.
         * @type {object}
         */
	    private _valuesStart = {};

        /**
         * End values container.
         * @type {object}
         */
	    private _valuesEnd = {};

	    /**
	     * How long this tween will perform.
	     * @type {number}
	     */
	    private _duration = 1000;
	    private _delayTime = 0;
	    private _startTime = null;

	    /**
	     * Easing function which actually updating this tween.
	     * @type {function}
	     */
	    private _easingFunction;
	    private _interpolationFunction;

	    /**
	     * Contains chained tweens.
	     * @type {Tweens[]}
	     */
	    private _chainedTweens = [];

	    /**
	     * Signal to be dispatched when this tween start.
	     * @type {Phaser.Signal}
	     */
	    public onStart: Phaser.Signal;

	    /**
	     * Signal to be dispatched when this tween updating.
	     * @type {Phaser.Signal}
	     */
	    public onUpdate: Phaser.Signal;

	    /**
	     * Signal to be dispatched when this tween completed.
	     * @type {Phaser.Signal}
	     */
	    public onComplete: Phaser.Signal;

	    /**
	     * Configure the Tween
	     * @param properties {object} Propertis you want to tween.
	     * @param [duration] {number} duration of this tween.
	     * @param [ease] {any} Easing function.
	     * @param [autoStart] {boolean} Whether this tween will start automatically or not.
	     * @param [delay] {number} delay before this tween will start, defaults to 0 (no delay)
	     * @return {Tween} Itself.
	     */
	    public to(properties, duration?: number = 1000, ease?: any = null, autoStart?: bool = false, delay?:number = 0) {

	        this._duration = duration;

	        //  If properties isn't an object this will fail, sanity check it here somehow?
	        this._valuesEnd = properties;

	        if (ease !== null)
	        {
	            this._easingFunction = ease;
	        }

	        if (delay > 0)
	        {
	            this._delayTime = delay;
	        }

	        if (autoStart === true)
	        {
	            return this.start();
	        }
	        else
	        {
	            return this;
	        }

	    }

	    /**
	     * Start to tween.
	     */
	    public start() {

	        if (this._game === null || this._object === null)
	        {
	            return;
	        }

	        this._manager.add(this);

	        this.onStart.dispatch(this._object);

	        this._startTime = this._game.time.now + this._delayTime;

	        for (var property in this._valuesEnd)
	        {
	            // This prevents the interpolation of null values or of non-existing properties
	            if (this._object[property] === null || !(property in this._object))
	            {
        	        throw Error('Phaser.Tween interpolation of null value of non-existing property');
	                continue;
	            }

	            // check if an Array was provided as property value
	            if (this._valuesEnd[property] instanceof Array)
	            {
	                if (this._valuesEnd[property].length === 0)
	                {
	                    continue;
	                }

	                // create a local copy of the Array with the start value at the front
	                this._valuesEnd[property] = [this._object[property]].concat(this._valuesEnd[property]);
	            }

	            this._valuesStart[property] = this._object[property];

	        }

	        return this;

	    }

	    /**
	     * Stop tweening.
	     */
	    public stop() {

	        if (this._manager !== null)
	        {
	            this._manager.remove(this);
	        }

	        this.onComplete.dispose();

	        return this;

	    }

	    public set parent(value:Phaser.Game) {

	        this._game = value;
            this._manager = this._game.tweens;

	    }

	    public set delay(amount:number) {
	        this._delayTime = amount;
	    }

	    public get delay(): number {
	        return this._delayTime;
	    }

	    public set easing(easing) {
	        this._easingFunction = easing;
	    }

	    public get easing():any {
	        return this._easingFunction;
	    }

	    public set interpolation(interpolation) {
	        this._interpolationFunction = interpolation;
	    }

	    public get interpolation():any {
	        return this._interpolationFunction;
	    }

	    /**
	     * Add another chained tween, which will start automatically when the one before it completes.
	     * @param tween {Phaser.Tween} Tween object you want to chain with this.
	     * @return {Phaser.Tween} Itselfe.
	     */
	    public chain(tween:Phaser.Tween) {

	        this._chainedTweens.push(tween);

	        return this;

	    }

	    /**
	     * Debug value?
	     */
	    public debugValue;

	    /**
	     * Update tweening.
	     * @param time {number} Current time from game clock.
	     * @return {boolean} Return false if this completed and no need to update, otherwise return true.
	     */
	    public update(time) {

	        if (this._game.paused == true)
	        {
	            if (this._pausedTime == 0)
	            {
	                this._pausedTime = time;
	            }
	        }
	        else
	        {
                //  Ok we aren't paused, but was there some time gained?
	            if (this._pausedTime > 0)
	            {
	                this._startTime += (time - this._pausedTime);
	                this._pausedTime = 0;
	            }
	        }

	        if (time < this._startTime)
	        {
	            return true;
	        }

	        var elapsed = (time - this._startTime) / this._duration;
	        elapsed = elapsed > 1 ? 1 : elapsed;

	        var value = this._easingFunction(elapsed);

	        for (var property in this._valuesStart)
	        {
                //  Add checks for object, array, numeric up front
	            if (this._valuesEnd[property] instanceof Array)
	            {
	                this._object[property] = this._interpolationFunction(this._valuesEnd[property], value);
	            }
                else
	            {
	                this._object[property] = this._valuesStart[property] + (this._valuesEnd[property] - this._valuesStart[property]) * value;
	            }
	        }

	        this.onUpdate.dispatch(this._object, value);

	        if (elapsed == 1)
	        {
    	        this.onComplete.dispatch(this._object);

	            for (var i = 0; i < this._chainedTweens.length; i++)
	            {
	                this._chainedTweens[i].start();
	            }

	            return false;

	        }

	        return true;

	    }

    }
}
