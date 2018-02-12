/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @name Phaser.Physics.Impact.Components.Debug
 * @since 3.0.0
 */
var Debug = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Debug#setDebug
     * @since 3.0.0
     *
     * @param {[type]} showBody - [description]
     * @param {[type]} showVelocity - [description]
     * @param {[type]} bodyColor - [description]
     *
     * @return {[type]} [description]
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
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
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
     * @type {[type]}
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
     * @type {[type]}
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
     * @type {[type]}
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
