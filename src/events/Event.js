var Class = require('../utils/Class');

var Event = new Class({

    initialize:

    function Event (type)
    {
        this.type = type;

        //  The element that initiated the event.
        this.target;

        this._propagate = true;
    },

    reset: function (target)
    {
        this.target = target;

        this._propagate = true;
    },

    stopPropagation: function ()
    {
        this._propagate = false;
    }

});

module.exports = Event;
