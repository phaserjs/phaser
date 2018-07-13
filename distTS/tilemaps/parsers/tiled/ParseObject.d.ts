/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Pick: any;
declare var ParseGID: (gid: any) => {
    gid: any;
    flippedHorizontal: boolean;
    flippedVertical: boolean;
    flippedAntiDiagonal: boolean;
    rotation: number;
    flipped: boolean;
};
declare var copyPoints: (p: any) => {
    x: any;
    y: any;
};
declare var commonObjectProps: string[];
/**
 * [description]
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.ParseObject
 * @since 3.0.0
 *
 * @param {object} tiledObject - [description]
 * @param {number} [offsetX=0] - [description]
 * @param {number} [offsetY=0] - [description]
 *
 * @return {object} [description]
 */
declare var ParseObject: (tiledObject: any, offsetX: any, offsetY: any) => any;
