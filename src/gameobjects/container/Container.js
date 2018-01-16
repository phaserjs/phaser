var Class = require('../../utils/Class');
var Components = require('../components');
var DataProxy = require('../components/DataProxy');
var TransformMatrix = require('../components/TransformMatrix');

var Container = new Class({

    // Mixins: [
    //     Components.Visible,
    //     SpriteRender
    // ],

    initialize:

    function Container (scene, x, y)
    {
        this.scene = scene;

        this.type = 'Container';

        this.name = '';

        //  Likely swap for a ProcessQueue to make it iteration safe
        this.list = [];

        this.active = true;

        this.data = new DataProxy(scene, this);

        this._depth = 0;

        this._transform = new TransformMatrix();

        this._x = x;
        this._y = y;
        this._scaleX = 1;
        this._scaleY = 1;
        this._rotation = 0;

        this._visible = true;
    },

    x: {

        get: function ()
        {
            return this._x;
        },

        set: function (value)
        {
            this._x = value;

            for (var i = 0; i < this.list.length; i++)
            {
                // this.list[i].depth = value;
            }
        }

    },

    y: {

        get: function ()
        {
            return this._y;
        },

        set: function (value)
        {
            this._y = value;

            for (var i = 0; i < this.list.length; i++)
            {
                // this.list[i].depth = value;
            }
        }

    },

    depth: {

        get: function ()
        {
            return this._depth;
        },

        set: function (value)
        {
            this._depth = value;

            for (var i = 0; i < this.list.length; i++)
            {
                this.list[i].depth = value;
            }
        }

    },

    setDepth: function (value)
    {
        if (value === undefined) { value = 0; }

        this.depth = value;

        return this;
    },

    visible: {

        get: function ()
        {
            return this._visible;
        },

        set: function (value)
        {
            if (value)
            {
                this._visible = true;
            }
            else
            {
                this._visible = false;
            }

            for (var i = 0; i < this.list.length; i++)
            {
                this.list[i].visible = value;
            }
        }

    },

    setVisible: function (value)
    {
        this.visible = value;

        return this;
    },

    add: function (child)
    {
        //  Don't allow containers to be added

        //  Is child already in this container?

        if (this.getIndex(child) === -1 && child.parent !== this)
        {
            //  No, good ...
            this.scene.sys.updateList.remove(child);

            if (child.parent)
            {
                child.parent.remove(child);
            }

            child.parent = this;

            this.list.push(child);

            // this.scene.sys.sortChildrenFlag = true;
        }

        return child;
    },

    remove: function (child)
    {
        var index = this.list.indexOf(child);

        if (index !== -1)
        {
            //  Not iteration safe - use ProcessQueue instead?
            this.list.splice(index, 1);

            child.parent = null;

            // this.scene.sys.sortChildrenFlag = true;
        }
        
        return child;
    },

    preUpdate: function (time, delta)
    {
        //  iterate children and call preUpdate on them, as they won't be part of the Scenes updateList
    },

    setActive: function (value)
    {
        this.active = value;

        return this;
    },

    setName: function (value)
    {
        this.name = value;

        return this;
    },

    setData: function (key, value)
    {
        this.data.set(key, value);

        return this;
    },

    getData: function (key)
    {
        return this.data.get(key);
    },

    destroy: function ()
    {
    }

});

module.exports = Container;
