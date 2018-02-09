/**
 * [description]
 *
 * @name Phaser.Physics.Arcade.Components.Immovable
 * @since 3.0.0
 */
var Immovable = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Immovable#setImmovable
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setImmovable: function (value)
    {
        if (value === undefined) { value = true; }

        this.body.immovable = value;

        return this;
    }

};

module.exports = Immovable;
