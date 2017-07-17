//  Phaser.Input.Pointer

var Class = require('../utils/Class');

var Pointer = new Class({

    initialize:

    function Pointer (manager)
    {
        this.manager = manager;

        this.button = 0;

        this.x = 0;
        this.y = 0;

        this.clientX = 0;
        this.clientY = 0;

        this.pageX = 0;
        this.pageY = 0;

        this.screenX = 0;
        this.screenY = 0;

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
        if (event.button !== undefined)
        {
            this.button = event.button;
        }

        this.clientX = event.clientX;
        this.clientY = event.clientY;

        this.pageX = event.pageX;
        this.pageY = event.pageY;

        this.screenX = event.screenX;
        this.screenY = event.screenY;

        this.x = this.manager.transformX(event.pageX);
        this.y = this.manager.transformY(event.pageY);

        this.dirty = true;
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
