var Clone = require('../../utils/object/Clone');
var Defaults = require('../tween/Defaults');
var GetBoolean = require('./GetBoolean');
var GetEaseFunction = require('./GetEaseFunction');
var GetNewValue = require('./GetNewValue');
var GetTargets = require('./GetTargets');
var GetTweens = require('./GetTweens');
var GetValue = require('../../utils/object/GetValue');
var Timeline = require('../timeline/Timeline');
var TweenBuilder = require('./TweenBuilder');

var TimelineBuilder = function (manager, config)
{
    var defaults = Clone(Defaults);

    var tweens = GetTweens(config);

    if (tweens.length === 0)
    {
        return null;
    }

    defaults.targets = GetTargets(config);

    defaults.delay = GetNewValue(config, 'delay', defaults.delay);
    defaults.duration = GetNewValue(config, 'duration', defaults.duration);
    defaults.easeParams = GetValue(config, 'easeParams', defaults.easeParams);
    defaults.ease = GetEaseFunction(GetValue(config, 'ease', defaults.ease), defaults.easeParams);
    defaults.hold = GetNewValue(config, 'hold', defaults.hold);
    defaults.repeat = GetNewValue(config, 'repeat', defaults.repeat);
    defaults.repeatDelay = GetNewValue(config, 'repeatDelay', defaults.repeatDelay);
    defaults.startAt = GetNewValue(config, 'startAt', defaults.startAt);
    defaults.yoyo = GetBoolean(config, 'yoyo', defaults.yoyo);
    defaults.flipX = GetBoolean(config, 'flipX', defaults.flipX);
    defaults.flipY = GetBoolean(config, 'flipY', defaults.flipY);

    var timeline = new Timeline(manager);

    //  Create the Tweens
    for (var i = 0; i < tweens.length; i++)
    {
        timeline.queue(TweenBuilder(manager, tweens[i], defaults));
    }

    return timeline;
};

module.exports = TimelineBuilder;
