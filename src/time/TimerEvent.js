/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A TimerEvent is a single event that is processed by a Phaser.Timer.
* It consists of a delay, which is a value in milliseconds after which the event will fire.
* It can call a specific callback, passing in optional parameters.
*
* @class Phaser.TimerEvent
* @constructor
* @param {Phaser.Timer} timer - The Timer object that this TimerEvent belongs to.
* @param {number} delay - The delay in ms at which this TimerEvent fires.
* @param {number} tick - The tick is the next game clock time that this event will fire at.
* @param {number} repeatCount - If this TimerEvent repeats it will do so this many times.
* @param {boolean} loop - True if this TimerEvent loops, otherwise false.
* @param {function} callback - The callback that will be called when the TimerEvent occurs.
* @param {object} callbackContext - The context in which the callback will be called.
* @param {array} arguments - The values to be passed to the callback.
*/
Phaser.TimerEvent = function (timer, delay, tick, repeatCount, loop, callback, callbackContext, args) {

    /**
    * @property {Phaser.Timer} timer - The Timer object that this TimerEvent belongs to.
    */
	this.timer = timer;

    /**
    * @property {number} delay - The delay in ms at which this TimerEvent fires.
    */
	this.delay = delay;

    /**
    * @property {number} tick - The tick is the next game clock time that this event will fire at.
    */
	this.tick = tick;

    /**
    * @property {number} repeatCount - If this TimerEvent repeats it will do so this many times.
    */
	this.repeatCount = repeatCount - 1;

    /**
    * @property {boolean} loop - True if this TimerEvent loops, otherwise false.
    */
	this.loop = loop;

    /**
    * @property {function} callback - The callback that will be called when the TimerEvent occurs.
    */
	this.callback = callback;

    /**
    * @property {object} callbackContext - The context in which the callback will be called.
    */
	this.callbackContext = callbackContext;

    /**
    * @property {array} arguments - The values to be passed to the callback.
    */
	this.args = args;

    /**
    * @property {boolean} pendingDelete - A flag that controls if the TimerEvent is pending deletion.
    * @protected
    */
    this.pendingDelete = false;

};

Phaser.TimerEvent.prototype.constructor = Phaser.TimerEvent;
