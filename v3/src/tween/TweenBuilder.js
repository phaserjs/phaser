var GetValue = require('../utils/object/GetValue');
var GetAdvancedValue = require('../utils/object/GetAdvancedValue');
var Tween = require('./Tween');
var RESERVED = require('./ReservedProps');
var GetEaseFunction = require('./GetEaseFunction');
var TweenData = require('./TweenData');

var GetTargets = function (config)
{
    var targets = GetValue(config, 'targets', null);

    if (typeof targets === 'function')
    {
        targets = targets.call();
    }

    if (!Array.isArray(targets))
    {
        targets = [ targets ];
    }

    return targets;
};

var GetProps = function (config)
{
    var key;
    var keys = [];

    //  First see if we have a props object

    if (config.hasOwnProperty('props'))
    {
        for (key in config.props)
        {
            keys.push({ key: key, value: config.props[key] });
        }
    }
    else
    {
        for (key in config)
        {
            if (RESERVED.indexOf(key) === -1)
            {
                keys.push({ key: key, value: config[key] });
            }
        }
    }

    return keys;
};

var GetValueOp = function (key, value)
{
    var valueCallback;
    var t = typeof(value);

    if (t === 'number')
    {
        // props: {
        //     x: 400,
        //     y: 300
        // }

        valueCallback = function ()
        {
            return value;
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

        var op = value[0];
        var num = parseFloat(value.substr(2));

        switch (op)
        {
            case '+':
                valueCallback = function (i)
                {
                    return i + num;
                };
                break;

            case '-':
                valueCallback = function (i)
                {
                    return i - num;
                };
                break;

            case '*':
                valueCallback = function (i)
                {
                    return i * num;
                };
                break;

            case '/':
                valueCallback = function (i)
                {
                    return i / num;
                };
                break;

            default:
                valueCallback = function ()
                {
                    return parseFloat(value);
                };
        }
    }
    else if (t === 'function')
    {
        // props: {
        //     x: function (startValue, target, index, totalTargets) { return startValue + (index * 50); },
        // }

        valueCallback = function (startValue, target, index, total)
        {
            return value(startValue, target, index, total);
        };
    }
    else if (value.hasOwnProperty('value'))
    {
        //  Value may still be a string, function or a number
        // props: {
        //     x: { value: 400, ... },
        //     y: { value: 300, ... }
        // }

        valueCallback = GetValueOp(key, value.value);
    }

    return valueCallback;
};

var GetBoolean = function (source, key, defaultValue)
{
    if (!source)
    {
        return defaultValue;
    }
    else if (source.hasOwnProperty(key))
    {
        return source[key];
    }
    else
    {
        return defaultValue;
    }
};

var GetNewValue = function (source, key, defaultValue)
{
    var valueCallback;

    if (source.hasOwnProperty(key))
    {
        var t = typeof(source[key]);

        if (t === 'function')
        {
            valueCallback = function (index, totalTargets, target)
            {
                return source[key](index, totalTargets, target);
            };
        }
        else
        {
            valueCallback = function ()
            {
                return source[key];
            };
        }
    }
    else if (typeof defaultValue === 'function')
    {
        valueCallback = defaultValue;
    }
    else
    {
        valueCallback = function ()
        {
            return defaultValue;
        };
    }

    return valueCallback;
};

var TweenBuilder = function (manager, config)
{
    //  Create arrays of the Targets and the Properties
    var targets = GetTargets(config);
    var props = GetProps(config);

    //  Default Tween values
    var easeParams = GetValue(config, 'easeParams', null);
    var ease = GetEaseFunction(GetValue(config, 'ease', 'Power0'), easeParams);
    var duration = GetNewValue(config, 'duration', 1000);
    var yoyo = GetBoolean(config, 'yoyo', false);
    var hold = GetNewValue(config, 'hold', 0);
    var repeat = GetNewValue(config, 'repeat', 0);
    var repeatDelay = GetNewValue(config, 'repeatDelay', 0);
    var delay = GetNewValue(config, 'delay', 0);
    var startAt = GetNewValue(config, 'startAt', null);

    var data = [];

    //  Loop through every property defined in the Tween, i.e.: props { x, y, alpha }
    for (var p = 0; p < props.length; p++)
    {
        var key = props[p].key;
        var value = props[p].value;

        for (var t = 0; t < targets.length; t++)
        {
            //  Swap for faster getters, if they want Advanced Value style things, they can do it via their own functions
            var tweenData = TweenData(
                targets[t],
                key,
                GetValueOp(key, value),
                GetEaseFunction(GetValue(value, 'ease', ease), easeParams),
                GetNewValue(value, 'delay', delay),
                GetNewValue(value, 'duration', duration),
                GetBoolean(value, 'yoyo', yoyo),
                GetNewValue(value, 'hold', hold),
                GetNewValue(value, 'repeat', repeat),
                GetNewValue(value, 'repeatDelay', repeatDelay),
                GetNewValue(value, 'startAt', startAt)
            );

            //  TODO: Calculate total duration

            data.push(tweenData);
        }
    }

    var tween = new Tween(manager, data);

    tween.totalTargets = targets.length;
    tween.useFrames = GetBoolean(config, 'useFrames', false);
    tween.loop = GetBoolean(config, 'loop', false);
    tween.loopDelay = GetAdvancedValue(config, 'loopDelay', 0);
    tween.completeDelay = GetAdvancedValue(config, 'completeDelay', 0);
    tween.startDelay = GetAdvancedValue(config, 'startDelay', 0);
    tween.paused = GetBoolean(config, 'paused', false);

    return tween;
};

module.exports = TweenBuilder;
