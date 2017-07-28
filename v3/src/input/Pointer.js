//  Phaser.Input.Pointer

var Class = require('../utils/Class');

//  DOM event button value:
// A number representing a given button:
// 0: Main button pressed, usually the left button or the un-initialized state
// 1: Auxiliary button pressed, usually the wheel button or the middle button (if present)
// 2: Secondary button pressed, usually the right button
// 3: Fourth button, typically the Browser Back button
// 4: Fifth button, typically the Browser Forward button
// For a mouse configured for left-handed use, the button actions are reversed. In this case, the values are read from right to left.

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

        //  Coordinates and time of the pointer when Button 1 (left button), or Touch, was pressed, used for dragging objects
        this.downX = 0;
        this.downY = 0;
        this.downTime = 0;

        //  Coordinates and time of the pointer when Button 1 (left button), or Touch, was released, used for dragging objects
        this.upX = 0;
        this.upY = 0;
        this.upTime = 0;

        //  Is the primary button down? (usually button 0, the left mouse button)
        this.primaryDown = false;

        //  0 = Not dragging anything
        //  1 = Being checked if dragging
        //  2 = Dragging something
        this.dragState = 0;

        //  Is *any* button on this pointer considered as being down?
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

    touchmove: function (event, time)
    {
        this.event = event;

        this.x = this.manager.transformX(event.changedTouches[0].pageX);
        this.y = this.manager.transformY(event.changedTouches[0].pageY);

        this.justMoved = true;

        this.dirty = true;
    },

    move: function (event, time)
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

    down: function (event, time)
    {
        if (event.buttons)
        {
            this.buttons = event.buttons;
        }

        this.event = event;

        this.x = this.manager.transformX(event.pageX);
        this.y = this.manager.transformY(event.pageY);

        //  0: Main button pressed, usually the left button or the un-initialized state
        if (event.button === 0)
        {
            this.primaryDown = true;
            this.downX = this.x;
            this.downY = this.y;
            this.downTime = time;
        }

        this.justDown = true;
        this.isDown = true;

        this.dirty = true;
    },

    touchstart: function (event, time)
    {
        this.buttons = 1;

        this.event = event;

        this.x = this.manager.transformX(event.changedTouches[0].pageX);
        this.y = this.manager.transformY(event.changedTouches[0].pageY);

        this.primaryDown = true;
        this.downX = this.x;
        this.downY = this.y;
        this.downTime = time;

        this.justDown = true;
        this.isDown = true;

        this.dirty = true;
    },

    up: function (event, time)
    {
        if (event.buttons)
        {
            this.buttons = event.buttons;
        }

        this.event = event;

        this.x = this.manager.transformX(event.pageX);
        this.y = this.manager.transformY(event.pageY);

        //  0: Main button pressed, usually the left button or the un-initialized state
        if (event.button === 0)
        {
            this.primaryDown = false;
            this.upX = this.x;
            this.upY = this.y;
            this.upTime = time;
        }

        this.justUp = true;
        this.isDown = false;

        this.dirty = true;
    },

    touchend: function (event, time)
    {
        this.buttons = 0;

        this.event = event;

        this.x = this.manager.transformX(event.changedTouches[0].pageX);
        this.y = this.manager.transformY(event.changedTouches[0].pageY);

        this.primaryDown = false;
        this.upX = this.x;
        this.upY = this.y;
        this.upTime = time;

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
