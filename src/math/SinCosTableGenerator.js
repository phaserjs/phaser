/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
 * @return {Phaser.Types.Math.SinCosTable} The generated values.
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
