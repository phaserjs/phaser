
var Class = require('../../utils/Class');

var Layer = new Class({

    initialize:

    function Layer ()
    {
        this.children = [];

        Array.prototype.push.apply(this.children, arguments);
    },

    add: function (child)
    {
        var children = this.children;
        var index = children.indexOf(child);

        if (index < 0)
        {
            children.push(child);
        }

        return this;
    },

    addArray: function (childrenArray)
    {
        var length = childrenArray.length;

        for (var index = 0; index < length; ++index)
        {
            this.add(childrenArray[index]);
        }

        return this;
    },

    addX: function (value)
    {
        var children = this.children;
        var length = children.length;

        for (var index = 0; index < length; ++index)
        {
            children[index].x += value;
        }

        return this;
    },

    addY: function (value)
    {
        var children = this.children;
        var length = children.length;
        for (var index = 0; index < length; ++index)
        {
            children[index].y += value;
        }

        return this;
    },

    addPosition: function (x, y)
    {
        var children = this.children;
        var length = children.length;

        for (var index = 0; index < length; ++index)
        {
            children[index].x += x;
            children[index].y += y;
        }

        return this;
    },

    rotate: function (value)
    {
        var children = this.children;
        var length = children.length;

        for (var index = 0; index < length; ++index)
        {
            children[index].rotation += value;
        }

        return this;
    },

    setX: function (value)
    {
        var children = this.children;
        var length = children.length;

        for (var index = 0; index < length; ++index)
        {
            children[index].x = value;
        }

        return this;
    },

    setY: function (value)
    {
        var children = this.children;
        var length = children.length;

        for (var index = 0; index < length; ++index)
        {
            children[index].y = value;
        }

        return this;
    },

    setRotation: function (value)
    {
        var children = this.children;
        var length = children.length;

        for (var index = 0; index < length; ++index)
        {
            children[index].rotation = value;
        }

        return this;
    },

    setVisible: function (value)
    {
        var children = this.children;
        var length = children.length;

        for (var index = 0; index < length; ++index)
        {
            children[index].visible = value;
        }

        return this;
    },

    toggleVisible: function ()
    {
        var children = this.children;
        var length = children.length;

        for (var index = 0; index < length; ++index)
        {
            children[index].visible = !children[index].visible;
        }

        return this;
    }

});

module.exports = Layer;
