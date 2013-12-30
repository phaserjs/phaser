/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Timer constructor.
*
* @class Phaser.Timer
* @classdesc A Timer
* @constructor
* @param {Phaser.Game} game A reference to the currently running game.
*/
Phaser.Timer = function (game) {

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = game;

    /**
    * The time at which this Timer instance started.
    * @property {number} _started
    * @private
    * @default
    */
    this._started = 0;

    /**
    * The time (in ms) that the last second counter ticked over.
    * @property {number} _timeLastSecond
    * @private
    * @default
    */
    this._timeLastSecond = 0;

    this.running = false;

    this.events = [];

    this.onEvent = new Phaser.Signal();

    //  Need to add custom FPS rate, for now we'll just use seconds

};

Phaser.Timer.prototype = {

    //  delay could be from now, when the timer is created, or relative to an already running timer

    // add: function (delay, callback, callbackContext) {
    add: function (delay) {

        this.events.push({
            delay: delay,
            dispatched: false,
            args: Array.prototype.splice.call(arguments, 1)
        });

        // this.events.push({
        //  delay: delay,
        //  dispatched: false,
        //  callback: callback,
        //  callbackContext: callbackContext,
        //  args: Array.prototype.splice.call(arguments, 3)
        // });

    },

    start: function() {

        this._started = this.game.time.now;
        this.running = true;

        //  sort the events based on delay here, also don't run unless events is populated
        //  add ability to auto-stop once all events are done
        //  add support for maximum duration
        //  add support for delay before starting
        //  add signals?

    },

    stop: function() {

        this.running = false;
        this.events.length = 0;

    },

    update: function() {

        //  TODO: Game Paused support

        if (this.running)
        {
            var seconds = this.seconds();

            for (var i = 0, len = this.events.length; i < len; i++)
            {
                if (this.events[i].dispatched === false && seconds >= this.events[i].delay)
                {
                    this.events[i].dispatched = true;
                    // this.events[i].callback.apply(this.events[i].callbackContext, this.events[i].args);
                    this.onEvent.dispatch.apply(this, this.events[i].args);
                    //  ought to slice it now
                }
            }
        }

    },

    seconds: function() {
        return (this.game.time.now - this._started) * 0.001;
    }

};

Phaser.Timer.prototype.constructor = Phaser.Timer;
