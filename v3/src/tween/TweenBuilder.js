var GetValue = require('../utils/object/GetValue');
var GetAdvancedValue = require('../utils/object/GetAdvancedValue');
var Tween = require('./Tween');
var RESERVED = require('./ReservedProps');
var GetEaseFunction = require('./GetEaseFunction');
var TweenData = require('./TweenData');
var TweenTarget = require('./TweenTarget');

var GetTargets = function (config, props)
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

    var out = [];

    for (var i = 0; i < targets.length; i++)
    {
        var keyData = {};

        for (var p = 0; p < props.length; p++)
        {
            keyData[props[p].key] = { start: 0, current: 0, end: 0, startCache: null, endCache: null };
        }

        out.push(TweenTarget(targets[i], keyData));
    }

    return out;
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
        //  Technically this could return a number, string or object
        // props: {
        //     x: function () { return Math.random() * 10 },
        //     y: someOtherCallback
        // }

        valueCallback = GetValueOp(key, value.call());
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

var TweenBuilder = function (manager, config)
{
    //  Create arrays of the Targets and the Properties
    var props = GetProps(config);

    //  Default Tween values
    var ease = GetEaseFunction(GetValue(config, 'ease', 'Power0'));
    var duration = GetAdvancedValue(config, 'duration', 1000);
    var yoyo = GetValue(config, 'yoyo', false);
    var yoyoDelay = GetAdvancedValue(config, 'yoyoDelay', 0);
    var repeat = GetAdvancedValue(config, 'repeat', 0);
    var repeatDelay = GetAdvancedValue(config, 'repeatDelay', 0);
    var delay = GetAdvancedValue(config, 'delay', 0);
    var startAt = GetAdvancedValue(config, 'startAt', null);

    var data = [];

    //  Loop through every property defined in the Tween, i.e.: props { x, y, alpha }
    for (var p = 0; p < props.length; p++)
    {
        var key = props[p].key;
        var value = props[p].value;

        var tweenData = TweenData(
            key,
            GetValueOp(key, value),
            GetEaseFunction(GetValue(value, 'ease', ease)),
            GetAdvancedValue(value, 'delay', delay),
            GetAdvancedValue(value, 'duration', duration),
            GetValue(value, 'yoyo', yoyo),
            GetAdvancedValue(value, 'yoyoDelay', yoyoDelay),
            GetAdvancedValue(value, 'repeat', repeat),
            GetAdvancedValue(value, 'repeatDelay', repeatDelay),
            GetAdvancedValue(value, 'startAt', startAt)
        );

        //  TODO: Calculate total duration

        data.push(tweenData);
    }

    var targets = GetTargets(config, props);

    var tween = new Tween(manager, targets, data);

    var stagger = GetAdvancedValue(config, 'stagger', 0);

    tween.useFrames = GetValue(config, 'useFrames', false);
    tween.loop = GetValue(config, 'loop', false);
    tween.loopDelay = GetAdvancedValue(config, 'loopDelay', 0);
    tween.completeDelay = GetAdvancedValue(config, 'completeDelay', 0);
    tween.startDelay = GetAdvancedValue(config, 'startDelay', 0) + (stagger * targets.length);
    tween.paused = GetValue(config, 'paused', false);

    return tween;
};

module.exports = TweenBuilder;
