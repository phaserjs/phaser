/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var TYPE = require('../TYPE');

/**
 * [description]
 *
 * @name Phaser.Physics.Impact.Components.BodyType
 * @since 3.0.0
 */
var BodyType = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.BodyType#getBodyType
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    getBodyType: function ()
    {
        return this.body.type;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.BodyType#setTypeNone
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    setTypeNone: function ()
    {
        this.body.type = TYPE.NONE;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.BodyType#setTypeA
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    setTypeA: function ()
    {
        this.body.type = TYPE.A;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.BodyType#setTypeB
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    setTypeB: function ()
    {
        this.body.type = TYPE.B;

        return this;
    }

};

module.exports = BodyType;
