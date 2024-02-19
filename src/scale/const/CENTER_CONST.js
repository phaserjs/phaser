/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Phaser Scale Manager constants for centering the game canvas.
 *
 * @namespace Phaser.Scale.Center
 * @memberof Phaser.Scale
 * @since 3.16.0
 */

/**
 * Phaser Scale Manager constants for centering the game canvas.
 *
 * To find out what each mode does please see [Phaser.Scale.Center]{@link Phaser.Scale.Center}.
 *
 * @typedef {Phaser.Scale.Center} Phaser.Scale.CenterType
 * @memberof Phaser.Scale
 * @since 3.16.0
 */

module.exports = {

    /**
     * The game canvas is not centered within the parent by Phaser.
     * You can still center it yourself via CSS.
     *
     * @name Phaser.Scale.Center.NO_CENTER
     * @type {number}
     * @const
     * @since 3.16.0
     */
    NO_CENTER: 0,

    /**
     * The game canvas is centered both horizontally and vertically within the parent.
     * To do this, the parent has to have a bounds that can be calculated and not be empty.
     *
     * Centering is achieved by setting the margin left and top properties of the
     * game canvas, and does not factor in any other CSS styles you may have applied.
     *
     * @name Phaser.Scale.Center.CENTER_BOTH
     * @type {number}
     * @const
     * @since 3.16.0
     */
    CENTER_BOTH: 1,

    /**
     * The game canvas is centered horizontally within the parent.
     * To do this, the parent has to have a bounds that can be calculated and not be empty.
     *
     * Centering is achieved by setting the margin left and top properties of the
     * game canvas, and does not factor in any other CSS styles you may have applied.
     *
     * @name Phaser.Scale.Center.CENTER_HORIZONTALLY
     * @type {number}
     * @const
     * @since 3.16.0
     */
    CENTER_HORIZONTALLY: 2,

    /**
     * The game canvas is centered both vertically within the parent.
     * To do this, the parent has to have a bounds that can be calculated and not be empty.
     *
     * Centering is achieved by setting the margin left and top properties of the
     * game canvas, and does not factor in any other CSS styles you may have applied.
     *
     * @name Phaser.Scale.Center.CENTER_VERTICALLY
     * @type {number}
     * @const
     * @since 3.16.0
     */
    CENTER_VERTICALLY: 3

};
