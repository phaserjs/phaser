var Defaults = require('../tween/Defaults');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var GetBoolean = require('./GetBoolean');
var GetEaseFunction = require('./GetEaseFunction');
var GetNewValue = require('./GetNewValue');
var GetProps = require('./GetProps');
var GetTargets = require('./GetTargets');
var GetValue = require('../../utils/object/GetValue');
var GetValueOp = require('./GetValueOp');
var Tween = require('../tween/Tween');
var TweenData = require('../tween/TweenData');

var TweenBuilder = function (manager, config, defaults)
{
    if (defaults === undefined)
    {
        defaults = Defaults;
    }

    //  Create arrays of the Targets and the Properties
    var targets = (defaults.targets) ? defaults.targets : GetTargets(config);

    // var props = (defaults.props) ? defaults.props : GetProps(config);
    var props = GetProps(config);

    //  Default Tween values
    var delay = GetNewValue(config, 'delay', defaults.delay);
    var duration = GetNewValue(config, 'duration', defaults.duration);
    var easeParams = GetValue(config, 'easeParams', defaults.easeParams);
    var ease = GetEaseFunction(GetValue(config, 'ease', defaults.ease), easeParams);
    var hold = GetNewValue(config, 'hold', defaults.hold);
    var repeat = GetNewValue(config, 'repeat', defaults.repeat);
    var repeatDelay = GetNewValue(config, 'repeatDelay', defaults.repeatDelay);
    var startAt = GetNewValue(config, 'startAt', defaults.startAt);
    var yoyo = GetBoolean(config, 'yoyo', defaults.yoyo);
    var flipX = GetBoolean(config, 'flipX', defaults.flipX);
    var flipY = GetBoolean(config, 'flipY', defaults.flipY);

    var data = [];

    //  Loop through every property defined in the Tween, i.e.: props { x, y, alpha }
    for (var p = 0; p < props.length; p++)
    {
        var key = props[p].key;
        var value = props[p].value;

        //  Create 1 TweenData per target, per property
        for (var t = 0; t < targets.length; t++)
        {
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
                GetNewValue(value, 'startAt', startAt),
                GetBoolean(value, 'flipX', flipX),
                GetBoolean(value, 'flipY', flipY)
            );

            data.push(tweenData);
        }
    }

    var tween = new Tween(manager, data);

    tween.totalTargets = targets.length;

    tween.offset = GetAdvancedValue(config, 'offset', null);
    tween.completeDelay = GetAdvancedValue(config, 'completeDelay', 0);
    tween.loop = GetAdvancedValue(config, 'loop', 0);
    tween.loopDelay = GetAdvancedValue(config, 'loopDelay', 0);
    tween.paused = GetBoolean(config, 'paused', false);
    tween.useFrames = GetBoolean(config, 'useFrames', false);

    //  Callbacks

    var scope = GetValue(config, 'callbackScope', tween);

    var tweenArray = [ tween ];

    var onStart = GetValue(config, 'onStart', false);

    //  The Start of the Tween
    if (onStart)
    {
        var onStartScope = GetValue(config, 'onStartScope', scope);
        var onStartParams = GetValue(config, 'onStartParams', []);

        tween.setCallback('onStart', onStart, tweenArray.concat(onStartParams), onStartScope);
    }

    var onUpdate = GetValue(config, 'onUpdate', false);

    //  Every time the tween updates (regardless which TweenDatas are running)
    if (onUpdate)
    {
        var onUpdateScope = GetValue(config, 'onUpdateScope', scope);
        var onUpdateParams = GetValue(config, 'onUpdateParams', []);

        tween.setCallback('onUpdate', onUpdate, tweenArray.concat(onUpdateParams), onUpdateScope);
    }

    var onRepeat = GetValue(config, 'onRepeat', false);

    //  When a TweenData repeats
    if (onRepeat)
    {
        var onRepeatScope = GetValue(config, 'onRepeatScope', scope);
        var onRepeatParams = GetValue(config, 'onRepeatParams', []);

        tween.setCallback('onRepeat', onRepeat, tweenArray.concat(null, onRepeatParams), onRepeatScope);
    }

    var onLoop = GetValue(config, 'onLoop', false);

    //  Called when the whole Tween loops
    if (onLoop)
    {
        var onLoopScope = GetValue(config, 'onLoopScope', scope);
        var onLoopParams = GetValue(config, 'onLoopParams', []);

        tween.setCallback('onLoop', onLoop, tweenArray.concat(onLoopParams), onLoopScope);
    }

    var onYoyo = GetValue(config, 'onYoyo', false);

    //  Called when a TweenData yoyos
    if (onYoyo)
    {
        var onYoyoScope = GetValue(config, 'onYoyoScope', scope);
        var onYoyoParams = GetValue(config, 'onYoyoParams', []);

        tween.setCallback('onYoyo', onYoyo, tweenArray.concat(null, onYoyoParams), onYoyoScope);
    }

    var onComplete = GetValue(config, 'onComplete', false);

    //  Called when the Tween completes, after the completeDelay, etc.
    if (onComplete)
    {
        var onCompleteScope = GetValue(config, 'onCompleteScope', scope);
        var onCompleteParams = GetValue(config, 'onCompleteParams', []);

        tween.setCallback('onComplete', onComplete, tweenArray.concat(onCompleteParams), onCompleteScope);
    }

    return tween;
};

module.exports = TweenBuilder;
