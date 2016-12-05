var EventDispatcher = function ()
{
    this.listeners = {};

    this._state = EventDispatcher.STATE_PENDING;
};

EventDispatcher.STATE_PENDING = 0;
EventDispatcher.STATE_DISPATCHING = 1;
EventDispatcher.STATE_REMOVING_ALL = 2;
EventDispatcher.STATE_DESTROYED = 3;

EventDispatcher.prototype.constructor = EventDispatcher;

EventDispatcher.prototype = {

    //  Private
    add: function (type, listener, priority, isOnce)
    {
        if (this.listeners === undefined)
        {
            //  Has the EventDispatcher been destroyed?
            return;
        }

        console.log('Add listener', type, listener);

        if (!this.listeners[type])
        {
            this.listeners[type] = [];
        }

        var listeners = this.listeners[type];

        if (this.has(type, listener))
        {
            this.update(type, listener, priority, isOnce);
        }
        else
        {
            listeners.push({ listener: listener, priority: priority, isOnce: isOnce });
        }

        listeners.sort(this.sortHandler);
    },

    sortHandler: function (listenerA, listenerB)
    {
        if (listenerA.priority < listenerB.priority)
        {
            return -1;
        }
        else if (listenerA.priority > listenerB.priority)
        {
            return 1;
        }
        else
        {
            return 0;
        }
    },

    update: function (type, listener, priority, isOnce)
    {
        var listeners = this.listeners[type];

        for (var i = 0; i < listeners.length; i++)
        {
            if (listeners[i].listener === listener)
            {
                //  They're trying to add the same listener again, so just update the priority + once
                listeners[i].priority = priority;
                listeners[i].isOnce = isOnce;
            }
        }

    },

    on: function (type, listener, priority)
    {
        if (priority === undefined) { priority = 0; }

        this.add(type, listener, priority, false);

        return this;
    },

    once: function (type, listener, priority)
    {
        if (priority === undefined) { priority = 0; }

        this.add(type, listener, priority, true);

        return this;
    },

    has: function (type, listener)
    {
        if (!this.listeners || !this.listeners[type])
        {
            return false;
        }

        var listeners = this.listeners[type];

        for (var i = 0; i < listeners.length; i++)
        {
            if (listeners[i].listener === listener)
            {
                return true;
            }
        }

        return false;
    },

    //  Removes an event listener.
    //  If there is no matching listener registered with the EventDispatcher, a call to this method has no effect.
    off: function (type, listener)
    {
        if (!this.listeners || !this.listeners[type])
        {
            return this;
        }

        var listeners = this.listeners[type];

        for (var i = 0; i < listeners.length; i++)
        {
            if (listeners[i].listener === listener)
            {
                console.log('Remove listener', type, listener);

                listeners.splice(i, 1);
                break;
            }
        }

        return this;
    },

    dispatch: function (event)
    {
        //  Add in a dispatch lock, to stop the dispatcher from being invoked during an event callback

        if (this._state !== EventDispatcher.STATE_PENDING || !this.listeners[event.type])
        {
            return false;
        }

        this._state = EventDispatcher.STATE_DISPATCHING;

        var listeners = this.listeners[event.type];

        event.reset(this);

        var toRemove = [];
        var entries = listeners.slice();

        console.log('Dispatching', entries.length, 'listeners');

        for (var i = 0; i < entries.length; i++)
        {
            //  Add Custom Events
            entries[i].listener.call(this, event);

            //  Has the callback done something disastrous? Like called removeAll, or nuked the dispatcher?
            if (this._state !== EventDispatcher.STATE_DISPATCHING)
            {
                //  Yup! Let's get out of here ...
                break;
            }

            if (entries[i].isOnce)
            {
                toRemove.push(entries[i]);
            }

            //  Has the event been halted?
            if (!event._propagate)
            {
                //  Break out, a listener has called Event.stopPropagation
                break;
            }
        }

        if (this._state === EventDispatcher.STATE_REMOVING_ALL)
        {
            this.removeAll();
        }
        else if (this._state === EventDispatcher.STATE_DESTROYED)
        {
            this.destroy();
        }
        else
        {
            //  Anything in the toRemove list?

            console.log('Cleaning out', toRemove.length, 'listeners');

            for (i = 0; i < toRemove.length; i++)
            {
                this.off(toRemove[i].type, toRemove[i].listener);
            }

            this._state = EventDispatcher.STATE_PENDING;
        }

        return true;
    },

    //  Removes all listeners, but retains the event type entries
    removeAll: function ()
    {
        if (this._state === EventDispatcher.STATE_DISPATCHING)
        {
            this._state = EventDispatcher.STATE_REMOVING_ALL;

            return;
        }

        for (var eventType in this.listeners)
        {
            this.listeners[eventType].length = 0;
        }

        return this;
    },

    destroy: function ()
    {
        if (this._state === EventDispatcher.STATE_DISPATCHING)
        {
            this._state = EventDispatcher.STATE_DESTROYED;

            return;
        }

        for (var eventType in this.listeners)
        {
            this.listeners[eventType].length = 0;

            delete this.listeners[eventType];
        }

        this.listeners = undefined;
    }

};

module.exports = EventDispatcher;
