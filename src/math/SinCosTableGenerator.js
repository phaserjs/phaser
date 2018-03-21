/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @typedef {object} SinCosTable
 *
 * @property {number} sin - [description]
 * @property {number} cos - [description]
 * @property {number} length - [description]
 */

/**
 * [description]
 *
 * @function Phaser.Math.SinCosTableGenerator
 * @since 3.0.0
 *
 * @param {number} length - [description]
 * @param {number} sinAmp - [description]
 * @param {number} cosAmp - [description]
 * @param {number} frequency - [description]
 *
 * @return {SinCosTable} [description]
 */
var SinCosTableGenerator = function (length, sinAmp, cosAmp, frequency)
{
    if (sinAmp === undefined) { sinAmp = 1; }
    if (cosAmp === undefined) { cosAmp = 1; }
    if (frequency === undefined) { frequency = 1; }

    frequency *= Math.PI / length;

    var cos = [];
    var sin = [];

    for (var c = 0; c < length; c++)
    {
        cosAmp -= sinAmp * frequency;
        sinAmp += cosAmp * frequency;

        cos[c] = cosAmp;
        sin[c] = sinAmp;
    }

    return {
        sin: sin,
        cos: cos,
        length: length
    };
};

module.exports = SinCosTableGenerator;
