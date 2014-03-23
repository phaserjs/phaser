/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Timer is a way to create small re-usable or disposable objects that do nothing but wait for a specific moment in time, and then dispatch an event.
* You can add as many events to a Timer as you like, each with their own delays. A Timer uses milliseconds as its unit of time. There are 1000 ms in 1 second.
* So if you want to fire an event every quarter of a second you'd need to set the delay to 250.
*
* @class Phaser.Timer
* @classdesc A Timer is a way to create small re-usable or disposable objects that do nothing but wait for a specific moment in time, and then dispatch an event.
* @constructor
* @param {Phaser.Game} game A reference to the currently running game.
* @param {boolean} [autoDestroy=true] - A Timer that is set to automatically destroy itself will do so after all of its events have been dispatched (assuming no looping events).
*/
Phaser.Timer = function (game, autoDestroy) {

    if (typeof autoDestroy === 'undefined') { autoDestroy = true; }

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = game;

    /**
    * @property {boolean} running - True if the Timer is actively running. Do not switch this boolean, if you wish to pause the timer then use Timer.pause() instead.
    * @default
    */
    this.running = false;

    /**
    * @property {boolean} autoDestroy - A Timer that is set to automatically destroy itself will do so after all of its events have been dispatched (assuming no looping events).
    */
    this.autoDestroy = autoDestroy;

    /**
    * @property {boolean} expired - An expired Timer is one in which all of its events have been dispatched and none are pending.
    * @readonly
    * @default
    */
    this.expired = false;

    /**
    * @property {array<Phaser.TimerEvent>} events - An array holding all of this timers Phaser.TimerEvent objects. Use the methods add, repeat and loop to populate it.
    */
    this.events = [];

    /**
    * @property {Phaser.Signal} onComplete - This signal will be dispatched when this Timer has completed, meaning there are no more events in the queue.
    */
    this.onComplete = new Phaser.Signal();

    /**
    * @property {number} nextTick - The time the next tick will occur.
    * @readonly
    * @protected
    */
    this.nextTick = 0;

    /**
    * @property {boolean} paused - The paused state of the Timer. You can pause the timer by calling Timer.pause() and Timer.resume() or by the game pausing.
    * @readonly
    * @default
    */
    this.paused = false;

    /**
    * @property {boolean} _codePaused - Was the Timer paused by code or by Game focus loss?
    * @private
    */
    this._codePaused = false;

    /**
    * @property {number} _started - The time at which this Timer instance started running.
    * @private
    * @default
    */
    this._started = 0;

    /**
    * @property {number} _pauseStarted - The time the game started being paused.
    * @private
    */
    this._pauseStarted = 0;

    /**
    * @property {number} _pauseTotal - Total paused time.
    * @private
    */
    this._pauseTotal = 0;

    /**
    * @property {number} _now - The current start-time adjusted time.
    * @private
    */
    this._now = 0;

    /**
    * @property {number} _len - Temp. array length variable.
    * @private
    */
    this._len = 0;

    /**
    * @property {number} _i - Temp. array counter variable.
    * @private
    */
    this._i = 0;

};

/**
* @constant
* @type {number}
*/
Phaser.Timer.MINUTE = 60000;

/**
* @constant
* @type {number}
*/
Phaser.Timer.SECOND = 1000;

/**
* @constant
* @type {number}
*/
Phaser.Timer.HALF = 500;

/**
* @constant
* @type {number}
*/
Phaser.Timer.QUARTER = 250;

Phaser.Timer.prototype = {

    /**
    * Creates a new TimerEvent on this Timer. Use the methods add, repeat or loop instead of this.
    * @method Phaser.Timer#create
    * @private
    * @param {number} delay - The number of milliseconds that should elapse before the Timer will call the given callback.
    * @param {boolean} loop - Should the event loop or not?
    * @param {number} repeatCount - The number of times the event will repeat.
    * @param {function} callback - The callback that will be called when the Timer event occurs.
    * @param {object} callbackContext - The context in which the callback will be called.
    * @param {array} arguments - The values to be sent to your callback function when it is called.
    * @return {Phaser.TimerEvent} The Phaser.TimerEvent object that was created.
    */
    create: function (delay, loop, repeatCount, callback, callbackContext, args) {

        var tick = delay;

        if (this._now === 0)
        {
            tick += this.game.time.now;
        }
        else
        {
            tick += this._now;
        }

        var event = new Phaser.TimerEvent(this, delay, tick, repeatCount, loop, callback, callbackContext, args);

        this.events.push(event);

        this.order();

        this.expired = false;

        return event;

    },

    /**
    * Adds a new Event to this Timer. The event will fire after the given amount of 'delay' in milliseconds has passed, once the Timer has started running.
    * Call Timer.start() once you have added all of the Events you require for this Timer. The delay is in relation to when the Timer starts, not the time it was added.
    * If the Timer is already running the delay will be calculated based on the timers current time.
    * @method Phaser.Timer#add
    * @param {number} delay - The number of milliseconds that should elapse before the Timer will call the given callback.
    * @param {function} callback - The callback that will be called when the Timer event occurs.
    * @param {object} callbackContext - The context in which the callback will be called.
    * @param {...*} arguments - The values to be sent to your callback function when it is called.
    * @return {Phaser.TimerEvent} The Phaser.TimerEvent object that was created.
    */
    add: function (delay, callback, callbackContext) {

        return this.create(delay, false, 0, callback, callbackContext, Array.prototype.splice.call(arguments, 3));

    },

    /**
    * Adds a new Event to this Timer that will repeat for the given number of iterations.
    * The event will fire after the given amount of 'delay' milliseconds has passed once the Timer has started running.
    * Call Timer.start() once you have added all of the Events you require for this Timer. The delay is in relation to when the Timer starts, not the time it was added.
    * If the Timer is already running the delay will be calculated based on the timers current time.
    * @method Phaser.Timer#repeat
    * @param {number} delay - The number of milliseconds that should elapse before the Timer will call the given callback.
    * @param {number} repeatCount - The number of times the event will repeat.
    * @param {function} callback - The callback that will be called when the Timer event occurs.
    * @param {object} callbackContext - The context in which the callback will be called.
    * @param {...*} arguments - The values to be sent to your callback function when it is called.
    * @return {Phaser.TimerEvent} The Phaser.TimerEvent object that was created.
    */
    repeat: function (delay, repeatCount, callback, callbackContext) {

        return this.create(delay, false, repeatCount, callback, callbackContext, Array.prototype.splice.call(arguments, 4));

    },

    /**
    * Adds a new looped Event to this Timer that will repeat forever or until the Timer is stopped.
    * The event will fire after the given amount of 'delay' milliseconds has passed once the Timer has started running.
    * Call Timer.start() once you have added all of the Events you require for this Timer. The delay is in relation to when the Timer starts, not the time it was added.
    * If the Timer is already running the delay will be calculated based on the timers current time.
    * @method Phaser.Timer#loop
    * @param {number} delay - The number of milliseconds that should elapse before the Timer will call the given callback.
    * @param {function} callback - The callback that will be called when the Timer event occurs.
    * @param {object} callbackContext - The context in which the callback will be called.
    * @param {...*} arguments - The values to be sent to your callback function when it is called.
    * @return {Phaser.TimerEvent} The Phaser.TimerEvent object that was created.
    */
    loop: function (delay, callback, callbackContext) {

        return this.create(delay, true, 0, callback, callbackContext, Array.prototype.splice.call(arguments, 3));

    },

    /**
    * Starts this Timer running.
    * @method Phaser.Timer#start
    */
    start: function () {

        if (this.running)
        {
            return;
        }

        this._started = this.game.time.now;

        this.running = true;

        for (var i = 0; i < this.events.length; i++)
        {
            this.events[i].tick = this.events[i].delay + this._started;
        }

    },

    /**
    * Stops this Timer from running. Does not cause it to be destroyed if autoDestroy is set to true.
    * @method Phaser.Timer#stop
    * @param {boolean} [clearEvents=true] - If true all the events in Timer will be cleared, otherwise they will remain.
    */
    stop: function (clearEvents) {

        this.running = false;

        if (typeof clearEvents === 'undefined') { clearEvents = true; }

        if (clearEvents)
        {
            this.events.length = 0;
        }

    },

    /**
    * Removes a pending TimerEvent from the queue.
    * @param {Phaser.TimerEvent} event - The event to remove from the queue.
    * @method Phaser.Timer#remove
    */
    remove: function (event) {

        for (var i = 0; i < this.events.length; i++)
        {
            if (this.events[i] === event)
            {
                this.events[i].pendingDelete = true;
                return true;
            }
        }

        return false;

    },

    /**
    * Orders the events on this Timer so they are in tick order. This is called automatically when new events are created.
    * @method Phaser.Timer#order
    */
    order: function () {

        if (this.events.length > 0)
        {
            //  Sort the events so the one with the lowest tick is first
            this.events.sort(this.sortHandler);

            this.nextTick = this.events[0].tick;
        }

    },

    /**
    * Sort handler used by Phaser.Timer.order.
    * @method Phaser.Timer#sortHandler
    * @protected
    */
    sortHandler: function (a, b) {

        if (a.tick < b.tick)
        {
            return -1;
        }
        else if (a.tick > b.tick)
        {
            return 1;
        }

        return 0;

    },

    /**
    * The main Timer update event, called automatically by the Game clock.
    * @method Phaser.Timer#update
    * @protected
    * @param {number} time - The time from the core game clock.
    * @return {boolean} True if there are still events waiting to be dispatched, otherwise false if this Timer can be destroyed.
    */
    update: function (time) {

        if (this.paused)
        {
            return true;
        }

        this._now = time;

        this._len = this.events.length;

        this._i = 0;

        while (this._i < this._len)
        {
            if (this.events[this._i].pendingDelete)
            {
                this.events.splice(this._i, 1);
                this._len--;
            }

            this._i++;
        }

        this._len = this.events.length;

        if (this.running && this._now >= this.nextTick && this._len > 0)
        {
            this._i = 0;

            while (this._i < this._len && this.running)
            {
                if (this._now >= this.events[this._i].tick)
                {
                    var diff = this._now - this.events[this._i].tick;
                    var newTick = (this._now + this.events[this._i].delay) - diff;

                    if (newTick < 0)
                    {
                        newTick = this._now + this.events[this._i].delay;
                    }

                    if (this.events[this._i].loop === true)
                    {
                        this.events[this._i].tick = newTick;
                        this.events[this._i].callback.apply(this.events[this._i].callbackContext, this.events[this._i].args);
                    }
                    else if (this.events[this._i].repeatCount > 0)
                    {
                        this.events[this._i].repeatCount--;
                        this.events[this._i].tick = newTick;
                        this.events[this._i].callback.apply(this.events[this._i].callbackContext, this.events[this._i].args);
                    }
                    else
                    {
                        this.events[this._i].callback.apply(this.events[this._i].callbackContext, this.events[this._i].args);
                        this.events.splice(this._i, 1);
                        this._len--;
                    }

                    this._i++;
                }
                else
                {
                    break;
                }
            }

            //  Are there any events left?
            if (this.events.length > 0)
            {
                this.order();
            }
            else
            {
                this.expired = true;
                this.onComplete.dispatch(this);
            }
        }

        if (this.expired && this.autoDestroy)
        {
            return false;
        }
        else
        {
            return true;
        }

    },

    /**
    * Pauses the Timer and all events in the queue.
    * @method Phaser.Timer#pause
    */
    pause: function () {

        if (this.running && !this.expired)
        {
            this._pauseStarted = this.game.time.now;

            this.paused = true;
            this._codePaused = true;
        }

    },

    /**
    * This is called by the core Game loop. Do not call it directly, instead use Timer.pause.
    * @method Phaser.Timer#_pause
    * @private
    */
    _pause: function () {

        if (this.running && !this.expired)
        {
            this._pauseStarted = this.game.time.now;

            this.paused = true;
        }

    },

    /**
    * Resumes the Timer and updates all pending events.
    * @method Phaser.Timer#resume
    */
    resume: function () {

        if (this.running && !this.expired)
        {
            var pauseDuration = this.game.time.now - this._pauseStarted;

            this._pauseTotal += pauseDuration;

            for (var i = 0; i < this.events.length; i++)
            {
                this.events[i].tick += pauseDuration;
            }

            this.nextTick += pauseDuration;

            this.paused = false;
            this._codePaused = false;
        }

    },

    /**
    * This is called by the core Game loop. Do not call it directly, instead use Timer.pause.
    * @method Phaser.Timer#_resume
    * @private
    */
    _resume: function () {

        if (this._codePaused)
        {
            return;
        }
        else
        {
            this.resume();
        }

    },

    /**
    * Removes all Events from this Timer and all callbacks linked to onComplete, but leaves the Timer running.
    * The onComplete callbacks won't be called.
    *
    * @method Phaser.Timer#removeAll
    */
    removeAll: function () {

        this.onComplete.removeAll();
        this.events.length = 0;
        this._len = 0;
        this._i = 0;

    },

    /**
    * Destroys this Timer. Any pending Events are not dispatched.
    * The onComplete callbacks won't be called.
    *
    * @method Phaser.Timer#destroy
    */
    destroy: function () {

        this.onComplete.removeAll();
        this.running = false;
        this.events = [];
        this._len = 0;
        this._i = 0;

    }

};

/**
* @name Phaser.Timer#next
* @property {number} next - The time at which the next event will occur.
* @readonly
*/
Object.defineProperty(Phaser.Timer.prototype, "next", {

    get: function () {
        return this.nextTick;
    }

});

/**
* @name Phaser.Timer#duration
* @property {number} duration - The duration in ms remaining until the next event will occur.
* @readonly
*/
Object.defineProperty(Phaser.Timer.prototype, "duration", {

    get: function () {

        if (this.running && this.nextTick > this._now)
        {
            return this.nextTick - this._now;
        }
        else
        {
            return 0;
        }

    }

});

/**
* @name Phaser.Timer#length
* @property {number} length - The number of pending events in the queue.
* @readonly
*/
Object.defineProperty(Phaser.Timer.prototype, "length", {

    get: function () {
        return this.events.length;
    }

});

/**
* @name Phaser.Timer#ms
* @property {number} ms - The duration in milliseconds that this Timer has been running for.
* @readonly
*/
Object.defineProperty(Phaser.Timer.prototype, "ms", {

    get: function () {
        return this._now - this._started - this._pauseTotal;
    }

});

/**
* @name Phaser.Timer#seconds
* @property {number} seconds - The duration in seconds that this Timer has been running for.
* @readonly
*/
Object.defineProperty(Phaser.Timer.prototype, "seconds", {

    get: function () {
        return this.ms * 0.001;
    }

});

Phaser.Timer.prototype.constructor = Phaser.Timer;
