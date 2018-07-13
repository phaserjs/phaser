/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var FLIPPED_HORIZONTAL: number;
declare var FLIPPED_VERTICAL: number;
declare var FLIPPED_ANTI_DIAGONAL: number;
/**
 * See Tiled documentation on tile flipping:
 * http://docs.mapeditor.org/en/latest/reference/tmx-map-format/
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.ParseGID
 * @since 3.0.0
 *
 * @param {number} gid - [description]
 *
 * @return {object} [description]
 */
declare var ParseGID: (gid: any) => {
    gid: any;
    flippedHorizontal: boolean;
    flippedVertical: boolean;
    flippedAntiDiagonal: boolean;
    rotation: number;
    flipped: boolean;
};
