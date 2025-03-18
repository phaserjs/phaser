/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetEaseFunction = require('./GetEaseFunction');
var GetValue = require('../../utils/object/GetValue');
var MATH_CONST = require('../../math/const');

/**
 * Creates a Stagger function to be used by a Tween property.
 *
 * The stagger function will allow you to stagger changes to the value of the property across all targets of the tween.
 *
 * This is only worth using if the tween has multiple targets.
 *
 * The following will stagger the delay by 100ms across all targets of the tween, causing them to scale down to 0.2
 * over the duration specified:
 *
 * ```javascript
 * this.tweens.add({
 *     targets: [ ... ],
 *     scale: 0.2,
 *     ease: 'linear',
 *     duration: 1000,
 *     delay: this.tweens.stagger(100)
 * });
 * ```
 *
 * The following will stagger the delay by 500ms across all targets of the tween using a 10 x 6 grid, staggering
 * from the center out, using a cubic ease.
 *
 * ```javascript
 * this.tweens.add({
 *     targets: [ ... ],
 *     scale: 0.2,
 *     ease: 'linear',
 *     duration: 1000,
 *     delay: this.tweens.stagger(500, { grid: [ 10, 6 ], from: 'center', ease: 'cubic.out' })
 * });
 * ```
 *
 * @function Phaser.Tweens.Builders.StaggerBuilder
 * @since 3.19.0
 *
 * @param {(number|number[])} value - The amount to stagger by, or an array containing two elements representing the min and max values to stagger between.
 * @param {Phaser.Types.Tweens.StaggerConfig} [config] - A Stagger Configuration object.
 *
 * @return {function} The stagger function.
 */
var StaggerBuilder = function (value, options)
{
    if (options === undefined) { options = {}; }

    var result;

    var start = GetValue(options, 'start', 0);
    var ease = GetValue(options, 'ease', null);
    var grid = GetValue(options, 'grid', null);

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

    if (grid)
    {
        //  Pre-calc the grid to save doing it for every TweenData update
        var gridWidth = grid[0];
        var gridHeight = grid[1];

        var fromX = 0;
        var fromY = 0;

        var distanceX = 0;
        var distanceY = 0;

        var gridValues = [];

        if (fromLast)
        {
            fromX = gridWidth - 1;
            fromY = gridHeight - 1;
        }
        else if (fromValue)
        {
            fromX = from % gridWidth;
            fromY = Math.floor(from / gridWidth);
        }
        else if (fromCenter)
        {
            fromX = (gridWidth - 1) / 2;
            fromY = (gridHeight - 1) / 2;
        }

        var gridMax = MATH_CONST.MIN_SAFE_INTEGER;

        for (var toY = 0; toY < gridHeight; toY++)
        {
            gridValues[toY] = [];

            for (var toX = 0; toX < gridWidth; toX++)
            {
                distanceX = fromX - toX;
                distanceY = fromY - toY;

                var dist = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

                if (dist > gridMax)
                {
                    gridMax = dist;
                }

                gridValues[toY][toX] = dist;
            }
        }
    }

    var easeFunction = (ease) ? GetEaseFunction(ease) : null;

    if (grid)
    {
        result = function (target, key, value, index)
        {
            var gridSpace = 0;
            var toX = index % gridWidth;
            var toY = Math.floor(index / gridWidth);

            if (toX >= 0 && toX < gridWidth && toY >= 0 && toY < gridHeight)
            {
                gridSpace = gridValues[toY][toX];
            }

            var output;

            if (isRange)
            {
                var diff = (value2 - value1);

                if (easeFunction)
                {
                    output = ((gridSpace / gridMax) * diff) * easeFunction(gridSpace / gridMax);
                }
                else
                {
                    output = (gridSpace / gridMax) * diff;
                }
            }
            else if (easeFunction)
            {
                output = (gridSpace * value1) * easeFunction(gridSpace / gridMax);
            }
            else
            {
                output = gridSpace * value1;
            }

            return output + start;
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
                    output = spacing * easeFunction(fromIndex / total);
                }
                else
                {
                    output = spacing;
                }
            }
            else if (easeFunction)
            {
                output = (total * maxValue) * easeFunction(fromIndex / total);
            }
            else
            {
                output = fromIndex * value1;
            }

            return output + start;
        };
    }

    return result;
};

module.exports = StaggerBuilder;
