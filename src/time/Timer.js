/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
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
    * @property {number} _started - The time at which this Timer instance started.
    * @private
    * @default
    */
    this._started = 0;

    /**
    * @property {boolean} running - True if the Timer is actively running.
    * @default
    */
    this.running = false;

    /**
    * @property {boolean} pauseWithGame - If true then the timer will update itself automatically if the game pauses, otherwise it will carry on dispatching regardless.
    * @default
    */
    this.pauseWithGame = true;

    /**
    * @property {boolean} autoDestroy - A Timer that is set to automatically destroy itself will do so after all of its events have been dispatched (assuming no looping events).
    */
    this.autoDestroy = autoDestroy;

    /**
    * @property {boolean} expired - An expired Timer is one in which all of its events have been dispatched and none are pending.
    * @default
    */
    this.expired = false;

    /**
    * @property {array} events - An array holding the event data.
    */
    this.events = [];

    /**
    * This is the event you should listen for. It will be dispatched whenever one of your events is triggered.
    * It will pass whatever properties you set-up for the event as parameters.
    * @property {Phaser.Signal} onEvent
    */
    this.onEvent = new Phaser.Signal();

    /**
    * @property {number} nextTick - The time the next tick will occur. Do not set this value directly.
    * @protected
    */
    this.nextTick = 0;

    /**
    * @property {number} _now - The current start-time adjusted time.
    * @protected
    */
    this._now = 0;

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
    * Creates a new Event on this Timer.
    * @method Phaser.Timer#_create
    * @private
    */
    create: function (delay, loop, repeatCount, args) {

        this.events.push({
            delay: delay,
            tick: delay,
            repeatCount: repeatCount,
            loop: loop,
            args: args
        });

        this.order();

        this.expired = false;

    },

    //  Need to do a Stop Watch example

    /**
    * Adds a new Event to this Timer. The event will fire after the given amount of 'delay' in milliseconds has passed, once the Timer has started running.
    * Call Timer.start() once you have added all of the Events you require for this Timer. The delay is in relation to when the Timer starts, not the time it was added.
    * @method Phaser.Timer#add
    * @param {number} [delay] - The number of milliseconds before the Timer will dispatch its onEvent signal.
    */
    add: function (delay) {

        this.create(delay, false, 0, Array.prototype.splice.call(arguments, 1));

    },

    /**
    * Adds a new Event to this Timer that will repeat for the given number of iterations.
    * The event will fire after the given amount of 'delay' milliseconds has passed once the Timer has started running.
    * Call Timer.start() once you have added all of the Events you require for this Timer. The delay is in relation to when the Timer starts, not the time it was added.
    * @method Phaser.Timer#repeat
    * @param {number} [delay] - The number of milliseconds before the Timer will dispatch its onEvent signal.
    * @param {number} [count] - The number of times to repeat this Event.
    */
    repeat: function (delay, count) {

        this.create(delay, false, count, Array.prototype.splice.call(arguments, 2));

    },

    /**
    * Adds a new looped Event to this Timer that will repeat forever or until the Timer is stopped.
    * The event will fire after the given amount of 'delay' milliseconds has passed once the Timer has started running.
    * Call Timer.start() once you have added all of the Events you require for this Timer. The delay is in relation to when the Timer starts, not the time it was added.
    * @method Phaser.Timer#loop
    * @param {number} [delay] - The number of milliseconds before the Timer will dispatch its onEvent signal.
    */
    loop: function (delay) {

        this.create(delay, true, 0, Array.prototype.splice.call(arguments, 1));

    },

    /**
    * Starts this Timer running.
    * @method Phaser.Timer#start
    */
    start: function() {

        this._started = this.game.time.now;
        this.running = true;

    },

    /**
    * Stops this Timer from running. Does not cause it to be destroyed if autoDestroy is set to true.
    * @method Phaser.Timer#stop
    */
    stop: function() {

        this.running = false;
        this.events.length = 0;

    },

    order: function () {

        //  Sort the events so the one with the lowest tick is first
        this.events.sort(this.sortHandler);

        this.nextTick = this.events[0].tick;

    },

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
    * @return {boolean} True if there are still events waiting to be dispatched, otherwise false if this Timer can be deleted.
    */
    update: function(time) {

        this._now = time - this._started;

        if (this.running && this._now >= this.nextTick)
        {
            var i = 0;
            var len = this.events.length;

            while (i < len)
            {
                if (this._now >= this.events[i].tick)
                {
                    if (this.events[i].loop)
                    {
                        this.events[i].tick += this.events[i].delay - (this._now - this.events[i].tick);
                        this.onEvent.dispatch.apply(this, this.events[i].args);
                    }
                    else if (this.events[i].repeatCount > 0)
                    {
                        this.events[i].repeatCount--;
                        this.events[i].tick += this.events[i].delay - (this._now - this.events[i].tick);
                        this.onEvent.dispatch.apply(this, this.events[i].args);
                    }
                    else
                    {
                        this.onEvent.dispatch.apply(this, this.events[i].args);
                        this.events.splice(i, 1);
                        len--;
                    }

                    i++;
                }
                else
                {
                    break;
                }
            }

            //  There are no events left at all
            if (this.events.length > 0)
            {
                this.expired = true;
            }
            else
            {
                this.order();
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
    * Destroys this Timer. Events are not dispatched.
    * @method Phaser.Timer#destroy
    */
    destroy: function() {

        this.onEvent.removeAll();
        this.running = false;
        this.events = [];

    }

};

/**
* @name Phaser.Timer#ms
* @property {number} ms - The duration in milliseconds that this Timer has been running for.
* @readonly
*/
Object.defineProperty(Phaser.Timer.prototype, "ms", {

    get: function () {
        return this.game.time.now - this._started;
    }

});

/**
* @name Phaser.Timer#seconds
* @property {number} seconds - The duration in seconds that this Timer has been running for.
* @readonly
*/
Object.defineProperty(Phaser.Timer.prototype, "seconds", {

    get: function () {
        return (this.game.time.now - this._started) * 0.001;
    }

});

Phaser.Timer.prototype.constructor = Phaser.Timer;
