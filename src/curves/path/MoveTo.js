var Class = require('../../utils/Class');
var Vector2 = require('../../math/Vector2');

/**
 * @classdesc
 * [description]
 *
 * @class MoveTo
 * @memberOf Phaser.Curves
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [x] - [description]
 * @param {number} [y] - [description]
 */
var MoveTo = new Class({

    initialize:

    function MoveTo (x, y)
    {
        //  Skip length calcs in paths

        /**
         * [description]
         *
         * @property {boolean} active
         * @default false
         * @since 3.0.0
         */
        this.active = false;

        this.p0 = new Vector2(x, y);
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.MoveTo#getPoint
     * @since 3.0.0
     *
     * @param {[type]} t - [description]
     * @param {[type]} out - [description]
     *
     * @return {[type]} [description]
     */
    getPoint: function (t, out)
    {
        if (out === undefined) { out = new Vector2(); }

        return out.copy(this.p0);
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.MoveTo#getPointAt
     * @since 3.0.0
     *
     * @param {[type]} u - [description]
     * @param {[type]} out - [description]
     *
     * @return {[type]} [description]
     */
    getPointAt: function (u, out)
    {
        return this.getPoint(u, out);
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.MoveTo#getResolution
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    getResolution: function ()
    {
        return 1;
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.MoveTo#getLength
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    getLength: function ()
    {
        return 0;
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.MoveTo#toJSON
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    toJSON: function ()
    {
        return {
            type: 'MoveTo',
            points: [
                this.p0.x, this.p0.y
            ]
        };
    }

});

module.exports = MoveTo;
