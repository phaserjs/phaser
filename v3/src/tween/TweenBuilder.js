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

var GetValueOp = function (target, key, value)
{
    var valueCallback;

    if (typeof value === 'number')
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
    else if (typeof value === 'string')
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
                valueCallback = function ()
                {
                    return target[key] + num;
                };
                break;

            case '-':
                valueCallback = function ()
                {
                    return target[key] - num;
                };
                break;

            case '*':
                valueCallback = function ()
                {
                    return target[key] * num;
                };
                break;

            case '/':
                valueCallback = function ()
                {
                    return target[key] / num;
                };
                break;

            default:
                valueCallback = function ()
                {
                    return parseFloat(value);
                };
        }
    }
    else if (typeof value === 'function')
    {
        //  Technically this could return a number, string or object
        // props: {
        //     x: function () { return Math.random() * 10 },
        //     y: someOtherCallback
        // }

        valueCallback = GetValueOp(target, key, value.call());
    }
    else if (value.hasOwnProperty('value'))
    {
        //  Value may still be a string, function or a number
        // props: {
        //     x: { value: 400, ... },
        //     y: { value: 300, ... }
        // }

        valueCallback = GetValueOp(target, key, value.value);
    }

    return valueCallback;
};

var TweenBuilder = function (manager, config)
{
    //  Create arrays of the Targets and the Properties
    var targets = GetTargets(config);
    var props = GetProps(config);
    var tweens = [];

    //  Default Tween values
    var defaultEase = GetEaseFunction(GetValue(config, 'ease', 'Power0'));
    var defaultDuration = GetAdvancedValue(config, 'duration', 1000);
    var defaultYoyo = GetValue(config, 'yoyo', false);
    var defaultRepeat = GetAdvancedValue(config, 'repeat', 0);
    var defaultRepeatDelay = GetAdvancedValue(config, 'repeatDelay', 0);
    var defaultCompleteDelay = GetAdvancedValue(config, 'completeDelay', 0);
    var defaultLoop = GetValue(config, 'loop', false);
    var defaultDelay = GetAdvancedValue(config, 'delay', 0);

    for (var p = 0; p < props.length; p++)
    {
        //  Get Tween value + op
        var key = props[p].key;
        var values = props[p].value;
        var prev = null;

        if (!Array.isArray(values))
        {
            values = [ values ];
        }

        for (var t = 0; t < targets.length; t++)
        {
            var target = targets[t];

            var tween = new Tween(manager, targets[t], key);

            //  Set Tween properties (TODO: Callbacks)

            tween.completeDelay = GetAdvancedValue(value, 'completeDelay', defaultCompleteDelay);
            tween.loop = GetValue(value, 'loop', defaultLoop);

            //  Build the TweenData
            for (var i = 0; i < values.length; i++)
            {
                var value = values[i];

                //  Set TweenData properties
                var valueOp = GetValueOp(target, key, value);

                var ease = GetEaseFunction(GetValue(value, 'ease', defaultEase));
                var duration = GetAdvancedValue(value, 'duration', defaultDuration);
                var yoyo = GetValue(value, 'yoyo', defaultYoyo);
                var repeat = GetAdvancedValue(value, 'repeat', defaultRepeat);
                var repeatDelay = GetAdvancedValue(value, 'repeatDelay', defaultRepeatDelay);
                var delay = GetAdvancedValue(value, 'delay', defaultDelay);

                var tweenData = TweenData(valueOp, ease, duration, yoyo, repeat, delay, repeatDelay);

                tweenData.prev = prev;

                if (prev)
                {
                    prev.next = tweenData;
                }

                tween.data.push(tweenData);

                prev = tweenData;
            }

            tween.current = tween.data[0];

            tweens.push(tween);

            manager.queue(tween);
        }
    }

    return tweens;
};

module.exports = TweenBuilder;

/*
    The following are all the same

    var tween = this.tweens.add({
        targets: player,
        x: 200,
        duration: 2000,
        ease: 'Power1',
        yoyo: true
    });

    var tween = this.tweens.add({
        targets: player,
        props: {
            x: 200
        }
        duration: 2000,
        ease: 'Power1',
        yoyo: true
    });

    var tween = this.tweens.add({
        targets: player,
        x: { value: 200, duration: 2000, ease: 'Power1', yoyo: true }
    });

    var tween = this.tweens.add({
        targets: player,
        props: {
            x: { value: 200, duration: 2000, ease: 'Power1', yoyo: true }
        }
    });

    //  Chained property tweens:
    //  Each tween uses the same duration and ease because they've been 'globally' defined, except the middle one,
    //  which uses its own duration as it overrides the global one

    var tween = this.tweens.add({
        targets: player,
        x: [ { value: 200 }, { value: 300, duration: 50 }, { value: 400 } ],
        duration: 2000,
        ease: 'Power1',
        yoyo: true
    });

    //  Multiple property tweens:

    var tween = this.tweens.add({
        targets: player,
        x: { value: 400, duration: 2000, ease: 'Power1' },
        y: { value: 300, duration: 1000, ease: 'Sine' }
    });

    var tween = this.tweens.add({
        targets: player,
        props: {
            x: { value: 400, duration: 2000, ease: 'Power1' },
            y: { value: 300, duration: 1000, ease: 'Sine' }
        }
    });

    //  Multiple Targets + Multiple property tweens:

    var tween = this.tweens.add({
        targets: [ alien1, alien2, alien3, alienBoss ],
        props: {
            x: { value: 400, duration: 2000 },
            y: { value: 300, duration: 1000 }
        },
        ease: 'Sine'
    });

    //  Multiple Targets + Multiple properties + Multi-state Property tweens:

    var tween = this.tweens.add({
        targets: [ alien1, alien2, alien3, alienBoss ],
        props: {
            x: [ { value: 200, duration: 100 }, { value: 300, duration: 50 }, { value: 400 } ],
            y: { value: 300, duration: 1000 }
        },
        ease: 'Sine'
    });

    //  Multi-value Tween Property with static values

    var tween = this.tweens.add({
        targets: [ alien1, alien2, alien3, alienBoss ],
        props: {
            x: [ 200, 300, 400 ],
            y: [ '+100', '-100', '+100' ]
        },
        duration: 1000,
        ease: 'Sine'
    });
    
    //  Timeline concept

    var tween = this.tweens.add({
        targets: player,
        timeline: [
            { x: 400 },
            { y: 400 },
            { x: 100 },
            { y: 100 }
        ],
        duration: 1000,
        ease: 'Sine'
    });

 */
