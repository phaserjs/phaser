/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BaseTween = require('../tween/BaseTween');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var GetBoolean = require('./GetBoolean');
var GetTargets = require('./GetTargets');
var GetValue = require('../../utils/object/GetValue');
var TweenBuilder = require('./TweenBuilder');
var TweenChain = require('../tween/TweenChain');

/**
 * Creates a new Tween Chain instance.
 *
 * @function Phaser.Tweens.Builders.TweenChainBuilder
 * @since 3.60.0
 *
 * @param {Phaser.Tweens.TweenManager} parent - The owner of the new Tween.
 * @param {Phaser.Types.Tweens.TweenChainBuilderConfig|object} config - Configuration for the new Tween.
 *
 * @return {Phaser.Tweens.TweenChain} The new Tween Chain.
 */
var TweenChainBuilder = function (parent, config)
{
    if (config instanceof TweenChain)
    {
        config.parent = parent;

        return config;
    }

    //  Default TweenChain values

    var chain = new TweenChain(parent);

    chain.startDelay = GetValue(config, 'delay', 0);
    chain.completeDelay = GetAdvancedValue(config, 'completeDelay', 0);
    chain.loop = Math.round(GetAdvancedValue(config, 'loop', GetValue(config, 'repeat', 0)));
    chain.loopDelay = Math.round(GetAdvancedValue(config, 'loopDelay', GetValue(config, 'repeatDelay', 0)));
    chain.paused = GetBoolean(config, 'paused', false);
    chain.persist = GetBoolean(config, 'persist', false);

    //  Set the Callbacks
    chain.callbackScope = GetValue(config, 'callbackScope', chain);

    var i;
    var callbacks = BaseTween.TYPES;

    for (i = 0; i < callbacks.length; i++)
    {
        var type = callbacks[i];

        var callback = GetValue(config, type, false);

        if (callback)
        {
            var callbackParams = GetValue(config, type + 'Params', []);

            chain.setCallback(type, callback, callbackParams);
        }
    }

    //  Add in the Tweens
    var tweens = GetValue(config, 'tweens', null);

    if (Array.isArray(tweens))
    {
        var chainedTweens = [];

        var targets = GetTargets(config);
        var defaults = undefined;

        if (targets)
        {
            defaults = { targets: targets };
        }

        for (i = 0; i < tweens.length; i++)
        {
            chainedTweens.push(TweenBuilder(chain, tweens[i], defaults));
        }

        chain.add(chainedTweens);
    }

    return chain;
};

module.exports = TweenChainBuilder;
