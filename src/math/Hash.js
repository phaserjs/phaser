/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
*/

var Vector2 = require('./Vector2');
var Vector3 = require('./Vector3');
var Vector4 = require('./Vector4');

/**
 * Hash a number or list of numbers.
 *
 * A hash is an unpredictable transformation of an input,
 * which always returns the same output from the same input.
 * It is useful for generating random data in a predictable way.
 *
 * For example, you could use a hash to place objects around a scene.
 * Given the same inputs, the objects would always appear in the same places,
 * even though those places appear random.
 *
 * This function takes 1-4 numbers as input, and returns a single number from 0-1.
 *
 * Disclaimer: This function is intended for efficiently generating visual
 * variety. It is not intended for cryptographic use. Do not use it for
 * security/authentication/encryption purposes. Use a proper tool instead.
 *
 * Performance note: A 16ms frame has enough time to generate
 * tens or hundreds of thousands of hash values, depending on system and other activity.
 *
 * You can select from different hashing algorithms.
 *
 * - 0: TRIG. This uses sine functions and dot products to hash the input.
 * - 1: PCG. This uses a permuted congruential generator to hash the input,
 *   but is restricted to integer inputs.
 * - 2: PCG_FLOAT. This variant of PCG accepts float inputs.
 *
 * TRIG is the same algorithm used in Phaser 4's Noise object and relatives.
 * It produces decent variety, and accepts any number as input.
 * Its precision is 32 bits.
 * Its input values may lose distinction if larger than 32 bits (4294967296).
 * Its output values cannot differ by more than 1/4294967296.
 * This algorithm is designed to work on graphics hardware that lacks
 * bitshifting capabilities, and is not state of the art.
 *
 * PCG is a Permuted Congruential Generator.
 * See https://www.pcg-random.org/ for more information on the theory.
 * This algorithm is more modern and considered higher quality.
 * It runs slightly faster than TRIG.
 * It only accepts whole numbers (integers) as input.
 * Its precision is 32 bits.
 * Its input values may lose distinction if larger than 32 bits (4294967296).
 * Its output values cannot differ by more than 1/4294967296.
 *
 * PCG_FLOAT works just like PCG, but accepts floating-point inputs.
 * This conversion process causes it to run slightly slower than TRIG.
 * The same precision concerns apply.
 *
 * If your hash values start clustering, you may be using values
 * outside the safe range, where bits available for precision are insufficient.
 * You can keep values in a safe range by sampling along circular paths.
 * This is why it's useful to have several dimensions of input.
 *
 * @example
 * // Given a `time` value:
 * var output = Phaser.Math.Hash([Math.cos(time), Math.sin(time)]);
 *
 * @function Phaser.Math.Hash
 * @since 4.0.0
 *
 * @param {number|number[]} vector - The number or number list to hash. 1 to 4 numbers.
 * @param {number} [algorithm=0] - The algorithm to use. 0 is TRIG. 1 is PCG. 2 is PCG_FLOAT.
 *
 * @return {number} - A number from 0-1.
 */
var Hash = function (vector, algorithm)
{
    if (typeof vector === 'number') { vector = [ vector ]; }

    switch (algorithm)
    {
        case 2:
        {
            // PCG with float inputs
            return pcg(vector, true);
        }
        case 1:
        {
            // PCG
            return pcg(vector);
        }
        case 0:
        default:
        {
            // Trig: same as shader hash function.
            return trig(vector);
        }
    }
};

var vec2 = new Vector2();
var vec3 = new Vector3();
var vec4 = new Vector4();

var trig1 = 12.9898;
var trig2 = new Vector2(12.9898, 78.233);
var trig3 = new Vector3(12.9898, 78.233, 9441.8953);
var trig4 = new Vector4(12.9898, 78.233, 9441.8953, 61.99);

var trig = function (vector)
{
    var x;
    switch (vector.length)
    {
        case 4:
        {
            vec4.set(vector[0], vector[1], vector[2], vector[3]);
            x = 43757.5453 * Math.sin(vec4.dot(trig4));
            break;
        }
        case 3:
        {
            vec3.set(vector[0], vector[1], vector[2]);
            x = 43757.5453 * Math.sin(vec3.dot(trig3));
            break;
        }
        case 2:
        {
            vec2.set(vector[0], vector[1]);
            x = 43757.5453 * Math.sin(vec2.dot(trig2));
            break;
        }
        case 1:
        default:
        {
            x = 43757.5453 * Math.sin(vector[0] * trig1);
            break;
        }
    }
    return x - Math.floor(x);
};

var twoE32 = Math.pow(2, 32);

var pcg = function (vector, convertFloat)
{
    // Combine vector.
    var a;
    switch (vector.length)
    {
        case 4:
        {
            a = vector[0] * 19 + vector[1] * 47 + vector[2] * 101 + vector[3] * 173;
            break;
        }
        case 3:
        {
            a = vector[0] * 19 + vector[1] * 47 + vector[2] * 101;
            break;
        }
        case 2:
        {
            a = vector[0] * 19 + vector[1] * 47;
            break;
        }
        case 1:
        default:
        {
            a = vector[0] * 19;
            break;
        }
    }

    // Expand floating-point numbers into the 32-bit range.
    if (convertFloat)
    {
        a = a * Math.pow(2, 32 - Math.floor(Math.log2(a)));
    }

    // Perform all math as unsigned 32-bit using >>>.
    var state = (a >>> 0) * 747796405 + 2891336453;
    var word = ((state >>> ((state >>> 28) + 4)) ^ state) * 277803737;
    var x = ((word >>> 22) ^ word) >>> 0;
    x /= twoE32;
    return x;
};

module.exports = Hash;
