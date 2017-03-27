
var Class = require('../../utils/Class');
var Set = require('../../structs/Set');
var Actions = require('./actions/');

var Layer = new Class({

    Mixins: [
        Actions.IncX,
        Actions.IncY,
        Actions.IncXY,
        Actions.SetX,
        Actions.SetY,
        Actions.SetXY,
        Actions.Rotate,
        Actions.Angle,
        Actions.SetRotation,
        Actions.SetVisible,
        Actions.ToggleVisible,
        Actions.Align
    ],

    initialize:

    function Layer (state, children)
    {
        this.state = state;

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

    destroy: function ()
    {
        this.children.clear();

        this.state = undefined;
        this.children = undefined;
    }
});

module.exports = Layer;
