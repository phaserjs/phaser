/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

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

/**
 * [description]
 *
 * @function Phaser.Tweens.Builders.TweenBuilder
 * @since 3.0.0
 *
 * @param {(Phaser.Tweens.TweenManager|Phaser.Tweens.Timeline)} parent - [description]
 * @param {object} config - [description]
 * @param {Phaser.Tweens.TweenConfigDefaults} defaults - Tween configuration defaults.
`
 * @property {(object|object[])} targets - The object, or an array of objects, to run the tween on.
 * @property {number} [delay=0] - The number of milliseconds to delay before the tween will start.
 * @property {number} [duration=1000] - The duration of the tween in milliseconds.
 * @property {string} [ease='Power0'] - The easing equation to use for the tween.
 * @property {array} [easeParams] - Optional easing parameters.
 * @property {number} [hold=0] - The number of milliseconds to hold the tween for before yoyo'ing.
 * @property {number} [repeat=0] - The number of times to repeat the tween.
 * @property {number} [repeatDelay=0] - The number of milliseconds to pause before a tween will repeat.
 * @property {boolean} [yoyo=false] - Should the tween complete, then reverse the values incrementally to get back to the starting tween values? The reverse tweening will also take `duration` milliseconds to complete.
 * @property {boolean} [flipX=false] - Horizontally flip the target of the Tween when it completes (before it yoyos, if set to do so). Only works for targets that support the `flipX` property.
 * @property {boolean} [flipY=false] - Vertically flip the target of the Tween when it completes (before it yoyos, if set to do so). Only works for targets that support the `flipY` property.
`
{
    targets: null,
    delay: 0,
    duration: 1000,
    ease: 'Power0',
    easeParams: null,
    hold: 0,
    repeat: 0,
    repeatDelay: 0,
    yoyo: false,
    flipX: false,
    flipY: false
};
 *
 * @return {Phaser.Tweens.Tween} [description]
 */
var TweenBuilder = function (parent, config, defaults)
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
            var ops = GetValueOp(key, value);

            var tweenData = TweenData(
                targets[t],
                key,
                ops.getEnd,
                ops.getStart,
                GetEaseFunction(GetValue(value, 'ease', ease), easeParams),
                GetNewValue(value, 'delay', delay),
                GetNewValue(value, 'duration', duration),
                GetBoolean(value, 'yoyo', yoyo),
                GetNewValue(value, 'hold', hold),
                GetNewValue(value, 'repeat', repeat),
                GetNewValue(value, 'repeatDelay', repeatDelay),
                GetBoolean(value, 'flipX', flipX),
                GetBoolean(value, 'flipY', flipY)
            );

            data.push(tweenData);
        }
    }

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

module.exports = TweenBuilder;
