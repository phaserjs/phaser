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
    var axis = GetValue(options, 'axis', null);

    var from = GetValue(options, 'from', 0);

    var fromFirst = (from === 'first');
    var fromCenter = (from === 'center');
    var fromLast = (from === 'last');
    var fromValue = (typeof(from) === 'number');

    var isRange = (Array.isArray(value));
    var value1 = (isRange) ? parseFloat(value[0]) : parseFloat(value);
    var value2 = (isRange) ? parseFloat(value[1]) : 0;
    var maxValue = Math.max(value1, value2);

    if (isRange)
    {
        start += value1;
    }

    var easeFunction = (ease) ? GetEaseFunction(ease) : null;

    //  target = The target object being tweened
    //  key = The key of the property being tweened
    //  value = The current value of that property
    //  index = The index of the target within the Tween targets array
    //  total = The total number of targets being tweened
    //  tween = A reference to the Tween performing this update

    if (grid)
    {
        result = function (target, key, value, index, total)
        {
            //  zero offset
            total--;
    
            var fromIndex;
    
            if (fromFirst)
            {
                fromIndex = 0;
            }
            else if (fromCenter)
            {
                fromIndex = Math.abs((total / 2) - index);
            }
            else if (fromLast)
            {
                fromIndex = total;
            }
            else if (fromValue)
            {
                fromIndex = Math.abs(from - index);
            }
    
            var spacing = 0;
            var output = start;
            var max = total * maxValue;
    
            var fromX = (!fromCenter) ? fromIndex % grid[0] : (grid[0] - 1) / 2;
            var fromY = (!fromCenter) ? Math.floor(fromIndex / grid[0]) : (grid[1] - 1) / 2;
    
            var toX = index % grid[0];
            var toY = Math.floor(index / grid[0]);
    
            var distanceX = fromX - toX;
            var distanceY = fromY - toY;
    
            var gridSpace = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            if (axis === 'x')
            {
                gridSpace = -distanceX;
            }
            else if (axis === 'y')
            {
                gridSpace = -distanceY;
            }
    
            if (isRange)
            {
                if (fromCenter)
                {
                    spacing += ((value2 - value1) / total) * (fromIndex * 2);
                }
                else
                {
                    spacing += ((value2 - value1) / total) * fromIndex;
                }
    
                output += spacing;
    
                output += spacing + (gridSpace * value1);
            }
            else
            {
                output += gridSpace * value1;
            }
    
            // if (easeFunction)
            // {
            //     output += (max * easeFunction(fromIndex / total));
            // }
    
            console.log('>', index, '/', total, 'fromIndex:', fromIndex, 'spacing:', spacing, 'RESULT:', output, 'from', fromX, fromY, 'to', toX, toY, 'dist', distanceX, distanceY);
    
            return output;
        };
    }
    else
    {
        result = function (target, key, value, index, total)
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
    
            var output;
        
            if (isRange)
            {
                var spacing;

                if (fromCenter)
                {
                    spacing = ((value2 - value1) / total) * (fromIndex * 2);
                }
                else
                {
                    spacing = ((value2 - value1) / total) * fromIndex;
                }
                    
                if (easeFunction)
                {
                    output = start + (spacing * easeFunction(fromIndex / total));
                }
                else
                {
                    output = start + spacing;
                }
            }
            else if (easeFunction)
            {
                output = start + ((total * maxValue) * easeFunction(fromIndex / total));
            }
            else
            {
                output = start + (fromIndex * value1);
            }
    
            console.log('>', index, '/', total, 'fromIndex:', fromIndex, 'spacing:', spacing);
            console.log('>', 'RESULT:', output);
    
            return output;
        };
    }

    return result;
};

module.exports = StaggerBuilder;
