var Class = require('../../utils/Class');
var DataProxy = require('./components/DataProxy');
var List = require('../../structs/List');

var Container = new Class({

    Extends: List,

    initialize:

    function Container (scene, x, y)
    {
        List.call(this, this);

        this.scene = scene;

        this.type = 'Container';

        this.name = '';

        this.active = true;

        this.data = new DataProxy(scene, this);

        this._x = x;
        this._y = y;
        this._z = 0;
        this._w = 0;

        this._scaleX = 1;
        this._scaleY = 1;
        this._rotation = 0;
        this._depth = 0;
    },

    x: {

        get: function ()
        {
            return this._x;
        },

        set: function (value)
        {
            var diff = this._x - value;

            this._x = value;

            //  Update all children
            for (var i = 0; i < this.list.length; i++)
            {
                this.list[i].x += diff;
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
            var diff = this._y - value;

            this._y = value;

            //  Update all children
            for (var i = 0; i < this.list.length; i++)
            {
                this.list[i].y += diff;
            }
        }

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
