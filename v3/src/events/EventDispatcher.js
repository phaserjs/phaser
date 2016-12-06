var EventBinding = require('./EventBinding');

var EventDispatcher = function ()
{
    this.bindings = {};
    this.filters = [];
    this.hasFilters = false;
};

EventDispatcher.prototype.constructor = EventDispatcher;

EventDispatcher.prototype = {

    getBinding: function (type)
    {
        if (this.bindings.hasOwnProperty(type))
        {
            return this.bindings[type];
        }
    },

    createBinding: function (type)
    {
        if (!this.getBinding(type))
        {
            this.bindings[type] = new EventBinding(this, type);
        }

        return this.bindings[type];
    },

    on: function (type, listener, priority)
    {
        if (priority === undefined) { priority = 0; }

        var binding = this.createBinding(type);

        if (binding)
        {
            binding.add(listener, priority, false);
        }

        return this;
    },

    once: function (type, listener, priority)
    {
        if (priority === undefined) { priority = 0; }

        var binding = this.createBinding(type);

        if (binding)
        {
            binding.add(listener, priority, true);
        }

        return this;
    },

    //  Add a callback that is notified every time this EventDispatcher dispatches an event
    //  no matter what the event type is. Filters are invoked first, before any bindings,
    //  and can stop events if they wish (in which case they'll never reach the bindings)
    filter: function (callback)
    {
        var i = this.filters.indexOf(callback);

        if (i === -1)
        {
            //  Add the filter
            this.filters.push(callback);
        }
        else
        {
            //  Remove the filter
            this.filters.splice(i, 1);
        }
        
        this.hasFilters = (this.filters.length > 0);

        return this;
    },

    has: function (type, listener)
    {
        var binding = this.getBinding(type);

        if (binding)
        {
            return binding.has(listener);
        }
        else
        {
            return false;
        }
    },

    total: function (type)
    {
        var binding = this.getBinding(type);

        if (binding)
        {
            return binding.total();
        }
    },

    //  Removes an event listener.
    //  If there is no matching listener registered with the EventDispatcher, a call to this method has no effect.
    off: function (type, listener)
    {
        var binding = this.getBinding(type);

        if (binding)
        {
            binding.remove(listener);
        }

        return this;
    },

    _dispatchHandler: function (event)
    {
        event.reset(this);

        //  Pass the event through the filters first

        if (this.hasFilters)
        {
            for (var i = 0; i < this.filters.length; i++)
            {
                this.filters[i].call(this, event);

                //  Did the filter kill the event? If so, we can abort now
                if (!event._propagate)
                {
                    return;
                }
            }
        }

        var binding = this.getBinding(event.type);

        if (binding)
        {
            binding.dispatch(event);
        }
    },

    dispatch: function (event)
    {
        if (Array.isArray(event))
        {
            for (var i = 0; i < event.length; i++)
            {
                this._dispatchHandler(event[i]);
            }
        }
        else
        {
            this._dispatchHandler(event);
        }
    },

    //  Removes all listeners, but retains the event type entries
    removeAll: function (type)
    {
        var binding = this.getBinding(type);

        if (binding)
        {
            binding.removeAll();
        }

        return this;
    },

    removeAllFilters: function ()
    {
        this.filters.length = 0;

        this.hasFilters = false;

        return this;
    },

    delete: function (type)
    {
        var binding = this.getBinding(type);

        if (binding)
        {
            binding.destroy();

            delete this.bindings[type];
        }

        return this;
    },

    deleteAll: function ()
    {
        for (var binding in this.bindings)
        {
            binding.destroy();
        }

        this.bindings = {};
    },

    destroy: function ()
    {
        this.deleteAll();
        this.removeAllFilters();
    }

};

module.exports = EventDispatcher;
