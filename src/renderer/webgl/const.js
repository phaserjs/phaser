/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var WEBGL_CONST = {

    /**
     * 	8-bit twos complement signed integer.
     *
     * @name Phaser.Renderer.WebGL.BYTE
     * @type {Phaser.Types.Renderer.WebGL.WebGLConst}
     * @since 3.50.0
     */
    BYTE: { enum: 0x1400, size: 1 },

    /**
     * 8-bit twos complement unsigned integer.
     *
     * @name Phaser.Renderer.WebGL.UNSIGNED_BYTE
     * @type {Phaser.Types.Renderer.WebGL.WebGLConst}
     * @since 3.50.0
     */
    UNSIGNED_BYTE: { enum: 0x1401, size: 1 },

    /**
     * 16-bit twos complement signed integer.
     *
     * @name Phaser.Renderer.WebGL.SHORT
     * @type {Phaser.Types.Renderer.WebGL.WebGLConst}
     * @since 3.50.0
     */
    SHORT: { enum: 0x1402, size: 2 },

    /**
     * 16-bit twos complement unsigned integer.
     *
     * @name Phaser.Renderer.WebGL.UNSIGNED_SHORT
     * @type {Phaser.Types.Renderer.WebGL.WebGLConst}
     * @since 3.50.0
     */
    UNSIGNED_SHORT: { enum: 0x1403, size: 2 },

    /**
     * 32-bit twos complement signed integer.
     *
     * @name Phaser.Renderer.WebGL.INT
     * @type {Phaser.Types.Renderer.WebGL.WebGLConst}
     * @since 3.50.0
     */
    INT: { enum: 0x1404, size: 4 },

    /**
     * 32-bit twos complement unsigned integer.
     *
     * @name Phaser.Renderer.WebGL.UNSIGNED_INT
     * @type {Phaser.Types.Renderer.WebGL.WebGLConst}
     * @since 3.50.0
     */
    UNSIGNED_INT: { enum: 0x1405, size: 4 },

    /**
     * 32-bit IEEE floating point number.
     *
     * @name Phaser.Renderer.WebGL.FLOAT
     * @type {Phaser.Types.Renderer.WebGL.WebGLConst}
     * @since 3.50.0
     */
    FLOAT: { enum: 0x1406, size: 4 }

};

module.exports = WEBGL_CONST;
