var Event = function (type, target)
{
    this.dispatcher;

    this.type = type;

    this.target = target;

    this._propagate = true;
};

Event.prototype.constructor = Event;

Event.prototype = {

    reset: function (dispatcher)
    {
        this.dispatcher = dispatcher;

        this._propagate = true;
    },

    stopPropagation: function ()
    {
        this._propagate = false;
    }

};

module.exports = Event;
