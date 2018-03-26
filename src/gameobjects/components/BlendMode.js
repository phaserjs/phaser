/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var BlendModes = require('../../renderer/BlendModes');

/**
 * Provides methods used for setting the blend mode of a Game Object.
 * Should be applied as a mixin and not used directly.
 *
 * @name Phaser.GameObjects.Components.BlendMode
 * @since 3.0.0
 */

var BlendMode = {

    _blendMode: BlendModes.NORMAL,

    /**
     * Sets the Blend Mode being used by this Game Object.
     *
     * This can be a const, such as `Phaser.BlendModes.SCREEN`, or an integer, such as 4 (for Overlay)
     *
     * Under WebGL only the following Blend Modes are available:
     *
     * * ADD
     * * MULTIPLY
     * * SCREEN
     *
     * Canvas has more available depending on browser support.
     *
     * You can also create your own custom Blend Modes in WebGL.
     *
     * Blend modes have different effects under Canvas and WebGL, and from browser to browser, depending
     * on support. Blend Modes also cause a WebGL batch flush should it encounter a new blend mode. For these
     * reasons try to be careful about the construction of your Scene and the frequency of which blend modes
     * are used.
     *
     * @name Phaser.GameObjects.Components.BlendMode#blendMode
     * @type {(integer|string)}
     * @since 3.0.0
     */
    blendMode: {

        get: function ()
        {
            return this._blendMode;
        },

        set: function (value)
        {
            if (typeof value === 'string')
            {
                value = BlendModes[value];
            }

            value |= 0;

            if (value >= 0)
            {
                this._blendMode = value;
            }
        }

    },

    /**
     * Sets the Blend Mode being used by this Game Object.
     *
     * This can be a const, such as `Phaser.BlendModes.SCREEN`, or an integer, such as 4 (for Overlay)
     *
     * Under WebGL only the following Blend Modes are available:
     *
     * * ADD
     * * MULTIPLY
     * * SCREEN
     *
     * Canvas has more available depending on browser support.
     *
     * You can also create your own custom Blend Modes in WebGL.
     *
     * Blend modes have different effects under Canvas and WebGL, and from browser to browser, depending
     * on support. Blend Modes also cause a WebGL batch flush should it encounter a new blend mode. For these
     * reasons try to be careful about the construction of your Scene and the frequency of which blend modes
     * are used.
     *
     * @method Phaser.GameObjects.Components.BlendMode#setBlendMode
     * @since 3.0.0
     *
     * @param {(string|integer)} value - The BlendMode value. Either a string or a CONST.
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object instance.
     */
    setBlendMode: function (value)
    {
        this.blendMode = value;

        return this;
    }

};

module.exports = BlendMode;
