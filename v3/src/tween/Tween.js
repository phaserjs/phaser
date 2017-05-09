var GetValue = require('../utils/object/GetValue');
var TweenData = require('./TweenData');

var RESERVED = [ 'targets', 'ease', 'duration', 'yoyo', 'repeat', 'loop', 'paused', 'useFrames', 'offset' ];

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

 */

var Tween = function (manager, config)
{
    this.manager = manager;

    //  The following config properties are reserved words, i.e. they map to Tween related functions
    //  and properties. However if you've got a target that has a property that matches one of the
    //  reserved words, i.e. Target.duration - that you want to tween, then pass it inside a property
    //  called `vars`. If present it will use the contents of the `vars` object instead.

    this.targets = this.setTargets(GetValue(config, 'targets', null));

    this.ease;

    this.duration = GetValue(config, 'duration', 1000);

    //  Only applied if this Tween is part of a Timeline
    this.offset = GetValue(config, 'offset', 0);

    this.yoyo = GetValue(config, 'yoyo', false);
    this.repeat = GetValue(config, 'repeat', 0);

    // same as repeat -1 (if set, overrides repeat value)
    this.loop = GetValue(config, 'loop', undefined);

    this.paused = GetValue(config, 'paused', false);

    this.useFrames = GetValue(config, 'useFrames', false);

    this.onStart;
    this.onStartScope;
    this.onStartParams;

    this.onUpdate;
    this.onUpdateScope;
    this.onUpdateParams;

    this.onRepeat;
    this.onRepeatScope;
    this.onRepeatParams;

    this.onComplete;
    this.onCompleteScope;
    this.onCompleteParams;

    this.callbackScope;

};

Tween.prototype.constructor = Tween;

Tween.prototype = {

    //  Move to own functions

    setTargets: function (targets)
    {
        if (typeof targets === 'function')
        {
            targets = targets.call();
        }

        if (!Array.isArray(targets))
        {
            targets = [ targets ];
        }

        return targets;
    },

    eventCallback: function (type, callback, params, scope)
    {
        var types = [ 'onStart', 'onUpdate', 'onRepeat', 'onComplete' ];

        if (types.indexOf(type) !== -1)
        {
            this[type] = callback;
            this[type + 'Params'] = params;
            this[type + 'Scope'] = scope;
        }

        return this;
    },

    timeScale: function ()
    {

    }

};

module.exports = Tween;
