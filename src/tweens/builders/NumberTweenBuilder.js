/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BaseTween = require('../tween/BaseTween');
var Defaults = require('../tween/Defaults');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var GetBoolean = require('./GetBoolean');
var GetEaseFunction = require('./GetEaseFunction');
var GetFastValue = require('../../utils/object/GetFastValue');
var GetNewValue = require('./GetNewValue');
var GetValue = require('../../utils/object/GetValue');
var GetValueOp = require('./GetValueOp');
var MergeRight = require('../../utils/object/MergeRight');
var Tween = require('../tween/Tween');

/**
 * Creates a new Number Tween, also known as a counter tween.
 *
 * Unlike a standard tween, a Number Tween does not target a Game Object's properties.
 * Instead, it interpolates a plain numeric value between a `from` and a `to` value over
 * the course of the tween. The current interpolated value can be read at any time via
 * `tween.getValue()`. This makes Number Tweens ideal for driving custom animations,
 * UI counters, shader uniforms, or any other value that needs to change smoothly over
 * time without being tied directly to a Game Object property.
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
    if (config instanceof Tween)
    {
        config.parent = parent;

        return config;
    }

    if (defaults === undefined)
    {
        defaults = Defaults;
    }
    else
    {
        defaults = MergeRight(Defaults, defaults);
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

    var from = GetFastValue(config, 'from', 0);
    var to = GetFastValue(config, 'to', 1);

    var targets = [ { value: from } ];

    var delay = GetFastValue(config, 'delay', defaults.delay);
    var easeParams = GetFastValue(config, 'easeParams', defaults.easeParams);
    var ease = GetFastValue(config, 'ease', defaults.ease);

    var ops = GetValueOp('value', to);

    var tween = new Tween(parent, targets);

    var tweenData = tween.add(
        0,
        'value',
        ops.getEnd,
        ops.getStart,
        ops.getActive,
        GetEaseFunction(GetFastValue(config, 'ease', ease), GetFastValue(config, 'easeParams', easeParams)),
        GetNewValue(config, 'delay', delay),
        GetFastValue(config, 'duration', defaults.duration),
        GetBoolean(config, 'yoyo', defaults.yoyo),
        GetFastValue(config, 'hold', defaults.hold),
        GetFastValue(config, 'repeat', defaults.repeat),
        GetFastValue(config, 'repeatDelay', defaults.repeatDelay),
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
    tween.isNumberTween = true;

    //  Set the Callbacks
    tween.callbackScope = GetValue(config, 'callbackScope', tween);

    var callbacks = BaseTween.TYPES;

    for (var i = 0; i < callbacks.length; i++)
    {
        var type = callbacks[i];

        var callback = GetValue(config, type, false);

        if (callback)
        {
            var callbackParams = GetValue(config, type + 'Params', []);

            tween.setCallback(type, callback, callbackParams);
        }
    }

    return tween;
};

module.exports = NumberTweenBuilder;
