//  Phaser.Input.Pointer

var Class = require('../utils/Class');

var Pointer = new Class({

    initialize:

    function Pointer (manager, id)
    {
        this.manager = manager;

        this.id = id;

        this.event;

        // 0  : No button or un-initialized
        // 1  : Left button
        // 2  : Right button
        // 4  : Wheel button or middle button
        // 8  : 4th button (typically the "Browser Back" button)
        // 16 : 5th button (typically the "Browser Forward" button)
        this.buttons = 0;

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
        this.buttons = 0;

        this.dirty = false;
        this.isDown = false;
        this.justDown = false;
        this.justUp = false;
        this.justMoved = false;
    },

    move: function (event)
    {
        if (event.buttons)
        {
            this.buttons = event.buttons;
        }

        this.event = event;

        this.x = this.manager.transformX(event.pageX);
        this.y = this.manager.transformY(event.pageY);

        this.justMoved = true;

        this.dirty = true;
    },

    down: function (event)
    {
        if (event.buttons)
        {
            this.buttons = event.buttons;
        }

        this.event = event;

        this.x = this.manager.transformX(event.pageX);
        this.y = this.manager.transformY(event.pageY);

        this.justDown = true;
        this.isDown = true;

        this.dirty = true;
    },

    up: function (event)
    {
        if (event.buttons)
        {
            this.buttons = event.buttons;
        }

        this.event = event;

        this.x = this.manager.transformX(event.pageX);
        this.y = this.manager.transformY(event.pageY);

        this.justUp = true;
        this.isDown = false;

        this.dirty = true;
    },

    noButtonDown: function ()
    {
        return (this.buttons === 0);
    },

    leftButtonDown: function ()
    {
        return (this.buttons & 1);
    },

    rightButtonDown: function ()
    {
        return (this.buttons & 2);
    },

    middleButtonDown: function ()
    {
        return (this.buttons & 4);
    },

    backButtonDown: function ()
    {
        return (this.buttons & 8);
    },

    forwardButtonDown: function ()
    {
        return (this.buttons & 16);
    }

});

module.exports = Pointer;
