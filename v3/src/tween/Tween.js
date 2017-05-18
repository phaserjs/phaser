var TWEEN_CONST = require('./const');

//  A Tween is responsible for tweening one property of one target.
//  If a target has many properties being tweened, then each unique property will be its own Tween object.
//  This allows us to have differing ease, duration and associated events per property.
//  A Tween contains TweenData objects (at least one). It can contain more than one TweenData,
//  in which case they play out like a nested timeline, all impacting just the one target property.

var Tween = function (manager, targets, tweenData)
{
    this.manager = manager;

    //  Array of targets being tweened (TweenTarget objects)
    this.targets = targets;

    //  targets array size doesn't change, so we can cache the length
    this.totalTargets = targets.length;

    this.data = tweenData;

    //  An object with a property matching those being tweened by this Tween.
    //  The list arrays contain TweenData instances in a linked-list format.
    //
    //  {
    //      x: {
    //          current: TweenData reference
    //          list: []
    //      },
    //      y: {
    //          current: TweenData reference
    //          list: []
    //      }
    //  }

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

    // delta countdown timer (used by startDelay and loopDelay)
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
    play: require('./components/Play'),
    resetTweenData: require('./components/ResetTweenData'),
    update: require('./components/Update'),
    calcTargetsValue: require('./components/CalcTargetsValue'),
    resetTargetsValue: require('./components/ResetTargetsValue'),
    setEventCallback: require('./components/SetEventCallback'),
    loadValues: require('./components/LoadValues'),
    nextTweenData: require('./components/NextTweenData'),
    setCurrentTweenData: require('./components/SetCurrentTweenData'),

};

module.exports = Tween;
