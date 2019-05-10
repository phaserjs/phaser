/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Impact Debug component.
 * Should be applied as a mixin.
 *
 * @namespace Phaser.Physics.Impact.Components.Debug
 * @since 3.0.0
 */
var Debug = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Debug#setDebug
     * @since 3.0.0
     *
     * @param {boolean} showBody - [description]
     * @param {boolean} showVelocity - [description]
     * @param {number} bodyColor - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setDebug: function (showBody, showVelocity, bodyColor)
    {
        this.debugShowBody = showBody;
        this.debugShowVelocity = showVelocity;
        this.debugBodyColor = bodyColor;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Debug#setDebugBodyColor
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setDebugBodyColor: function (value)
    {
        this.body.debugBodyColor = value;

        return this;
    },

    /**
     * [description]
     *
     * @name Phaser.Physics.Impact.Components.Debug#debugShowBody
     * @type {boolean}
     * @since 3.0.0
     */
    debugShowBody: {

        get: function ()
        {
            return this.body.debugShowBody;
        },

        set: function (value)
        {
            this.body.debugShowBody = value;
        }

    },

    /**
     * [description]
     *
     * @name Phaser.Physics.Impact.Components.Debug#debugShowVelocity
     * @type {boolean}
     * @since 3.0.0
     */
    debugShowVelocity: {

        get: function ()
        {
            return this.body.debugShowVelocity;
        },

        set: function (value)
        {
            this.body.debugShowVelocity = value;
        }

    },

    /**
     * [description]
     *
     * @name Phaser.Physics.Impact.Components.Debug#debugBodyColor
     * @type {number}
     * @since 3.0.0
     */
    debugBodyColor: {

        get: function ()
        {
            return this.body.debugBodyColor;
        },

        set: function (value)
        {
            this.body.debugBodyColor = value;
        }

    }

};

module.exports = Debug;
