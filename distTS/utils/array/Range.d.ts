/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var GetValue: any;
declare var Shuffle: (items: any) => any;
declare var BuildChunk: (a: any, b: any, qty: any) => any[];
/**
 * [description]
 *
 * @function Phaser.Utils.Array.Range
 * @since 3.0.0
 *
 * @param {array} a - [description]
 * @param {array} b - [description]
 * @param {object} options - [description]
 *
 * @return {array} [description]
 */
declare var Range: {
    new (): Range;
    prototype: Range;
    readonly END_TO_END: number;
    readonly END_TO_START: number;
    readonly START_TO_END: number;
    readonly START_TO_START: number;
};
