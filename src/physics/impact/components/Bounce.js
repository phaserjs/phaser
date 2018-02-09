/**
 * [description]
 *
 * @name Phaser.Physics.Impact.Components.Bounce
 * @since 3.0.0
 */
var Bounce = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Bounce#setBounce
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setBounce: function (value)
    {
        this.body.bounciness = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Bounce#setMinBounceVelocity
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setMinBounceVelocity: function (value)
    {
        this.body.minBounceVelocity = value;

        return this;
    },

    /**
     * [description]
     *
     * @name Phaser.Physics.Impact.Components.Bounce#bounce
     * @type {[type]}
     * @since 3.0.0
     */
    bounce: {

        get: function ()
        {
            return this.body.bounciness;
        },

        set: function (value)
        {
            this.body.bounciness = value;
        }

    }

};

module.exports = Bounce;
