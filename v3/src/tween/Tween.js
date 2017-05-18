var TWEEN_CONST = require('./const');

//  A Tween is responsible for tweening one property of one target.
//  If a target has many properties being tweened, then each unique property will be its own Tween object.
//  This allows us to have differing ease, duration and associated events per property.
//  A Tween contains TweenData objects (at least one). It can contain more than one TweenData,
//  in which case they play out like a nested timeline, all impacting just the one target property.

var Tween = function (manager, target, key)
{
    this.manager = manager;

    this.target = target;

    this.key = key;

    this.start;
    this.current;
    this.end;

    //  TweenData array
    this.data = [];

    //  Current TweenData being processed
    this.currentTweenData = null;

    //  if true then duration, delay, etc values are all frame totals
    this.useFrames = false;

    //  Time in ms/frames before the tween starts for the very first time
    //  (populated by stagger property, or directly) - never used again once the
    //  tween has begun.
    this.startDelay = 0;

    // infinitely loop this tween? Maybe a string? 'alternate', 'reverse', etc
    // When enabled it will play through
    this.loop = false;

    //  Time in ms/frames before the tween loops again if loop is true
    this.loopDelay = 0;

    //  Time in ms/frames before the 'onComplete' event fires
    this.completeDelay = 0;

    // delta countdown timer
    this.countdown = 0;

    this.state = TWEEN_CONST.PENDING_ADD;

    this.paused = false;

    this.callbacks = {
        onStart: { callback: null, scope: null, params: null },
        onUpdate: { callback: null, scope: null, params: null },
        onRepeat: { callback: null, scope: null, params: null },
        onComplete: { callback: null, scope: null, params: null }
    };

    this.callbackScope;
};

Tween.prototype.constructor = Tween;

Tween.prototype = {

    init: require('./components/Init'),
    loadValues: require('./components/LoadValues'),
    advanceState: require('./components/AdvanceState'),
    setCurrentTweenData: require('./components/SetCurrentTweenData'),
    setEventCallback: require('./components/SetEventCallback'),
    play: require('./components/Play'),
    update: require('./components/Update')

};

module.exports = Tween;
