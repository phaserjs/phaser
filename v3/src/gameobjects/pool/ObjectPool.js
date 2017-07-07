//  Phaser.GameObjects.ObjectPool

var Class = require('../../utils/Class');

//  An Object Pool

var ObjectPool = new Class({

    initialize:

    function ObjectPool (manager, classType, maxSize, createCallback, callbackScope)
    {
        if (maxSize === undefined) { maxSize = -1; }
        if (createCallback === undefined) { createCallback = this.makeGameObject; }
        if (callbackScope === undefined) { callbackScope = this; }

        this.manager = manager;
        this.state = manager.state;

        this.displayList = this.state.sys.displayList;
        this.updateList = this.state.sys.updateList;

        this.createCallback = createCallback;
        this.callbackScope = callbackScope;

        this.maxSize = maxSize;

        this.classType = classType;

        this._list = [];
    },

    makeGameObject: function ()
    {
        var gameObject = new this.classType(this.state);

        this.displayList.add(gameObject);

        gameObject.setActive(false);
        gameObject.setVisible(false);

        return gameObject;
    },

    //  Add an existing GameObject, or Array or Group of GameObjects into this Pool
    add: function (child)
    {
        var children;

        if (Array.isArray(child))
        {
            children = child;
        }
        else if (child.hasOwnProperty('children'))
        {
            children = child.children.getArray();
        }
        else
        {
            children = [ child ];
        }

        var len = children.length;

        if (this.maxSize > -1)
        {
            var free = this.maxSize - this._list.length;

            if (len > free)
            {
                len = free;
            }
        }

        for (var i = 0; i < len; i++)
        {
            this._list.push(children[i]);
        }

        return this;
    },

    //  Create X new GameObjects in this Pool if there is capacity to do so
    create: function (quantity)
    {
        for (var i = 0; i < quantity; i++)
        {
            if (!this.isFull())
            {
                this._list.push(this.createCallback.call(this.callbackScope));
            }
        }

        return this;
    },

    //  Proxy method for sub-classes to override
    get: function ()
    {
        return this.getFreeGameObject();
    },

    getFreeGameObject: function ()
    {
        var gameObject;

        for (var i = 0; i < this._list.length; i++)
        {
            gameObject = this._list[i];

            if (!gameObject.active)
            {
                gameObject.setActive(true);
                gameObject.setVisible(true);

                return gameObject;
            }
        }

        if (!this.isFull())
        {
            gameObject = this.createCallback.call(this.callbackScope);

            gameObject.setActive(true);
            gameObject.setVisible(true);

            this._list.push(gameObject);

            return gameObject;
        }

        return null;
    },

    kill: function (gameObject)
    {
        if (this._list.indexOf(gameObject) > -1)
        {
            gameObject.setActive(false);
        }
    },

    killAndHide: function (gameObject)
    {
        if (this._list.indexOf(gameObject) > -1)
        {
            gameObject.setActive(false);
            gameObject.setVisible(false);
        }
    },

    isFull: function ()
    {
        if (this.maxSize === -1)
        {
            return false;
        }
        else
        {
            return (this._list.length === this.maxSize);
        }
    },

    update: function (time, delta)
    {
        for (var i = 0; i < this._list.length; i++)
        {
            var gameObject = this._list[i];

            if (gameObject.active)
            {
                gameObject.update(time, delta);
            }
        }
    },

    getTotalUsed: function ()
    {
        var total = 0;

        for (var i = 0; i < this._list.length; i++)
        {
            if (this._list[i].active)
            {
                total++;
            }
        }

        return total;
    },

    getTotalFree: function ()
    {
        var used = this.getTotalUsed();
        var capacity = (this.maxSize === -1) ? 999999999999 : this.maxSize;

        return (capacity - used);
    },

    destroy: function ()
    {

    }

});

module.exports = ObjectPool;
