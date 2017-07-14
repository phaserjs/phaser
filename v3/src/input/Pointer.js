//  Phaser.Input.Pointer

var Class = require('../utils/Class');

var Pointer = new Class({

    initialize:

    function Pointer (manager)
    {
        this.manager = manager;

        this.x = 0;
        this.y = 0;

        this.isDown = false;

        this.dirty = false;

        this.justDown = false;
        this.justUp = false;
        this.justMoved = false;
    },

    reset: function ()
    {
        this.dirty = false;
        this.justDown = false;
        this.justUp = false;
        this.justMoved = false;
    },

    move: function (event)
    {
        this.dirty = true;

        this.x = event.x;
        this.y = event.y;

        this.justMoved = true;
    },

    down: function (event)
    {
        this.dirty = true;

        this.x = event.x;
        this.y = event.y;

        this.justDown = true;
    },

    up: function (event)
    {
        this.dirty = true;

        this.x = event.x;
        this.y = event.y;

        this.justUp = true;
    }

});

module.exports = Pointer;
