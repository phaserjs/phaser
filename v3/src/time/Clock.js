var TimerEvent = require('./TimerEvent');

//  There is only ever one instance of a MasterClock per game, and it belongs to the Game.

var Clock = function (state, masterclock)
{
    this.state = state;

    /**
    * The `performance.now()` value when the time was last updated.
    * @property {float} time
    * @protected
    */
    this.time = 0;

    /**
    * The `now` when the previous update occurred.
    * @property {float} prevTime
    * @protected
    */
    this.prevTime = 0;

    /**
    * Elapsed time since the last time update, in milliseconds, based on `now`.
    *
    * This value _may_ include time that the game is paused/inactive.
    *
    * @property {number} elapsed
    * @see Lazer.Time.time
    * @protected
    */
    this.elapsed = 0;

    this._pendingInsertion = [];
    this._active = [];
    this._pendingRemoval = [];
};

Clock.prototype = {

    addEvent: function (config)
    {
        var event = new TimerEvent(config);

        this._pendingInsertion.push(event);

        return event;
    },

    delayedCall: function (delay, callback, args, callbackScope)
    {
        return this.addEvent({ delay: delay, callback: callback, args: args, callbackScope: callbackScope });
    },

    begin: function (time)
    {
        //  Delete old events
        for (var i = 0; i < this._pendingRemoval.length; i++)
        {
            var index = this._active.indexOf(this._pendingRemoval[i]);

            if (index > -1)
            {
                this._active.splice(index, 1);
            }
        }

        //  Move pending events to the active list
        this._active = this._active.concat(this._pendingInsertion.splice(0));

        //  Clear the lists
        this._pendingRemoval.length = 0;
        this._pendingInsertion.length = 0;
    },

    update: function (time, delta)
    {
        this.prevTime = this.time;

        this.time = time;

        this.elapsed = time - this.prevTime;

        if (this._active.length)
        {
            this.processEvents(time, this.elapsed);
        }
    },

    processEvents: function (time, elapsed)
    {
        for (var i = 0; i < this._active.length; i++)
        {
            var event = this._active[i];

            event.elapsed += elapsed;

            // console.log(event.elapsed);

            if (event.elapsed >= event.delay)
            {
                var remainder = event.elapsed - event.delay;

                //  Limit it, in case it's checked in the callback
                event.elapsed = event.delay;

                //  Process the event
                event.callback.apply(event.callbackScope, event.args);

                if (event.loop || event.repeatCount > 0)
                {
                    event.repeatCount--;

                    event.elapsed = remainder;
                }
                else
                {
                    this._pendingRemoval.push(event);
                }
            }
        }
    }

};

Clock.prototype.constructor = Clock;

module.exports = Clock;
