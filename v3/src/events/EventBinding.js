var CONST = require('./const');
var EventListener = require('./EventListener');

var EventBinding = function (dispatcher, type)
{
    this.dispatcher = dispatcher;
    this.type = type;
    this.state = CONST.DISPATCHER_IDLE;
    this.active = [];
};

EventBinding.prototype.constructor = EventBinding;

EventBinding.prototype = {

    get: function (callback)
    {
        for (var i = 0; i < this.active.length; i++)
        {
            if (this.active[i].callback === callback)
            {
                return this.active[i];
            }
        }
    },

    getIndex: function (callback)
    {
        for (var i = 0; i < this.active.length; i++)
        {
            if (this.active[i].callback === callback)
            {
                return i;
            }
        }

        return null;
    },

    has: function (callback)
    {
        return (this.get(callback));
    },

    add: function (callback, priority, once)
    {
        var listener = this.get(callback);

        if (!listener)
        {
            //  The listener doesn't exist, so create one
            listener = EventListener(this.type, callback, priority, once);
        }
        else
        {
            //  Listener already exists, abort
            return;
        }

        if (this.state === CONST.DISPATCHER_IDLE)
        {
            //  The Dispatcher isn't doing anything, so we don't need a pending state
            listener.state = CONST.LISTENER_ACTIVE;
        }

        this.active.push(listener);

        this.active.sort(this.sortHandler);
    },

    sortHandler: function (listenerA, listenerB)
    {
        if (listenerB.priority < listenerA.priority)
        {
            return -1;
        }
        else if (listenerB.priority > listenerA.priority)
        {
            return 1;
        }
        else
        {
            return 0;
        }
    },

    remove: function (callback)
    {
        if (this.state === CONST.DISPATCHER_IDLE)
        {
            //  The Dispatcher isn't doing anything, so we can remove right away
            var i = this.getIndex(callback);

            if (i !== null)
            {
                this.active.splice(i, 1);
            }
        }
        else if (this.state === CONST.DISPATCHER_DISPATCHING)
        {
            //  The Dispatcher is working, so we flag the listener for removal at the end
            var listener = this.get(callback);

            if (listener)
            {
                listener.state = CONST.LISTENER_REMOVING;
            }
        }
    },

    dispatch: function (event)
    {
        if (this.state !== CONST.DISPATCHER_IDLE)
        {
            throw new Error('Error: Failed to execute \'EventDispatcher.dispatch\' on \'' + this.type + '\': The event is already being dispatched.');
        }
        else if (this.active.length === 0)
        {
            //  This was a valid dispatch call, we just had nothing to do ...
            return true;
        }

        this.state = CONST.DISPATCHER_DISPATCHING;

        console.log('Dispatching', this.active.length, 'listeners');

        var listener;

        event.reset(this.dispatcher);

        for (var i = 0; i < this.active.length; i++)
        {
            listener = this.active[i];

            if (listener.state !== CONST.LISTENER_ACTIVE)
            {
                continue;
            }

            listener.callback.call(this.dispatcher, event);

            //  Has the callback changed the state of this binding?
            if (this.state !== CONST.DISPATCHER_DISPATCHING)
            {
                //  Yup! Let's break out
                break;
            }

            //  Was it a 'once' listener?
            if (listener.once)
            {
                listener.state = CONST.LISTENER_REMOVING;
            }

            //  Has the event been halted by the callback?
            if (!event._propagate)
            {
                //  Break out, a listener has called Event.stopPropagation
                break;
            }
        }

        //  Dispatch over, or aborted
        if (this.state === CONST.DISPATCHER_REMOVING)
        {
            this.removeAll();
        }
        else if (this.state === CONST.DISPATCHER_DESTROYED)
        {
            this.dispatcher.delete(this.type);
        }
        else
        {
            //  All done, just purge the list
            this.tidy();

            this.state = CONST.DISPATCHER_IDLE;
        }
    },

    //  Removes all listeners
    //  If this is currently being dispatched then don't remove 'pending' listeners
    //  (i.e. ones that were added during the dispatch), only active ones
    removeAll: function ()
    {
        if (this.state === CONST.DISPATCHER_IDLE)
        {
            this.active.length = 0;
        }
        else
        {
            var i = this.active.length;

            while (i--)
            {
                if (this.active[i].state !== CONST.LISTENER_PENDING)
                {
                    this.active.slice(i, 1);
                }
            }

            this.state = CONST.DISPATCHER_IDLE;
        }
    },

    tidy: function ()
    {
        var i = this.active.length;

        while (i--)
        {
            if (this.active[i].state === CONST.LISTENER_REMOVING)
            {
                this.active.slice(i, 1);
            }
            else if (this.active[i].state === CONST.LISTENER_PENDING)
            {
                this.active[i].state === CONST.LISTENER_ACTIVE;
            }
        }
    },

    destroy: function ()
    {
        this.active.length = 0;
        this.dispatcher = undefined;
        this.type = '';
        this.state = CONST.DISPATCHER_DESTROYED;
    }

};

module.exports = EventBinding;
