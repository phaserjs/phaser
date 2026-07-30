var Hash = require('./Hash');

/**
 * Hash a number or list of numbers to a cellular noise value.
 *
 * A hash is an unpredictable transformation of an input,
 * which always returns the same output from the same input.
 * It is useful for generating random data in a predictable way.
 *
 * Cellular noise uses hashes to distort a grid, creating distinctive 'cells'
 * in a continuous pattern. While the result is still effectively random,
 * it is continuous: very similar inputs produce very similar outputs
 * (although there may be some minor discontinuities between cells).
 * The result has a distinctive bumpy pattern.
 * This is the algorithm used in the NoiseCell2D family of GameObjects.
 * It is sometimes called Worley or Voronoi noise.
 *
 * For example, you could use cellular noise to create a series of ridges
 * across a procedural terrain. Every time you generate the same region,
 * it will look the same.
 *
 * This function takes 1-4 numbers as input, and returns a single number.
 * The range of the return number increases with the number of inputs.
 * It is the distance from the input vector to the nearest distorted cell
 * center. In higher dimensions, the possible distance is higher.
 *
 * Note: If you specify dimensional properties in the config parameter,
 * ensure they are at least as long as the input vector.
 * Missing values can corrupt the result.
 *
 * Disclaimer: This function is intended for efficiently generating visual
 * variety. It is not intended for cryptographic use. Do not use it for
 * security/authentication/encryption purposes. Use a proper tool instead.
 *
 * Performance note: A 16ms frame has enough time to generate
 * a few hundred hash values, depending on device and workload.
 *
 * See {@link Phaser.Math.Hash} for more information on the hashing algorithms.
 *
 * @function Phaser.Math.HashCell
 * @since 4.0.0
 *
 * @param {number|number[]} vector - The input vector to hash. 1 to 4 numbers.
 * @param {Phaser.Types.Math.HashCellConfig} [config] - The configuration of the noise cell field.
 *
 * @return {number} The hashed cellular noise value. The range increases with the number of input dimensions, as it represents the distance to the nearest distorted cell center.
 */
var HashCell = function (vector, config)
{
    if (typeof vector === 'number') { vector = [ vector ]; }
    if (!config) { config = {}; }

    var value = 0;
    var iterations = config.noiseIterations || 1;

    for (var iteration = 0; iteration < iterations; iteration++)
    {
        var scale = Math.pow(2, iteration);
        value += (worley(vector, config, scale) - 0.5) / scale;
    }

    return value + 0.5;
};

var defaultSeed = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
var point = Array(4);
var frac = Array(4);
var neighbor = Array(4);
var cell = Array(4);
var jit = Array(4);
var diff = Array(4);

var worley = function (vector, config, scale)
{
    var i, jit, d, index;
    var mode = config.noiseMode || 0;
    var smoothing = config.noiseSmoothing === undefined ? 1 : config.noiseSmoothing;

    // Normalize vector to unit grid.
    var axes = Math.max(1, Math.min(vector.length, 4));
    var cells = config.noiseCells || [ 32, 32, 32, 32 ].slice(0, axes);
    for (i = 0; i < axes; i++)
    {
        var c = vector[i] * scale * cells[i];
        point[i] = Math.floor(c);
        frac[i] = c % 1;
    }

    var value = 0;
    var random = 0;

    if (mode === 0 || mode === 1)
    {
        value = 4 * axes;
    }

    var neighbors = Math.pow(3, axes);
    for (index = 0; index < neighbors; index++)
    {
        // Generate neighbourhood in range -1,1 on relevant axes.
        neighbor[0] = index % 3 - 1;
        if (axes > 1)
        {
            neighbor[1] = Math.floor(index / 3) % 3 - 1;
            if (axes > 2)
            {
                neighbor[2] = Math.floor(index / 9) % 3 - 1;
                if (axes > 3)
                {
                    neighbor[3] = Math.floor(index / 27) % 3 - 1;
                }
            }
        }

        jit = jitter(
            axes,
            point,
            neighbor,
            config,
            scale
        );
        d = distSquared(
            axes,
            neighbor,
            frac,
            jit
        );
        switch (mode)
        {
            case 0:
            {
                if (d < value) { value = d; }
                break;
            }
            case 1:
            {
                if (d < value)
                {
                    value = d;
                    random = jit[0];
                }
                break;
            }
            case 2:
            {
                d = Math.sqrt(d);
                value += Math.pow(2, -32 / smoothing * d);
                break;
            }
        }
    }

    if (mode === 0)
    {
        return Math.sqrt(value);
    }
    if (mode === 1)
    {
        return random;
    }
    return -(1 / 32 * smoothing) * Math.log2(value);
};

var jitter = function (axes, point, neighbor, config, scale)
{
    var i, j;
    var wrap = config.noiseWrap ? config.noiseWrap : config.noiseCells || [ 32, 32, 32, 32 ];
    var seed = config.noiseSeed ? config.noiseSeed : defaultSeed;
    for (i = 0; i < axes; i++)
    {
        cell[i] = (point[i] + neighbor[i]) % (wrap[i] * scale);
    }
    for (i = 0; i < axes; i++)
    {
        var vec = Array(axes);
        for (j = 0; j < axes; j++)
        {
            vec[j] = cell[j] + seed[i * axes + j];
        }
        jit[i] = Hash(vec, config.algorithm);
    }
    return jit;
};

var distSquared = function (axes, neighbor, frac, jitter)
{
    var i;
    for (i = 0; i < axes; i++)
    {
        diff[i] = neighbor[i] - frac[i] + jitter[i];
    }
    var d = 0;
    for (i = 0; i < axes; i++)
    {
        d += diff[i] * diff[i];
    }
    return d;
};

module.exports = HashCell;
