
var Class = require('../../utils/Class');

var Layer = new Class({

    initialize:

    function Layer()
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
    },

    addArray: function (childrenArray)
    {
        var length = childrenArray.length;
        for (var index = 0; index < length; ++index)
        {
            this.add(childrenArray[index]);
        }
    },

    addX: function (value) {
        var children = this.children;
        var length = children.length;
        for (var index = 0; index < length; ++index)
        {
            children[index].x += value;
        }
    },

    addY: function (value) 
    {
        var children = this.children;
        var length = children.length;
        for (var index = 0; index < length; ++index)
        {
            children[index].y += value;
        }
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
    },

    rotate: function (value) {
        var children = this.children;
        var length = children.length;
        for (var index = 0; index < length; ++index)
        {
            children[index].rotation += value;
        }
    },

    setX: function (value) {
        var children = this.children;
        var length = children.length;
        for (var index = 0; index < length; ++index)
        {
            children[index].x = value;
        }
    },

    setY: function (value) 
    {
        var children = this.children;
        var length = children.length;
        for (var index = 0; index < length; ++index)
        {
            children[index].y = value;
        }
    },

    setRotation: function (value) {
        var children = this.children;
        var length = children.length;
        for (var index = 0; index < length; ++index)
        {
            children[index].rotation = value;
        }
    },

    setVisible: function (value) {
        var children = this.children;
        var length = children.length;
        for (var index = 0; index < length; ++index)
        {
            children[index].visible = value;
        }  
    },

    toggleVisible: function ()
    {
        var children = this.children;
        var length = children.length;
        for (var index = 0; index < length; ++index)
        {
            children[index].visible = !children[index].visible;
        }  
    }

});

module.exports = Layer;