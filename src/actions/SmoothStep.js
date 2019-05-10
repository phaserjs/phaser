/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var MathSmoothStep = require('../math/SmoothStep');

/**
 * Smoothstep is a sigmoid-like interpolation and clamping function.
 * 
 * The function depends on three parameters, the input x, the "left edge" and the "right edge", with the left edge being assumed smaller than the right edge. The function receives a real number x as an argument and returns 0 if x is less than or equal to the left edge, 1 if x is greater than or equal to the right edge, and smoothly interpolates, using a Hermite polynomial, between 0 and 1 otherwise. The slope of the smoothstep function is zero at both edges. This is convenient for creating a sequence of transitions using smoothstep to interpolate each segment as an alternative to using more sophisticated or expensive interpolation techniques.
 *
 * @function Phaser.Actions.SmoothStep
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {string} property - The property of the Game Object to interpolate.
 * @param {number} min - The minimum interpolation value.
 * @param {number} max - The maximum interpolation value.
 * @param {boolean} [inc=false] - Should the values be incremented? `true` or set (`false`)
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var SmoothStep = function (items, property, min, max, inc)
{
    if (inc === undefined) { inc = false; }

    var step = Math.abs(max - min) / items.length;
    var i;

    if (inc)
    {
        for (i = 0; i < items.length; i++)
        {
            items[i][property] += MathSmoothStep(i * step, min, max);
        }
    }
    else
    {
        for (i = 0; i < items.length; i++)
        {
            items[i][property] = MathSmoothStep(i * step, min, max);
        }
    }

    return items;
};

module.exports = SmoothStep;
