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

        constructor(object, game:Phaser.Game) {

            this._object = object;

            this._game = game;
            this._manager = this._game.tweens;
            this._interpolationFunction = this._game.math.linearInterpolation;
            this._easingFunction = Phaser.Easing.Linear.None;

            this.onStart = new Phaser.Signal();
            this.onUpdate = new Phaser.Signal();
            this.onComplete = new Phaser.Signal();

        }

        private _game: Phaser.Game;
        private _manager: Phaser.TweenManager;
	    private _object = null;
        private _pausedTime: number = 0;

	    private _valuesStart = {};
	    private _valuesEnd = {};
	    private _duration = 1000;
	    private _delayTime = 0;
	    private _startTime = null;
	    private _easingFunction;
	    private _interpolationFunction;
	    private _chainedTweens = [];

	    public onStart: Phaser.Signal;
	    public onUpdate: Phaser.Signal;
	    public onComplete: Phaser.Signal;

	    public to(properties, duration?: number = 1000, ease?: any = null, autoStart?: bool = false) {

	        this._duration = duration;

	        //  If properties isn't an object this will fail, sanity check it here somehow?
	        this._valuesEnd = properties;

	        if (ease !== null)
	        {
	            this._easingFunction = ease;
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

	    public stop() {

	        if (this._manager !== null)
	        {
	            this._manager.remove(this);
	        }

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

	    public chain(tween:Phaser.Tween) {

	        this._chainedTweens.push(tween);

	        return this;

	    }

	    public debugValue;

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
