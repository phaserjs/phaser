//  Phaser.Input.Pointer

var Class = require('../utils/Class');

var Pointer = new Class({

    initialize:

    function Pointer (manager)
    {
        this.manager = manager;

        this.event;

        this.button = 0;

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
        if (event.button !== undefined)
        {
            this.button = event.button;
        }

        this.event = event;

        this.x = this.manager.transformX(event.pageX);
        this.y = this.manager.transformY(event.pageY);

        this.dirty = true;

        this.justMoved = true;
    },

    down: function (event)
    {
        if (event.button !== undefined)
        {
            this.button = event.button;
        }

        this.event = event;

        this.x = this.manager.transformX(event.pageX);
        this.y = this.manager.transformY(event.pageY);

        this.dirty = true;

        this.justDown = true;
    },

    up: function (event)
    {
        if (event.button !== undefined)
        {
            this.button = event.button;
        }

        this.event = event;

        this.x = this.manager.transformX(event.pageX);
        this.y = this.manager.transformY(event.pageY);

        this.dirty = true;

        this.justUp = true;
    }

});

module.exports = Pointer;
