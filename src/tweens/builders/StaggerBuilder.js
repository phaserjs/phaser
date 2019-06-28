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

    var fromFirst = (from === 'first');
    var fromCenter = (from === 'center');
    var fromLast = (from === 'last');
    var fromValue = (typeof(from) === 'number');

    var easeFunction = (ease) ? GetEaseFunction(ease) : null;

    if (!grid)
    {
        result = function (index, total)
        {
            if (total > 0)
            {
                //  zero offset
                total--;
            }

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

            if (easeFunction)
            {
                output += ((total * value) * easeFunction(fromIndex / total));
            }
            else
            {
                output += (fromIndex * value);
            }

            console.log('i', index, 'of', total, 'fromIndex:', fromIndex, 'result: ', output);

            return output;
        };
    }
    else
    {
    }

    /*
    if (from === 'first')
    {
        return function (index)
        {
            return start + (index * value);
        };
    }
    else if (from === 'last')
    {
        return function (index, total)
        {
            return start + ((total - index) * value);
        };
    }
    else if (from === 'center')
    {
        return function (index, total)
        {
            return start + ((Math.abs(index - total / 2) * value));
        };

    }
    else if (typeof(from) === 'number')
    {
        return function (index)
        {
            return start + ((Math.abs(from - index) * value));
        };
    }

    if (ease)
    {
        var easeFunction = GetEaseFunction(ease);

        return function (index, total)
        {
            var max = total * value;

            return start + (max * easeFunction(index / total));
        };
    }
    */

    return result;
};

module.exports = StaggerBuilder;
