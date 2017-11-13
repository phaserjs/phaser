var Class = require('../../utils/Class');

//  TODO - Extend from ProcessQueue
var UpdateList = new Class({

    initialize:

    function UpdateList (scene)
    {
        this.scene = scene;

        this._list = [];
        this._pendingInsertion = [];
        this._pendingRemoval = [];
    },

    add: function (child)
    {
        //  Is child already in this list?

        if (this._list.indexOf(child) === -1 && this._pendingInsertion.indexOf(child) === -1)
        {
            this._pendingInsertion.push(child);
        }

        return child;
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

            var index = this._list.indexOf(gameObject);

            if (index > -1)
            {
                this._list.splice(index, 1);
            }

            //  Pool them?
            // gameObject.destroy();
        }

        //  Move pending to active
        this._list = this._list.concat(this._pendingInsertion.splice(0));

        //  Clear the lists
        this._pendingRemoval.length = 0;
        this._pendingInsertion.length = 0;
    },

    update: function (time, delta)
    {
        for (var i = 0; i < this._list.length; i++)
        {
            var gameObject = this._list[i];

            if (gameObject.active)
            {
                gameObject.preUpdate.call(gameObject, time, delta);
            }
        }
    },

    remove: function (child)
    {
        var index = this._list.indexOf(child);

        if (index !== -1)
        {
            this._list.splice(index, 1);
        }
        
        return child;
    },

    removeAll: function ()
    {
        var i = this._list.length;

        while (i--)
        {
            this.remove(this._list[i]);
        }

        return this;
    },

    shutdown: function ()
    {
        this.removeAll();

        this._list.length = 0;
        this._pendingRemoval.length = 0;
        this._pendingInsertion.length = 0;
    },

    destroy: function ()
    {
        this.shutdown();

        this.scene = undefined;
    }

});

module.exports = UpdateList;
