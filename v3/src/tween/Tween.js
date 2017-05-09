var GetValue = require('../utils/object/GetValue');
var TweenData = require('./TweenData');

var Tween = function (manager)
{
    this.manager = manager;

    this.targets;
    this.ease;
    this.yoyo;
    this.repeat;
    this.loop; // same as repeat -1 (if set, overrides repeat value)
    this.paused;

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

    this.useFrames = false;
};

Tween.prototype.constructor = Tween;

Tween.prototype = {

    timeScale: function ()
    {

    },

};

module.exports = Tween;
