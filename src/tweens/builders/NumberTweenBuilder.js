/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Defaults = require('../tween/Defaults');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var GetBoolean = require('./GetBoolean');
var GetEaseFunction = require('./GetEaseFunction');
var GetNewValue = require('./GetNewValue');
var GetValue = require('../../utils/object/GetValue');
var GetValueOp = require('./GetValueOp');
var Tween = require('../tween/Tween');
var TweenData = require('../tween/TweenData');

/**
 * [description]
 *
 * @function Phaser.Tweens.Builders.NumberTweenBuilder
 * @since 3.0.0
 *
 * @param {(Phaser.Tweens.TweenManager|Phaser.Tweens.Timeline)} parent - [description]
 * @param {object} config - [description]
 * @param {Phaser.Types.Tweens.TweenConfigDefaults} defaults - [description]
 *
 * @return {Phaser.Tweens.Tween} [description]
 */
var NumberTweenBuilder = function (parent, config, defaults)
{
    if (defaults === undefined)
    {
        defaults = Defaults;
    }

    //  var tween = this.tweens.addCounter({
    //      from: 100,
    //      to: 200,
    //      ... (normal tween properties)
    //  })
    //
    //  Then use it in your game via:
    //
    //  tween.getValue()

    var from = GetValue(config, 'from', 0);
    var to = GetValue(config, 'to', 1);

    var targets = [ { value: from } ];

    var delay = GetNewValue(config, 'delay', defaults.delay);
    var duration = GetNewValue(config, 'duration', defaults.duration);
    var easeParams = GetValue(config, 'easeParams', defaults.easeParams);
    var ease = GetEaseFunction(GetValue(config, 'ease', defaults.ease), easeParams);
    var hold = GetNewValue(config, 'hold', defaults.hold);
    var repeat = GetNewValue(config, 'repeat', defaults.repeat);
    var repeatDelay = GetNewValue(config, 'repeatDelay', defaults.repeatDelay);
    var yoyo = GetBoolean(config, 'yoyo', defaults.yoyo);

    var data = [];

    var ops = GetValueOp('value', to);

    var tweenData = TweenData(
        targets[0],
        'value',
        ops.getEnd,
        ops.getStart,
        ease,
        delay,
        duration,
        yoyo,
        hold,
        repeat,
        repeatDelay,
        false,
        false
    );

    tweenData.start = from;
    tweenData.current = from;
    tweenData.to = to;

    data.push(tweenData);

    var tween = new Tween(parent, data, targets);

    tween.offset = GetAdvancedValue(config, 'offset', null);
    tween.completeDelay = GetAdvancedValue(config, 'completeDelay', 0);
    tween.loop = Math.round(GetAdvancedValue(config, 'loop', 0));
    tween.loopDelay = Math.round(GetAdvancedValue(config, 'loopDelay', 0));
    tween.paused = GetBoolean(config, 'paused', false);
    tween.useFrames = GetBoolean(config, 'useFrames', false);

    //  Set the Callbacks
    var scope = GetValue(config, 'callbackScope', tween);

    //  Callback parameters: 0 = a reference to the Tween itself, 1 = the target/s of the Tween, ... your own params
    var tweenArray = [ tween, null ];

    var callbacks = Tween.TYPES;

    for (var i = 0; i < callbacks.length; i++)
    {
        var type = callbacks[i];

        var callback = GetValue(config, type, false);

        if (callback)
        {
            var callbackScope = GetValue(config, type + 'Scope', scope);
            var callbackParams = GetValue(config, type + 'Params', []);

            //  The null is reset to be the Tween target
            tween.setCallback(type, callback, tweenArray.concat(callbackParams), callbackScope);
        }
    }

    return tween;
};

module.exports = NumberTweenBuilder;
