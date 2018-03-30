/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

function hasGetStart (def)
{
    return (!!def.getStart && typeof def.getStart === 'function');
}

function hasGetEnd (def)
{
    return (!!def.getEnd && typeof def.getEnd === 'function');
}

function hasGetters (def)
{
    return hasGetStart(def) || hasGetEnd(def);
}

/**
 * [description]
 *
 * @function Phaser.Tweens.Builders.GetValueOp
 * @since 3.0.0
 *
 * @param {string} key - [description]
 * @param {*} propertyValue - [description]
 *
 * @return {function} [description]
 */
var GetValueOp = function (key, propertyValue)
{
    var callbacks;

    //  The returned value sets what the property will be at the END of the Tween (usually called at the start of the Tween)
    var getEnd = function (target, key, value) { return value; };

    //  The returned value sets what the property will be at the START of the Tween (usually called at the end of the Tween)
    var getStart = function (target, key, value) { return value; };

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
        //     x: function (target, key, value) { return value + 50); },
        // }

        getEnd = propertyValue;
    }
    else if (t === 'object' && hasGetters(propertyValue))
    {
        /*
        x: {
            //  Called at the start of the Tween. The returned value sets what the property will be at the END of the Tween.
            getEnd: function (target, key, value)
            {
                return value;
            },

            //  Called at the end of the Tween. The returned value sets what the property will be at the START of the Tween.
            getStart: function (target, key, value)
            {
                return value;
            }
        }
        */

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
        //  Value may still be a string, function or a number
        // props: {
        //     x: { value: 400, ... },
        //     y: { value: 300, ... }
        // }

        callbacks = GetValueOp(key, propertyValue.value);
    }

    //  If callback not set by the else if block above then set it here and return it
    if (!callbacks)
    {
        callbacks = {
            getEnd: getEnd,
            getStart: getStart
        };
    }

    return callbacks;
};

module.exports = GetValueOp;
