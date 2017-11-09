//  Phaser.Structs.ProcessQueue

var Class = require('../utils/Class');

var ProcessQueue = new Class({

    initialize:

    function ProcessQueue ()
    {
        this._pending = [];
        this._active = [];
        this._destroy = [];

        this._toProcess = 0;
    },

    add: function (item)
    {
        this._pending.push(item);

        this._toProcess++;

        return this;
    },

    remove: function (item)
    {
        this._destroy.push(item);

        this._toProcess++;

        return this;
    },

    update: function ()
    {
        if (this._toProcess === 0)
        {
            //  Quick bail
            return this._active;
        }

        var list = this._destroy;
        var active = this._active;
        var i;
        var item;

        //  Clear the 'destroy' list
        for (i = 0; i < list.length; i++)
        {
            item = list[i];

            //  Remove from the 'active' array
            var idx = active.indexOf(item);

            if (idx !== -1)
            {
                active.splice(idx, 1);
            }
        }

        list.length = 0;

        //  Process the pending addition list
        //  This stops callbacks and out of sync events from populating the active array mid-way during an update

        list = this._pending;

        for (i = 0; i < list.length; i++)
        {
            item = list[i];

            this._active.push(item);
        }

        list.length = 0;

        this._toProcess = 0;

        //  The owner of this queue can now safely do whatever it needs to with the active list
        return this._active;
    },

    getActive: function ()
    {
        return this._active;
    },

    destroy: function ()
    {
        this._pending = [];
        this._active = [];
        this._destroy = [];
    }

});

module.exports = ProcessQueue;
