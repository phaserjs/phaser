
//  A Tween is responsible for tweening one property of one target.
//  If a target has many properties being tweened, then each unique property will be its own Tween object.
//  This allows us to have differing ease, duration and associated events per property.
//  A Tween contains TweenData objects (at least one). It can contain more than one TweenData,
//  in which case they play out like a nested timeline, all impacting just the one target property.

var Tween = function (manager, target, key)
{
    //  Needed? Maybe to dispatch Events?
    this.manager = manager;

    this.target = target;

    this.key = key;

    this.start;
    this.current;
    this.end;

    //  TweenData array
    this.data = [];

    //  Current TweenData being processed
    this.tween;

    //  if true then duration, delay, etc values are all frame totals
    this.useFrames = false;

    //  Time in ms/frames before the 'onComplete' event fires
    this.onCompleteDelay = 0;

    //  Changes the property to be this before starting the tween
    this.startAt;

    //  0 = Waiting to be added to the TweenManager
    //  1 = Paused (dev needs to invoke Tween.start)
    //  2 = Started, but waiting for delay to expire
    //  3 = Playing Forward
    //  4 = Playing Backwards
    //  5 = Completed
    this.state = 0;

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
    setCurrentTweenData: require('./components/SetCurrentTweenData'),
    setEventCallback: require('./components/SetEventCallback'),
    start: require('./components/Start'),
    update: require('./components/Update')

};

module.exports = Tween;
