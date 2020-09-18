/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
 * @function Phaser.Tweens.Builders.TimelineBuilder
 * @since 3.0.0
 *
 * @param {Phaser.Tweens.TweenManager} manager - The Tween Manager to which the Timeline will belong.
 * @param {Phaser.Types.Tweens.TimelineBuilderConfig} config - The configuration object for the Timeline.
 *
 * @return {Phaser.Tweens.Timeline} The created Timeline.
 */
var TimelineBuilder = function (manager, config)
{
    var timeline = new Timeline(manager);

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

    // Tweens

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

    return timeline;
};

module.exports = TimelineBuilder;
