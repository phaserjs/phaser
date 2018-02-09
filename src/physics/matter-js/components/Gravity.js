/**
 * [description]
 *
 * @name Phaser.Physics.Matter.Components.Gravity
 * @since 3.0.0
 */
var Gravity = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Gravity#setIgnoreGravity
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setIgnoreGravity: function (value)
    {
        this.body.ignoreGravity = value;

        return this;
    }

};

module.exports = Gravity;
