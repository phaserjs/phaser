/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Base64Decode: (data: any) => any[];
declare var GetFastValue: any;
declare var LayerData: any;
declare var ParseGID: (gid: any) => {
    gid: any;
    flippedHorizontal: boolean;
    flippedVertical: boolean;
    flippedAntiDiagonal: boolean;
    rotation: number;
    flipped: boolean;
};
declare var Tile: any;
/**
 * [description]
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.ParseTileLayers
 * @since 3.0.0
 *
 * @param {object} json - [description]
 * @param {boolean} insertNull - [description]
 *
 * @return {array} [description]
 */
declare var ParseTileLayers: (json: any, insertNull: any) => any[];
