/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetEaseFunction = require('./GetEaseFunction');
var GetValue = require('../../utils/object/GetValue');

/**
 * Creates a Stagger function.
 *
 * @function Phaser.Tweens.Builders.StaggerBuilder
 * @since 3.19.0
 *
 * @param {Phaser.Types.Tweens.StaggerBuilderConfig} config - Configuration for the new Tween.
 *
 * @return {function} The new tween.
 */
var StaggerBuilder = function (value, options)
{
    if (options === undefined) { options = {}; }

    var result;

    var start = GetValue(options, 'start', 0);
    var ease = GetValue(options, 'ease', null);
    var grid = GetValue(options, 'grid', null);

    var from = GetValue(options, 'from', 0);

    //  delay: this.tweens.stagger(100) // increase delay by 100ms for each elements.
    //  delay: this.tweens.stagger(100, {start: 500}) // delay starts at 500ms then increase by 100ms for each elements.
    //  delay: this.tweens.stagger(100, {from: 'center'}) (first, default, last, center, index)
    //  delay: this.tweens.stagger([ 500, 1000 ]) // distributes evenly values between two numbers.

    var fromFirst = (from === 'first');
    var fromCenter = (from === 'center');
    var fromLast = (from === 'last');
    var fromValue = (typeof(from) === 'number');

    var isRange = (Array.isArray(value));
    var value1 = (isRange) ? parseFloat(value[0]) : parseFloat(value);
    var value2 = (isRange) ? parseFloat(value[1]) : 0;
    var maxValue = Math.max(value1, value2);

    var easeFunction = (ease) ? GetEaseFunction(ease) : null;

    if (!grid)
    {
        //  target = The target object being tweened
        //  key = The key of the property being tweened
        //  value = The current value of that property
        //  index = The index of the target within the Tween targets array
        //  total = The total number of targets being tweened
        //  tween = A reference to the Tween performing this update
        result = function (target, key, value, index, total, tween)
        {
            //  zero offset
            total--;

            var fromIndex;

            if (fromFirst)
            {
                fromIndex = index;
            }
            else if (fromCenter)
            {
                fromIndex = Math.abs((total / 2) - index);
            }
            else if (fromLast)
            {
                fromIndex = total - index;
            }
            else if (fromValue)
            {
                fromIndex = Math.abs(from - index);
            }

            var output = start;
            var max = total * maxValue;
            var spacing = value1;

            if (isRange)
            {
                spacing += ((value2 - value1) / total) * fromIndex;
            }

            if (easeFunction)
            {
                output += (max * easeFunction(fromIndex / total));
            }
            else
            {
                output += (isRange) ? spacing : (fromIndex * value1);
            }

            console.log('i', index, 'of', total, 'fromIndex:', fromIndex, 'spacing:', spacing, 'result: ', output);

            return output;
        };
    }
    else
    {
    }

    return result;
};

module.exports = StaggerBuilder;
