var COLLIDES = require('../COLLIDES');

var Collides = {

    setCollidesNever: function ()
    {
        this.body.collides = COLLIDES.NEVER;

        return this;
    },

    setLite: function ()
    {
        this.body.collides = COLLIDES.LITE;

        return this;
    },

    setPassive: function ()
    {
        this.body.collides = COLLIDES.PASSIVE;

        return this;
    },

    setActive: function ()
    {
        this.body.collides = COLLIDES.ACTIVE;

        return this;
    },

    setFixed: function ()
    {
        this.body.collides = COLLIDES.FIXED;

        return this;
    },

    collides: {

        get: function ()
        {
            return this.body.collides;
        },

        set: function (value)
        {
            this.body.collides = value;
        }

    }

};

module.exports = Collides;
