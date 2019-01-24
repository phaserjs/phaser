/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Clone = require('../../utils/object/Clone');
var Defaults = require('../tween/Defaults');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var GetBoolean = require('./GetBoolean');
var GetEaseFunction = require('./GetEaseFunction');
var GetNewValue = require('./GetNewValue');
var GetTargets = require('./GetTargets');
var GetTweens = require('./GetTweens');
var GetValue = require('../../utils/object/GetValue');
var Timeline = require('../Timeline');
var TweenBuilder = require('./TweenBuilder');

/**
 * Builds a Timeline of Tweens based on a configuration object.
 *
 * The configuration object (`config`) can have the following properties:
 *
 * `tweens` - an array of tween configuration objects to create and add into the new Timeline, as described by `TweenBuilder`. If this doesn't exist or is empty, the Timeline will start off paused and none of the other configuration settings will be read. If it's a function, it will be called and its return value will be used as the array.
 * `targets` - an array (or function which returns one) of default targets to which to apply the Timeline. Each individual Tween configuration can override this value.
 * `totalDuration` - if specified, each Tween in the Timeline will get an equal portion of this duration, usually in milliseconds, by default. Each individual Tween configuration can override the Tween's duration.
 * `duration` - if `totalDuration` is not specified, the default duration, usually in milliseconds, of each Tween which will be created. Each individual Tween configuration can override the Tween's duration.
 * `delay`, `easeParams`, `ease`, `hold`, `repeat`, `repeatDelay`, `yoyo`, `flipX`, `flipY` - the default settings for each Tween which will be created, as specified by `TweenBuilder`. Each individual Tween configuration can override any of these values.
 * `completeDelay` - if specified, the time to wait, usually in milliseconds, before the Timeline completes.
 * `loop` - how many times the Timeline should loop, or -1 to loop indefinitely.
 * `loopDelay` - the time, usually in milliseconds, between each loop
 * `paused` - if `true`, the Timeline will start paused
 * `useFrames` - if `true`, all duration in the Timeline will be in frames instead of milliseconds
 * `callbackScope` - the default scope (`this` value) to use for each callback registered by the Timeline Builder. If not specified, the Timeline itself will be used.
 * `onStart` - if specified, the `onStart` callback for the Timeline, called every time it starts playing
 * `onStartScope` - the scope (`this` value) to use for the `onStart` callback. If not specified, the `callbackScope` will be used.
 * `onStartParams` - additional arguments to pass to the `onStart` callback. The Timeline will always be the first argument.
 * `onUpdate` - if specified, the `onUpdate` callback for the Timeline, called every frame it's active, regardless of its Tweens
 * `onUpdateScope` - the scope (`this` value) to use for the `onUpdate` callback. If not specified, the `callbackScope` will be used.
 * `onUpdateParams` - additional arguments to pass to the `onUpdate` callback. The Timeline will always be the first argument.
 * `onLoop` - if specified, the `onLoop` callback for the Timeline, called every time it loops
 * `onLoopScope` - the scope (`this` value) to use for the `onLoop` callback. If not specified, the `callbackScope` will be used.
 * `onLoopParams` - additional arguments to pass to the `onLoop` callback. The Timeline will always be the first argument.
 * `onYoyo` - if specified, the `onYoyo` callback for the Timeline, called every time it yoyos
 * `onYoyoScope` - the scope (`this` value) to use for the `onYoyo` callback. If not specified, the `callbackScope` will be used.
 * `onYoyoParams` - additional arguments to pass to the `onYoyo` callback. The first argument will always be `null`, while the Timeline will always be the second argument.
 * `onComplete` - if specified, the `onComplete` callback for the Timeline, called after it completes
 * `onCompleteScope` - the scope (`this` value) to use for the `onComplete` callback. If not specified, the `callbackScope` will be used.
 * `onCompleteParams` - additional arguments to pass to the `onComplete` callback. The Timeline will always be the first argument.
 *
 * @function Phaser.Tweens.Builders.TimelineBuilder
 * @since 3.0.0
 *
 * @param {Phaser.Tweens.TweenManager} manager - The Tween Manager to which the Timeline will belong.
 * @param {object} config - The configuration object for the Timeline, as described above.
 *
 * @return {Phaser.Tweens.Timeline} The created Timeline.
 */
var TimelineBuilder = function (manager, config)
{
    var timeline = new Timeline(manager);

    var tweens = GetTweens(config);

    if (tweens.length === 0)
    {
        timeline.paused = true;

        return timeline;
    }

    var defaults = Clone(Defaults);

    defaults.targets = GetTargets(config);

    //  totalDuration: If specified each tween in the Timeline is given an equal portion of the totalDuration

    var totalDuration = GetAdvancedValue(config, 'totalDuration', 0);

    if (totalDuration > 0)
    {
        defaults.duration = Math.floor(totalDuration / tweens.length);
    }
    else
    {
        defaults.duration = GetNewValue(config, 'duration', defaults.duration);
    }

    defaults.delay = GetNewValue(config, 'delay', defaults.delay);
    defaults.easeParams = GetValue(config, 'easeParams', defaults.easeParams);
    defaults.ease = GetEaseFunction(GetValue(config, 'ease', defaults.ease), defaults.easeParams);
    defaults.hold = GetNewValue(config, 'hold', defaults.hold);
    defaults.repeat = GetNewValue(config, 'repeat', defaults.repeat);
    defaults.repeatDelay = GetNewValue(config, 'repeatDelay', defaults.repeatDelay);
    defaults.yoyo = GetBoolean(config, 'yoyo', defaults.yoyo);
    defaults.flipX = GetBoolean(config, 'flipX', defaults.flipX);
    defaults.flipY = GetBoolean(config, 'flipY', defaults.flipY);

    //  Create the Tweens
    for (var i = 0; i < tweens.length; i++)
    {
        timeline.queue(TweenBuilder(timeline, tweens[i], defaults));
    }

    timeline.completeDelay = GetAdvancedValue(config, 'completeDelay', 0);
    timeline.loop = Math.round(GetAdvancedValue(config, 'loop', 0));
    timeline.loopDelay = Math.round(GetAdvancedValue(config, 'loopDelay', 0));
    timeline.paused = GetBoolean(config, 'paused', false);
    timeline.useFrames = GetBoolean(config, 'useFrames', false);

    //  Callbacks

    var scope = GetValue(config, 'callbackScope', timeline);

    var timelineArray = [ timeline ];

    var onStart = GetValue(config, 'onStart', false);

    //  The Start of the Timeline
    if (onStart)
    {
        var onStartScope = GetValue(config, 'onStartScope', scope);
        var onStartParams = GetValue(config, 'onStartParams', []);

        timeline.setCallback('onStart', onStart, timelineArray.concat(onStartParams), onStartScope);
    }

    var onUpdate = GetValue(config, 'onUpdate', false);

    //  Every time the Timeline updates (regardless which Tweens are running)
    if (onUpdate)
    {
        var onUpdateScope = GetValue(config, 'onUpdateScope', scope);
        var onUpdateParams = GetValue(config, 'onUpdateParams', []);

        timeline.setCallback('onUpdate', onUpdate, timelineArray.concat(onUpdateParams), onUpdateScope);
    }

    var onLoop = GetValue(config, 'onLoop', false);

    //  Called when the whole Timeline loops
    if (onLoop)
    {
        var onLoopScope = GetValue(config, 'onLoopScope', scope);
        var onLoopParams = GetValue(config, 'onLoopParams', []);

        timeline.setCallback('onLoop', onLoop, timelineArray.concat(onLoopParams), onLoopScope);
    }

    var onYoyo = GetValue(config, 'onYoyo', false);

    //  Called when a Timeline yoyos
    if (onYoyo)
    {
        var onYoyoScope = GetValue(config, 'onYoyoScope', scope);
        var onYoyoParams = GetValue(config, 'onYoyoParams', []);

        timeline.setCallback('onYoyo', onYoyo, timelineArray.concat(null, onYoyoParams), onYoyoScope);
    }

    var onComplete = GetValue(config, 'onComplete', false);

    //  Called when the Timeline completes, after the completeDelay, etc.
    if (onComplete)
    {
        var onCompleteScope = GetValue(config, 'onCompleteScope', scope);
        var onCompleteParams = GetValue(config, 'onCompleteParams', []);

        timeline.setCallback('onComplete', onComplete, timelineArray.concat(onCompleteParams), onCompleteScope);
    }

    return timeline;
};

module.exports = TimelineBuilder;
