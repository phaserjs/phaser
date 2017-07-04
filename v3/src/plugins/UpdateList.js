var Class = require('../utils/Class');

var UpdateList = new Class({

    initialize:

    function UpdateList (state)
    {
        this.state = state;

        this._active = [];
        this._pendingInsertion = [];
        this._pendingRemoval = [];
    },

    add: function (child)
    {
        this._pendingInsertion.push(child);
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
        var gameObject;

        //  Delete old gameObjects
        for (i = 0; i < toRemove; i++)
        {
            gameObject = this._pendingRemoval[i];

            var index = this._active.indexOf(gameObject);

            if (index > -1)
            {
                this._active.splice(index, 1);
            }

            //  Pool them?
            // gameObject.destroy();
        }

        //  Move pending to active
        this._active = this._active.concat(this._pendingInsertion.splice(0));

        //  Clear the lists
        this._pendingRemoval.length = 0;
        this._pendingInsertion.length = 0;
    },

    update: function (time, delta)
    {
        for (var i = 0; i < this._active.length; i++)
        {
            var gameObject = this._active[i];

            gameObject.preUpdate.call(gameObject, time, delta);
        }
    },

    //  State that owns this Clock is shutting down
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

module.exports = UpdateList;
