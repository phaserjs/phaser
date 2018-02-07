var Class = require('../../utils/Class');

/**
 * @classdesc
 * [description]
 *
 * @class Button
 * @memberOf Phaser.Input.Gamepad
 * @constructor
 * @since 3.0.0
 *
 * @param {[type]} pad - [description]
 * @param {integer} index - [description]
 */
var Button = new Class({

    initialize:

    function Button (pad, index)
    {
        /**
         * [description]
         *
         * @property {[type]} pad
         * @since 3.0.0
         */
        this.pad = pad;

        /**
         * [description]
         *
         * @property {[type]} events
         * @since 3.0.0
         */
        this.events = pad.events;

        /**
         * [description]
         *
         * @property {integer} index
         * @since 3.0.0
         */
        this.index = index;

        /**
         * Between 0 and 1.
         *
         * @property {float} value
         * @default 0
         * @since 3.0.0
         */
        this.value = 0;

        /**
         * Can be set for Analogue buttons to enable a 'pressure' threshold before considered as 'pressed'.
         *
         * @property {float} threshold
         * @default 0
         * @since 3.0.0
         */
        this.threshold = 0;

        /**
         * Is the Button being pressed down or not?
         *
         * @property {boolean} pressed
         * @default false
         * @since 3.0.0
         */
        this.pressed = false;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Gamepad.Button#update
     * @since 3.0.0
     *
     * @param {[type]} data - [description]
     */
    update: function (data)
    {
        this.value = data.value;

        if (this.value >= this.threshold)
        {
            if (!this.pressed)
            {
                this.pressed = true;
                this.events.emit('down', this.pad, this, this.value, data);
            }
        }
        else if (this.pressed)
        {
            this.pressed = false;
            this.events.emit('up', this.pad, this, this.value, data);
        }
    }

});

module.exports = Button;
