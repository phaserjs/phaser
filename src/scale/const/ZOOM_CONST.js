/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Phaser Scale Manager constants for zoom modes.
 * 
 * @namespace Phaser.Scale.Zoom
 * @memberof Phaser.Scale
 * @since 3.16.0
 */

/**
 * Phaser Scale Manager constants for zoom modes.
 * 
 * To find out what each mode does please see [Phaser.Scale.Zoom]{@link Phaser.Scale.Zoom}.
 * 
 * @typedef {(Phaser.Scale.Zoom.NO_ZOOM|Phaser.Scale.Zoom.ZOOM_2X|Phaser.Scale.Zoom.ZOOM_4X|Phaser.Scale.Zoom.MAX_ZOOM)} Phaser.Scale.ZoomType
 * @memberof Phaser.Scale
 * @since 3.16.0
 */

module.exports = {

    /**
     * The game canvas will not be zoomed by Phaser.
     * 
     * @name Phaser.Scale.Zoom.NO_ZOOM
     * @since 3.16.0
     */
    NO_ZOOM: 1,

    /**
     * The game canvas will be 2x zoomed by Phaser.
     * 
     * @name Phaser.Scale.Zoom.ZOOM_2X
     * @since 3.16.0
     */
    ZOOM_2X: 2,

    /**
     * The game canvas will be 4x zoomed by Phaser.
     * 
     * @name Phaser.Scale.Zoom.ZOOM_4X
     * @since 3.16.0
     */
    ZOOM_4X: 4,

    /**
     * Calculate the zoom value based on the maximum multiplied game size that will
     * fit into the parent, or browser window if no parent is set.
     * 
     * @name Phaser.Scale.Zoom.MAX_ZOOM
     * @since 3.16.0
     */
    MAX_ZOOM: -1

};
