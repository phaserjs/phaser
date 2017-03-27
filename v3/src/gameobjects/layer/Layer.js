
var Class = require('../../utils/Class');
var Set = require('../../structs/Set');

var Layer = new Class({

    initialize:

    function Layer (children)
    {
        this.children = new Set(children);
    },

    //  Layer management methods:

    add: function (child)
    {
        this.children.set(child);

        return this;
    },

    addMultiple: function (children)
    {
        if (Array.isArray(children))
        {
            for (var i = 0; i < children.length; i++)
            {
                this.children.set(children[i]);
            }
        }

        return this;
    },

    remove: function (child)
    {
        this.children.delete(child);

        return this;
    },

    clear: function ()
    {
        this.children.clear();

        return this;
    },

    //  Child Update Methods

    addX: require('./actions/AddX'),
    addY: require('./actions/AddY'),
    addXY: require('./actions/AddXY'),
    setX: require('./actions/SetX'),
    setY: require('./actions/SetY'),
    setXY: require('./actions/SetXY'),

    rotate: require('./actions/Rotate'),
    angle: require('./actions/Angle'),
    setRotation: require('./actions/SetRotation'),
    setVisible: require('./actions/SetVisible'),
    toggleVisible: require('./actions/ToggleVisible')

});

module.exports = Layer;
