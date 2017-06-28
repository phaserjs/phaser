var GetValue = require('../utils/object/GetValue');

/**
* A TimerEvent is a single event that is processed by a Phaser.Clock
*
* It consists of a delay, which is a value in milliseconds after which the event will fire.
* When the event fires it calls a specific callback with the specified arguments.
* 
* TimerEvents are removed by their parent timer once finished firing or repeating.
* 
* Use {@link Phaser.Clock#add}, {@link Phaser.Clock#repeat}, or {@link Phaser.Clock#loop} methods to create a new event.
*
* @class Phaser.TimerEvent
* @constructor
* @param {number} delay - The delay in ms at which this TimerEvent fires.
* @param {number} tick - The tick is the next game clock time that this event will fire at.
* @param {number} repeatCount - If this TimerEvent repeats it will do so this many times.
* @param {boolean} loop - True if this TimerEvent loops, otherwise false.
* @param {function} callback - The callback that will be called when the TimerEvent occurs.
* @param {object} callbackContext - The context in which the callback will be called.
* @param {any[]} arguments - Additional arguments to be passed to the callback.
*/
var TimerEvent = function (config)
{
    /**
    * @property {number} delay - The delay in ms at which this TimerEvent fires.
    */
    this.delay = GetValue(config, 'delay', 0);

    /**
    * @property {number} repeatCount - If this TimerEvent repeats it will do so this many times.
    */
    this.repeatCount = GetValue(config, 'repeat', 0);

    /**
    * @property {boolean} loop - True if this TimerEvent loops, otherwise false.
    */
    this.loop = GetValue(config, 'loop', false);

    /**
    * @property {function} callback - The callback that will be called when the TimerEvent occurs.
    */
    this.callback = GetValue(config, 'callback', null);

    /**
    * @property {object} callbackContext - The context in which the callback will be called.
    */
    this.callbackScope = GetValue(config, 'callbackScope', null);

    /**
    * @property {any[]} arguments - Additional arguments to be passed to the callback.
    */
    this.args = GetValue(config, 'args', []);

    this.due = 0;
    this.elapsed = 0;
};

TimerEvent.prototype = {

    getProgress: function ()
    {
        return (this.elapsed / this.delay);
    }

};

TimerEvent.prototype.constructor = TimerEvent;

module.exports = TimerEvent;
