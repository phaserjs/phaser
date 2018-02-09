/**
 * [description]
 *
 * @name Phaser.Physics.Matter.Components.Bounce
 * @since 3.0.0
 */
var Bounce = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Bounce#setBounce
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setBounce: function (value)
    {
        this.body.restitution = value;

        return this;
    }

};

module.exports = Bounce;
