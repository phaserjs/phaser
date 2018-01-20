var Class = require('../../utils/Class');

var Bob = new Class({

    initialize:

    function Bob (blitter, x, y, frame, visible)
    {
        this.parent = blitter;

        this.x = x;
        this.y = y;
        this.frame = frame;
        this.data = {};

        this._visible = visible;
        this._alpha = 1;

        this.flipX - false;
        this.flipY = false;
    },

    setFrame: function (frame)
    {
        if (frame === undefined)
        {
            frame = this.parent.frame;
        }
        else
        {
            frame = this.parent.texture.get(frame);
        }

        return this;
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

    setFlipX: function (value)
    {
        this.flipX = value;

        return this;
    },

    setFlipY: function (value)
    {
        this.flipY = value;

        return this;
    },

    setFlip: function (x, y)
    {
        this.flipX = x;
        this.flipY = y;

        return this;
    },

    setVisible: function (value)
    {
        this.visible = value;

        return this;
    },

    setAlpha: function (value)
    {
        this.alpha = value;

        return this;
    },

    destroy: function ()
    {
        this.parent.dirty = true;

        this.parent.children.remove(this);

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
