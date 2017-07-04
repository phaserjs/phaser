var Class = require('../../utils/Class');

var Bob = new Class({

    initialize:

    function Bob (x, y, frame, visible)
    {
        //  Set by the DisplayList class
        this.parent;

        this.x = x;
        this.y = y;
        this.frame = frame;
        this.data = {};

        this._visible = visible;
        this._alpha = 1;

        this.flipX - false;
        this.flipY = false;

    },

    resetFlip: function ()
    {
        this.flipX = false;
        this.flipY = false;
    },

    reset: function (x, y, frame)
    {
        this.x = x;
        this.y = y;
        this.frame = frame;
    },

    destroy: function ()
    {
        this.parent = undefined;
        this.frame = undefined;
        this.data = undefined;
    },

    visible: {

        get: function ()
        {
            return this._visible;
        },

        set: function (value)
        {
            this._visible = value;
            this.parent.dirty = true;
        }

    },

    alpha: {

        get: function ()
        {
            return this._alpha;
        },

        set: function (value)
        {
            this._alpha = value;
            this.parent.dirty = true;
        }

    }

});

module.exports = Bob;
