/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
/**
 * @typedef {object} SinCosTable
 *
 * @property {number} sin - The sine value.
 * @property {number} cos - The cosine value.
 * @property {number} length - The length.
 */
/**
 * Generate a series of sine and cosine values.
 *
 * @function Phaser.Math.SinCosTableGenerator
 * @since 3.0.0
 *
 * @param {number} length - The number of values to generate.
 * @param {number} [sinAmp=1] - The sine value amplitude.
 * @param {number} [cosAmp=1] - The cosine value amplitude.
 * @param {number} [frequency=1] - The frequency of the values.
 *
 * @return {SinCosTable} The generated values.
 */
declare var SinCosTableGenerator: (length: any, sinAmp: any, cosAmp: any, frequency: any) => {
    sin: any[];
    cos: any[];
    length: any;
};
