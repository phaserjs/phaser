var Class = require('../utils/Class');
var TimerEvent = require('./TimerEvent');

var Clock = new Class({

    initialize:

    function Clock (scene)
    {
        this.scene = scene;

        this.now = Date.now();

        //  Scale the delta time coming into the Clock by this factor
        //  which then influences anything using this Clock for calculations, like TimerEvents
        this.timeScale = 1;

        this.paused = false;

        this._active = [];
        this._pendingInsertion = [];
        this._pendingRemoval = [];
    },

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

    clearPendingEvents: function ()
    {
        this._pendingInsertion = [];
    },

    removeAllEvents: function ()
    {
        this._pendingRemoval = this._pendingRemoval.concat(this._active);

        return this;
    },

    begin: function ()
    {
        var toRemove = this._pendingRemoval.length;
        var toInsert = this._pendingInsertion.length;

        if (toRemove === 0 && toInsert === 0)
        {
            //  Quick bail
            return;
        }

        var i;
        var event;

        //  Delete old events
        for (i = 0; i < toRemove; i++)
        {
            event = this._pendingRemoval[i];

            var index = this._active.indexOf(event);

            if (index > -1)
            {
                this._active.splice(index, 1);
            }

            //  Pool them?
            event.destroy();
        }

        for (i = 0; i < toInsert; i++)
        {
            event = this._pendingInsertion[i];

            event.elapsed = event.startAt * event.timeScale;

            this._active.push(event);
        }

        //  Clear the lists
        this._pendingRemoval.length = 0;
        this._pendingInsertion.length = 0;
    },

    update: function (time, delta)
    {
        this.now = time;

        if (this.paused)
        {
            return;
        }

        delta * this.timeScale;

        for (var i = 0; i < this._active.length; i++)
        {
            var event = this._active[i];

            if (event.paused)
            {
                continue;
            }

            //  Use delta time to increase elapsed.
            //  Avoids needing to adjust for pause / resume.
            //  Automatically smoothed by TimeStep class.
            //  In testing accurate to +- 1ms!
            event.elapsed += delta * event.timeScale;

            if (event.elapsed >= event.delay)
            {
                var remainder = event.elapsed - event.delay;

                //  Limit it, in case it's checked in the callback
                event.elapsed = event.delay;

                //  Process the event
                if (!event.hasDispatched && event.callback)
                {
                    event.hasDispatched = true;
                    event.callback.apply(event.callbackScope, event.args);
                }

                if (event.repeatCount > 0)
                {
                    event.repeatCount--;

                    event.elapsed = remainder;
                    event.hasDispatched = false;
                }
                else
                {
                    this._pendingRemoval.push(event);
                }
            }
        }
    },

    //  Scene that owns this Clock is shutting down
    shutdown: function ()
    {
        var i;

        for (i = 0; i < this._pendingInsertion.length; i++)
        {
            this._pendingInsertion[i].destroy();
        }

        for (i = 0; i < this._active.length; i++)
        {
            this._active[i].destroy();
        }

        for (i = 0; i < this._pendingRemoval.length; i++)
        {
            this._pendingRemoval[i].destroy();
        }

        this._active.length = 0;
        this._pendingRemoval.length = 0;
        this._pendingInsertion.length = 0;
    },

    //  Game level nuke
    destroy: function ()
    {
        this.shutdown();

        this.scene = undefined;
    }

});

module.exports = Clock;
