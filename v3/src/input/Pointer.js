//  Phaser.Input.Pointer

var Class = require('../utils/Class');

var Pointer = new Class({

    initialize:

    function Pointer (manager)
    {
        this.manager = manager;

        this.x = 0;
        this.y = 0;
        this.hasMoved = false;

        this.isDown = false;
    },

    update: function (event)
    {
        this.x = event.x;
        this.y = event.y;
        this.hasMoved = true;
    }

});

module.exports = Pointer;
