var GetValue = require('../utils/object/GetValue');
var GetEaseFunction = require('./GetEaseFunction');
var CloneObject = require('../utils/object/Clone');
var MergeRight = require('../utils/object/MergeRight');

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

    var tween = this.tweens.add({
        targets: player,
        props: {
            x: { value: 400, duration: 2000, ease: 'Power1' },
            y: { value: 300, duration: 1000, ease: 'Sine' }
        }
    });

    //  Multiple Targets + Multiple property tweens:

    var tween = this.tweens.add({
        targets: [ alien1, alien2, alien3, alienBoss ],
        props: {
            x: { value: 400, duration: 2000 },
            y: { value: 300, duration: 1000 }
        },
        ease: 'Sine'
    });

    //  Multiple Targets + Multiple properties + Multi-state Property tweens:

    var tween = this.tweens.add({
        targets: [ alien1, alien2, alien3, alienBoss ],
        props: {
            x: [ { value: 200, duration: 100 }, { value: 300, duration: 50 }, { value: 400 } ],
            y: { value: 300, duration: 1000 }
        },
        ease: 'Sine'
    });

    //  Multi-value Tween Property with static values

    var tween = this.tweens.add({
        targets: [ alien1, alien2, alien3, alienBoss ],
        props: {
            x: [ 200, 300, 400 ]
        },
        duration: 1000,
        ease: 'Sine'
    });
    
    var tween = this.tweens.add({
        targets: player,
        timeline: [
            { x: 400 },
            { y: 400 },
            { x: 100 },
            { y: 100 }
        ],
        duration: 1000,
        ease: 'Sine'
    });

 */

var Tween = function (manager, config)
{
    this.manager = manager;

    //  The following config properties are reserved words, i.e. they map to Tween related functions
    //  and properties. However if you've got a target that has a property that matches one of the
    //  reserved words, i.e. Target.duration - that you want to tween, then pass it inside a property
    //  called `props`. If present it will use the contents of the `props` object instead.

    this.targets = this.setTargets(GetValue(config, 'targets', null));

    //  'Default' Tween properties:

    this.tweenData = {
        ease: GetEaseFunction(GetValue(config, 'ease', 'Power0')),
        duration: GetValue(config, 'duration', 1000),
        yoyo: GetValue(config, 'yoyo', false),
        repeat: GetValue(config, 'repeat', 0),
        loop: GetValue(config, 'loop', false),
        delay: GetValue(config, 'delay', 0),
        startAt: null,
        progress: 0,
        startTime: 0,
        elapsed: 0
    };
 
    //  One of these for every property being tweened (min 1)
    this.tweenProps = {
        key: '',
        endValue: 0,
        current: 0,
        dataQueue: [] // array of TweenData objects
    };

    //  One of these per Target, per Property (min 1)
    this.tweenTarget = {
        target: undefined,
        currentValue: 0
    };
 
    // this.ease = GetEaseFunction(GetValue(config, 'ease', 'Power0'));
    // this.duration = GetValue(config, 'duration', 1000);

    //  Only applied if this Tween is part of a Timeline
    // this.offset = GetValue(config, 'offset', 0);

    // this.yoyo = GetValue(config, 'yoyo', false);
    // this.repeat = GetValue(config, 'repeat', 0);
    // this.delay = GetValue(config, 'delay', 0);
    // this.onCompleteDelay = GetValue(config, 'onCompleteDelay', 0);

    //  Same as repeat -1 (if set, overrides repeat value)
    // this.loop = GetValue(config, 'loop', (this.repeat === -1));

    // this.paused = GetValue(config, 'paused', false);
    // this.useFrames = GetValue(config, 'useFrames', false);
    // this.autoStart = GetValue(config, 'autoStart', true);

    //  Callbacks

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

    //  Running properties

    // this.running = this.autoStart;
    // this.progress = 0;
    // this.totalDuration = 0;

    this.buildTweenData(config);
};

Tween.prototype.constructor = Tween;

Tween.prototype = {

    //  Move to own functions

    getV: function (obj, key)
    {
        if (obj.hasOwnProperty(key))
        {
            return obj[key];
        }
        else if (this[key])
        {
            return this[key];
        }
    },

    buildTweenData: function (config)
    {
        //  For now let's just assume `config.props` is being used:

        // props: {
        //     x: 400,
        //     y: 300
        // }

        // props: {
        //     x: { value: 400, duration: 2000, ease: 'Power1' },
        //     y: { value: 300, duration: 1000, ease: 'Sine' }
        // }

        for (var key in config.props)
        {
            //  Check it's not a string or number (or function?)
            //  TODO: value might be an Array

            var data;
            var value = config.props[key];

            if (typeof value === 'number')
            {
                data = CloneObject(this.defaultTweenData);

                data.value = value;
            }
            else if (typeof value === 'string')
            {
                //  Do something :)
            }
            else
            {
                data = MergeRight(this.defaultTweenData, config.props[key]);
            }

            //  this.props = [
            //      {
            //          key: 'x',
            //          running: true,
            //          complete: false,
            //          current: 0,
            //          queue: [ TweenData, TweenData, TweenData ],
            //          totalDuration: Number (ms)
            //      }
            //  ]

            //  Convert to ms
            data.duration *= 1000;

            var propertyMarker = CloneObject(this.defaultInstance);

            propertyMarker.key = key;

            //  Adapt these to support array based multi-inserts
            propertyMarker.queue.push(data);
            propertyMarker.totalDuration = data.duration;

            this.props.push(propertyMarker);

            this.totalDuration += propertyMarker.totalDuration;
        }
    },

    update: function (timestep, delta)
    {
        if (!this.running)
        {
            return;
        }

        //  Calculate tweens

        var list = this.props;
        var targets = this.targets;

        //  this.props = [
        //      {
        //          key: 'x',
        //          start: [ Target0 startValue, Target1 startValue, Target2 startValue ],
        //          end: [ Target0 endValue, Target1 endValue, Target2 endValue ],
        //          running: true,
        //          complete: false,
        //          current: 0,
        //          queue: [ TweenData, TweenData, TweenData ],
        //          totalDuration: Number (ms)
        //      }
        //  ]

        for (var i = 0; i < list.length; i++)
        {
            var entry = list[i];

            //  Update TweenData

            if (entry.running)
            {
                // TweenData = {
                //     value: undefined,
                //     progress: 0,
                //     startTime: 0,
                //     ease: this.ease,
                //     duration: this.duration,
                //     yoyo: this.yoyo,
                //     repeat: this.repeat,
                //     loop: this.loop,
                //     delay: this.delay,
                //     startAt: undefined,
                //     elapsed: 0
                // };

                var tweenData = entry.queue[entry.current];

                tweenData.elapsed += delta;

                if (tweenData.elapsed > tweenData.duration)
                {
                    tweenData.elapsed = tweenData.duration;
                }

                //  What % is that?
                tweenData.progress = tweenData.elapsed / tweenData.duration;

                for (var t = 0; t < targets.length; t++)
                {
                    targets[i][entry.key] = tweenData.value;
                }
            }
        }

    },

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
