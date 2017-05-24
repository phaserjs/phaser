var TWEEN_CONST = require('./const');

var Tween = function (manager, data)
{
    this.manager = manager;

    //  An array of TweenData objects, each containing a unique property and target being tweened.
    this.data = data;

    //  data array doesn't change, so we can cache the length
    this.totalData = data.length;

    //  Cached target total (not necessarily the same as the data total)
    this.totalTargets = 0;

    //  If true then duration, delay, etc values are all frame totals
    this.useFrames = false;

    //  Time in ms/frames before the tween starts for the very first time
    //  never used again once the tween has begun, even if it loops.
    this.startDelay = 0;

    //  Infinitely loop this tween?
    //  When enabled it will play through ALL TweenDatas again (doesn't apply to just a single TD)
    this.loop = false;

    //  Time in ms/frames before the tween loops again if loop is true
    this.loopDelay = 0;

    //  Time in ms/frames before the 'onComplete' event fires. This never fires if loop = true (as it never completes)
    this.completeDelay = 0;

    //  Countdown timer (used by startDelay, loopDelay and completeDelay)
    this.countdown = 0;

    this.state = TWEEN_CONST.PENDING_ADD;

    this.paused = false;

    this.totalDuration = 0;
    this.progress = 0;

    this.callbacks = {
        onStart: { callback: null, scope: null, params: null },
        onUpdate: { callback: null, scope: null, params: null },
        onRepeat: { callback: null, scope: null, params: null },
        onLoop: { callback: null, scope: null, params: null },
        onComplete: { callback: null, scope: null, params: null }
    };

    this.callbackScope;
};

Tween.prototype.constructor = Tween;

Tween.prototype = {

    init: require('./components/Init'),
    calcDuration: require('./components/CalcDuration'),
    loadValues: require('./components/LoadValues'),
    nextState: require('./components/NextState'),
    play: require('./components/Play'),
    resetTweenData: require('./components/ResetTweenData'),
    seek: require('./components/Seek'),
    setEventCallback: require('./components/SetEventCallback'),
    update: require('./components/Update')

};

module.exports = Tween;
