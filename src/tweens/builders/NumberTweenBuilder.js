/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
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
 * Creates a new Number Tween.
 *
 * @function Phaser.Tweens.Builders.NumberTweenBuilder
 * @since 3.0.0
 *
 * @param {Phaser.Tweens.TweenManager} parent - The owner of the new Tween.
 * @param {Phaser.Types.Tweens.NumberTweenBuilderConfig} config - Configuration for the new Tween.
 * @param {Phaser.Types.Tweens.TweenConfigDefaults} defaults - Tween configuration defaults.
 *
 * @return {Phaser.Tweens.Tween} The new tween.
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

    var delay = GetValue(config, 'delay', defaults.delay);
    var easeParams = GetValue(config, 'easeParams', defaults.easeParams);
    var ease = GetValue(config, 'ease', defaults.ease);

    var ops = GetValueOp('value', to);

    var tween = new Tween(parent, targets);

    //  TODO - Needs tidying up + easeParams being used, etc

    var tweenData = tween.add(
        0,
        'value',
        ops.getEnd,
        ops.getStart,
        ops.getActive,
        ease,
        delay,
        GetValue(config, 'duration', defaults.duration),
        GetBoolean(config, 'yoyo', defaults.yoyo),
        GetValue(config, 'hold', defaults.hold),
        GetValue(config, 'repeat', defaults.repeat),
        GetValue(config, 'repeatDelay', defaults.repeatDelay),
        false,
        false
    );

    tweenData.start = from;
    tweenData.current = from;

    tween.completeDelay = GetAdvancedValue(config, 'completeDelay', 0);
    tween.loop = Math.round(GetAdvancedValue(config, 'loop', 0));
    tween.loopDelay = Math.round(GetAdvancedValue(config, 'loopDelay', 0));
    tween.paused = GetBoolean(config, 'paused', false);
    tween.persist = GetBoolean(config, 'persist', false);

    //  Set the Callbacks
    var scope = GetValue(config, 'callbackScope', tween);
    var callbacks = Tween.TYPES;

    for (var i = 0; i < callbacks.length; i++)
    {
        var type = callbacks[i];

        var callback = GetValue(config, type, false);

        if (callback)
        {
            var callbackScope = GetValue(config, type + 'Scope', scope);
            var callbackParams = GetValue(config, type + 'Params', []);

            tween.setCallback(type, callback, callbackParams, callbackScope);
        }
    }

    return tween;
};

module.exports = NumberTweenBuilder;
