//  Phaser.Input.InteractiveObject

var Class = require('../utils/Class');

var InteractiveObject = new Class({

    initialize:

    function InteractiveObject (gameObject, hitArea, hitAreaCallback)
    {
        this.gameObject = gameObject;

        this.enabled = true;
        this.draggable = false;

        this.hitArea = hitArea;
        this.hitAreaCallback = hitAreaCallback;

        this.localX = 0;
        this.localY = 0;

        // this.dragX = 0;
        // this.dragY = 0;

        // this.callbackContext = gameObject;

        // onDragStart: NOOP,
        // onDrag: NOOP,
        // onDragEnd: NOOP
    },

    onUp: function ()
    {
        //  Empty by default. Override via setCallback.
    },

    onDown: function ()
    {
        //  Empty by default. Override via setCallback.
    },

    onOver: function ()
    {
        //  Empty by default. Override via setCallback.
    },

    onOut: function ()
    {
        //  Empty by default. Override via setCallback.
    },

    onMove: function ()
    {
        //  Empty by default. Override via setCallback.
    },

    destroy: function ()
    {
        this.gameObject = undefined;
        this.hitArea = undefined;
        this.hitAreaCallback = undefined;
    }

});

module.exports = InteractiveObject;
