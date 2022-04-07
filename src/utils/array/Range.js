/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetValue = require('../object/GetValue');
var Shuffle = require('./Shuffle');

var BuildChunk = function (a, b, qty)
{
    var out = [];

    for (var aIndex = 0; aIndex < a.length; aIndex++)
    {
        for (var bIndex = 0; bIndex < b.length; bIndex++)
        {
            for (var i = 0; i < qty; i++)
            {
                out.push({ a: a[aIndex], b: b[bIndex] });
            }
        }
    }

    return out;
};

/**
 * Creates an array populated with a range of values, based on the given arguments and configuration object.
 *
 * Range ([a,b,c], [1,2,3]) =
 * a1, a2, a3, b1, b2, b3, c1, c2, c3
 *
 * Range ([a,b], [1,2,3], qty = 3) =
 * a1, a1, a1, a2, a2, a2, a3, a3, a3, b1, b1, b1, b2, b2, b2, b3, b3, b3
 *
 * Range ([a,b,c], [1,2,3], repeat x1) =
 * a1, a2, a3, b1, b2, b3, c1, c2, c3, a1, a2, a3, b1, b2, b3, c1, c2, c3
 *
 * Range ([a,b], [1,2], repeat -1 = endless, max = 14) =
 * Maybe if max is set then repeat goes to -1 automatically?
 * a1, a2, b1, b2, a1, a2, b1, b2, a1, a2, b1, b2, a1, a2 (capped at 14 elements)
 *
 * Range ([a], [1,2,3,4,5], random = true) =
 * a4, a1, a5, a2, a3
 *
 * Range ([a, b], [1,2,3], random = true) =
 * b3, a2, a1, b1, a3, b2
 *
 * Range ([a, b, c], [1,2,3], randomB = true) =
 * a3, a1, a2, b2, b3, b1, c1, c3, c2
 *
 * Range ([a], [1,2,3,4,5], yoyo = true) =
 * a1, a2, a3, a4, a5, a5, a4, a3, a2, a1
 *
 * Range ([a, b], [1,2,3], yoyo = true) =
 * a1, a2, a3, b1, b2, b3, b3, b2, b1, a3, a2, a1
 *
 * @function Phaser.Utils.Array.Range
 * @since 3.0.0
 *
 * @param {array} a - The first array of range elements.
 * @param {array} b - The second array of range elements.
 * @param {object} [options] - A range configuration object. Can contain: repeat, random, randomB, yoyo, max, qty.
 *
 * @return {array} An array of arranged elements.
 */
var Range = function (a, b, options)
{
    var max = GetValue(options, 'max', 0);
    var qty = GetValue(options, 'qty', 1);
    var random = GetValue(options, 'random', false);
    var randomB = GetValue(options, 'randomB', false);
    var repeat = GetValue(options, 'repeat', 0);
    var yoyo = GetValue(options, 'yoyo', false);

    var out = [];

    if (randomB)
    {
        Shuffle(b);
    }

    //  Endless repeat, so limit by max
    if (repeat === -1)
    {
        if (max === 0)
        {
            repeat = 0;
        }
        else
        {
            //  Work out how many repeats we need
            var total = (a.length * b.length) * qty;

            if (yoyo)
            {
                total *= 2;
            }

            repeat = Math.ceil(max / total);
        }
    }

    for (var i = 0; i <= repeat; i++)
    {
        var chunk = BuildChunk(a, b, qty);

        if (random)
        {
            Shuffle(chunk);
        }

        out = out.concat(chunk);

        if (yoyo)
        {
            chunk.reverse();

            out = out.concat(chunk);
        }
    }

    if (max)
    {
        out.splice(max);
    }

    return out;
};

module.exports = Range;
