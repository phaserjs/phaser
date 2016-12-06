var EventBinding = require('./EventBinding');

var EventDispatcher = function ()
{
    this.bindings = {};
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

    dispatch: function (event)
    {
        var binding;

        if (Array.isArray(event))
        {
            for (var i = 0; i < event.length; i++)
            {
                binding = this.getBinding(event[i].type);

                if (binding)
                {
                    return binding.dispatch(event[i]);
                }
            }
        }
        else
        {
            binding = this.getBinding(event.type);

            if (binding)
            {
                return binding.dispatch(event);
            }
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
        //  What would it do any differently to deleteAll?
    }

};

module.exports = EventDispatcher;
