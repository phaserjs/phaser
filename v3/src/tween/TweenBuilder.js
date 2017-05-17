var GetValue = require('../utils/object/GetValue');
var GetAdvancedValue = require('../utils/object/GetAdvancedValue');
var Tween = require('./Tween');
var RESERVED = require('./ReservedProps');
var GetEaseFunction = require('./GetEaseFunction');

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
        //     x: '+400',
        //     y: '-300',
        //     z: '*2',
        //     w: '/2'
        // }

        var op = value[0];
        var num = parseFloat(value.substr(1));

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
    var ease = GetEaseFunction(GetValue(config, 'ease', 'Power0'));
    var duration = GetAdvancedValue(config, 'duration', 1000);
    var yoyo = GetValue(config, 'yoyo', false);
    var repeat = GetAdvancedValue(config, 'repeat', 0);
    var repeatDelay = GetAdvancedValue(config, 'repeatDelay', 0);
    var loop = GetValue(config, 'loop', false);
    var delay = GetAdvancedValue(config, 'delay', 0);

    // var onCompleteDelay = 0;
    // var elasticity = 0;

    for (var p = 0; p < props.length; p++)
    {
        //  Get Tween value + op
        var key = props[p].key;
        var value = props[p].value;

        var iEase = GetEaseFunction(GetValue(value, 'ease', ease));
        var iDuration = GetAdvancedValue(value, 'duration', duration);
        var iYoyo = GetValue(value, 'yoyo', yoyo);
        var iRepeat = GetAdvancedValue(value, 'repeat', repeat);
        var iRepeatDelay = GetAdvancedValue(value, 'repeatDelay', repeatDelay);
        var iLoop = GetValue(value, 'loop', loop);
        var iDelay = GetAdvancedValue(value, 'delay', delay);

        for (var t = 0; t < targets.length; t++)
        {
            var target = targets[t];
            var valueOp = GetValueOp(target, key, value);

            var tween = new Tween(manager, targets[t], key, valueOp);

            //  Set all the other properties ...
            tween.ease = iEase;
            tween.duration = iDuration;
            tween.yoyo = iYoyo;
            tween.repeat = iRepeat;
            tween.repeatDelay = iRepeatDelay;
            tween.loop = iLoop;
            tween.delay = iDelay;

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
