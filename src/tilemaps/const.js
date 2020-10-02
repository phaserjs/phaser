/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Tilemap constants.
 *
 * @ignore
 */

var CONST = {

    /**
     * Orthogonal Tilemap orientation constant.
     *
     * @name Phaser.Tilemaps.ORTHOGONAL
     * @const
     * @type {integer}
     * @since 3.50.0
     */
    ORTHOGONAL: 0,

    /**
     * Isometric Tilemap orientation constant.
     *
     * @name Phaser.Tilemaps.ISOMETRIC
     * @const
     * @type {integer}
     * @since 3.50.0
     */
    ISOMETRIC: 1,

    /**
     * Staggered Tilemap orientation constant.
     *
     * @name Phaser.Tilemaps.STAGGERED
     * @const
     * @type {integer}
     * @since 3.50.0
     */
    STAGGERED: 2,

    /**
     * Hexagonal Tilemap orientation constant.
     *
     * @name Phaser.Tilemaps.HEXAGONAL
     * @const
     * @type {integer}
     * @since 3.50.0
     */
    HEXAGONAL: 3,

    /**
     * Get the Tilemap orientation from the given string.
     *
     * @name Phaser.Tilemaps.fromOrientationString
     * @const
     * @type {function}
     * @since 3.50.0
     */
    fromOrientationString: function (orientation)
    {
        var constor = CONST.ORTHOGONAL;

        if (orientation === 'isometric')
        {
            constor = CONST.ISOMETRIC;
        }
        else if (orientation === 'staggered')
        {
            constor = CONST.STAGGERED;
        }
        else if (orientation === 'hexagonal')
        {
            constor = CONST.HEXAGONAL;
        }
        return constor;
    }

};

module.exports = CONST;
