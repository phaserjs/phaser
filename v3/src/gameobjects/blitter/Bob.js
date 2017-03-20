var Bob = function (blitter, x, y, frame, visible)
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

};

Bob.prototype.constructor = Bob;

Bob.prototype = {

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
    }

};

Object.defineProperties(Bob.prototype, {

    visible: {

        enumerable: true,

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

        enumerable: true,

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
