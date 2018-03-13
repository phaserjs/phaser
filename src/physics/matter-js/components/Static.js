/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Body = require('../lib/body/Body');

/**
 * [description]
 *
 * @name Phaser.Physics.Matter.Components.Static
 * @since 3.0.0
 */
var Static = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Static#setStatic
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setStatic: function (value)
    {
        Body.setStatic(this.body, value);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Static#isStatic
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    isStatic: function ()
    {
        return this.body.isStatic;
    }

};

module.exports = Static;
