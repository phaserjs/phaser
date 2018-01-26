var Class = require('../../utils/Class');

var Point = new Class({

    initialize:

    /**
     * [description]
     *
     * @class Point
     * @memberOf Phaser.Geom
     * @constructor
     * @since 3.0.0
     *
     * @param {number} [x] - [description]
     * @param {number} [y] - [description]
     */
    function Point (x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = x; }

        /**
         * [description]
         *
         * @property {number} x
         * @since 3.0.0
         */
        this.x = x;

        /**
         * [description]
         *
         * @property {number} y
         * @since 3.0.0
         */
        this.y = y;
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Point#setTo
     * @since 3.0.0
     *
     * @param {[type]} x - [description]
     * @param {[type]} y - [description]
     *
     * @return {[type]} [description]
     */
    setTo: function (x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = x; }

        this.x = x;
        this.y = y;

        return this;
    }

});

module.exports = Point;
