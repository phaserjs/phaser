var Class = require('../utils/Class');
var ObjectPool = require('../gameobjects/pool/ObjectPool');

var PoolManager = new Class({

    initialize:

    function PoolManager (state)
    {
        this.state = state;

        this._active = [];
        this._pendingInsertion = [];
        this._pendingRemoval = [];

        this.processing = false;
    },

    add: function (pool)
    {
        if (this.processing)
        {
            this._pendingInsertion.push(pool);
        }
        else
        {
            this._active.push(pool);
        }

        return this;
    },

    create: function ()
    {
        var pool = new ObjectPool();

        this.add(pool);

        return pool;
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
        var pool;

        //  Delete old pools
        for (i = 0; i < toRemove; i++)
        {
            pool = this._pendingRemoval[i];

            var index = this._active.indexOf(pool);

            if (index > -1)
            {
                this._active.splice(index, 1);
            }

            //  Pool them?
            // pool.destroy();
        }

        //  Move pending to active
        this._active = this._active.concat(this._pendingInsertion.splice(0));

        //  Clear the lists
        this._pendingRemoval.length = 0;
        this._pendingInsertion.length = 0;
    },

    update: function (time, delta)
    {
        this.processing = true;

        for (var i = 0; i < this._active.length; i++)
        {
            var pool = this._active[i];

            pool.update.call(pool, time, delta);
        }

        this.processing = false;
    },

    //  State that owns this Pool is shutting down
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

        this.state = undefined;
    }

});

module.exports = PoolManager;
