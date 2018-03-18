/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var TYPE = require('../TYPE');

/**
 * [description]
 *
 * @name Phaser.Physics.Impact.Components.CheckAgainst
 * @since 3.0.0
 */
var CheckAgainst = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.CheckAgainst#setAvsB
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setAvsB: function ()
    {
        this.setTypeA();

        return this.setCheckAgainstB();
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.CheckAgainst#setBvsA
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setBvsA: function ()
    {
        this.setTypeB();

        return this.setCheckAgainstA();
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.CheckAgainst#setCheckAgainstNone
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setCheckAgainstNone: function ()
    {
        this.body.checkAgainst = TYPE.NONE;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.CheckAgainst#setCheckAgainstA
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setCheckAgainstA: function ()
    {
        this.body.checkAgainst = TYPE.A;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.CheckAgainst#setCheckAgainstB
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setCheckAgainstB: function ()
    {
        this.body.checkAgainst = TYPE.B;

        return this;
    },

    /**
     * [description]
     *
     * @name Phaser.Physics.Impact.Components.CheckAgainst#checkAgainst
     * @type {number}
     * @since 3.0.0
     */
    checkAgainst: {

        get: function ()
        {
            return this.body.checkAgainst;
        },

        set: function (value)
        {
            this.body.checkAgainst = value;
        }

    }

};

module.exports = CheckAgainst;
