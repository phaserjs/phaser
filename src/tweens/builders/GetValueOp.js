/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @ignore
 */
function hasGetActive (def)
{
    return (!!def.getActive && typeof def.getActive === 'function');
}

/**
 * @ignore
 */
function hasGetStart (def)
{
    return (!!def.getStart && typeof def.getStart === 'function');
}

/**
 * @ignore
 */
function hasGetEnd (def)
{
    return (!!def.getEnd && typeof def.getEnd === 'function');
}

/**
 * @ignore
 */
function hasGetters (def)
{
    return hasGetStart(def) || hasGetEnd(def) || hasGetActive(def);
}

/**
 * Returns `getActive`, `getStart` and `getEnd` functions for a TweenData based on a target property and end value.
 * 
 * `getActive` if not null, is invoked _immediately_ as soon as the TweenData is running, and is set on the target property.
 * `getEnd` is invoked once any start delays have expired and returns what the value should tween to.
 * `getStart` is invoked when the tween reaches the end and needs to either repeat or yoyo, it returns the value to go back to.
 *
 * If the end value is a number, it will be treated as an absolute value and the property will be tweened to it.
 * A string can be provided to specify a relative end value which consists of an operation
 * (`+=` to add to the current value, `-=` to subtract from the current value, `*=` to multiply the current
 * value, or `/=` to divide the current value) followed by its operand.
 * 
 * A function can be provided to allow greater control over the end value; it will receive the target
 * object being tweened, the name of the property being tweened, and the current value of the property
 * as its arguments.
 * 
 * If both the starting and the ending values need to be controlled, an object with `getStart` and `getEnd`
 * callbacks, which will receive the same arguments, can be provided instead. If an object with a `value`
 * property is provided, the property will be used as the effective value under the same rules described here.
 *
 * @function Phaser.Tweens.Builders.GetValueOp
 * @since 3.0.0
 *
 * @param {string} key - The name of the property to modify.
 * @param {*} propertyValue - The ending value of the property, as described above.
 *
 * @return {function} An array of functions, `getActive`, `getStart` and `getEnd`, which return the starting and the ending value of the property based on the provided value.
 */
var GetValueOp = function (key, propertyValue)
{
    var callbacks;

    //  The returned value sets what the property will be at the END of the Tween (usually called at the start of the Tween)
    var getEnd = function (target, key, value) { return value; };

    //  The returned value sets what the property will be at the START of the Tween (usually called at the end of the Tween)
    var getStart = function (target, key, value) { return value; };

    //  What to set the property to the moment the TweenData is invoked
    var getActive = null;

    var t = typeof(propertyValue);

    if (t === 'number')
    {
        // props: {
        //     x: 400,
        //     y: 300
        // }

        getEnd = function ()
        {
            return propertyValue;
        };
    }
    else if (t === 'string')
    {
        // props: {
        //     x: '+=400',
        //     y: '-=300',
        //     z: '*=2',
        //     w: '/=2'
        // }

        var op = propertyValue[0];
        var num = parseFloat(propertyValue.substr(2));

        switch (op)
        {
            case '+':
                getEnd = function (target, key, value)
                {
                    return value + num;
                };
                break;

            case '-':
                getEnd = function (target, key, value)
                {
                    return value - num;
                };
                break;

            case '*':
                getEnd = function (target, key, value)
                {
                    return value * num;
                };
                break;

            case '/':
                getEnd = function (target, key, value)
                {
                    return value / num;
                };
                break;

            default:
                getEnd = function ()
                {
                    return parseFloat(propertyValue);
                };
        }
    }
    else if (t === 'function')
    {
        //  The same as setting just the getEnd function and no getStart

        // props: {
        //     x: function (target, key, value, targetIndex, totalTargets, tween) { return value + 50); },
        // }

        getEnd = propertyValue;
    }
    else if (t === 'object')
    {
        if (hasGetters(propertyValue))
        {
            /*
            x: {
                //  Called the moment Tween is active. The returned value sets the property on the target immediately.
                getActive: function (target, key, value, targetIndex, totalTargets, tween)
                {
                    return value;
                },

                //  Called at the start of the Tween. The returned value sets what the property will be at the END of the Tween.
                getEnd: function (target, key, value, targetIndex, totalTargets, tween)
                {
                    return value;
                },

                //  Called at the end of the Tween. The returned value sets what the property will be at the START of the Tween.
                getStart: function (target, key, value, targetIndex, totalTargets, tween)
                {
                    return value;
                }
            }
            */

            if (hasGetActive(propertyValue))
            {
                getActive = propertyValue.getActive;
            }

            if (hasGetEnd(propertyValue))
            {
                getEnd = propertyValue.getEnd;
            }

            if (hasGetStart(propertyValue))
            {
                getStart = propertyValue.getStart;
            }
        }
        else if (propertyValue.hasOwnProperty('value'))
        {
            //  'value' may still be a string, function or a number
            // props: {
            //     x: { value: 400, ... },
            //     y: { value: 300, ... }
            // }

            callbacks = GetValueOp(key, propertyValue.value);
        }
        else
        {
            //  'from' and 'to' may still be a string, function or a number
            // props: {
            //     x: { from: 400, to: 600 },
            //     y: { from: 300, to: 500 }
            // }

            //  Same as above, but the 'start' value is set immediately on the target
            // props: {
            //     x: { start: 400, to: 600 },
            //     y: { start: 300, to: 500 }
            // }

            //  'start' value is set immediately, then it goes 'from' to 'to' during the tween
            // props: {
            //     x: { start: 200, from: 400, to: 600 },
            //     y: { start: 300, from: 300, to: 500 }
            // }

            var hasTo = propertyValue.hasOwnProperty('to');
            var hasFrom = propertyValue.hasOwnProperty('from');
            var hasStart = propertyValue.hasOwnProperty('start');

            if (hasTo && (hasFrom || hasStart))
            {
                callbacks = GetValueOp(key, propertyValue.to);

                if (hasStart)
                {
                    var startCallbacks = GetValueOp(key, propertyValue.start);
        
                    callbacks.getActive = startCallbacks.getEnd;
                }
        
                if (hasFrom)
                {
                    var fromCallbacks = GetValueOp(key, propertyValue.from);
        
                    callbacks.getStart = fromCallbacks.getEnd;
                }
            }
        }
    }

    //  If callback not set by the else if block above then set it here and return it
    if (!callbacks)
    {
        callbacks = {
            getActive: getActive,
            getEnd: getEnd,
            getStart: getStart
        };
    }

    return callbacks;
};

module.exports = GetValueOp;
