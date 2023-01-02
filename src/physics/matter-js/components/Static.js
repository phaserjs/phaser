/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Body = require('../lib/body/Body');

/**
 * Provides methods used for getting and setting the static state of a physics body.
 *
 * @namespace Phaser.Physics.Matter.Components.Static
 * @since 3.0.0
 */
var Static = {

    /**
     * Changes the physics body to be either static `true` or dynamic `false`.
     *
     * @method Phaser.Physics.Matter.Components.Static#setStatic
     * @since 3.0.0
     *
     * @param {boolean} value - `true` to set the body as being static, or `false` to make it dynamic.
     *
     * @return {this} This Game Object instance.
     */
    setStatic: function (value)
    {
        Body.setStatic(this.body, value);

        return this;
    },

    /**
     * Returns `true` if the body is static, otherwise `false` for a dynamic body.
     *
     * @method Phaser.Physics.Matter.Components.Static#isStatic
     * @since 3.0.0
     *
     * @return {boolean} `true` if the body is static, otherwise `false`.
     */
    isStatic: function ()
    {
        return this.body.isStatic;
    }

};

module.exports = Static;
