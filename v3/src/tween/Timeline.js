var TweenBuilder = require('./TweenBuilder');

var Timeline = function (manager)
{
    this.manager = manager;

    this.tweens = [];

    this.paused = true;

    this.callbacks = {
        onStart: { callback: null, scope: null, params: null },
        onUpdate: { callback: null, scope: null, params: null },
        onRepeat: { callback: null, scope: null, params: null },
        onComplete: { callback: null, scope: null, params: null }
    };

    this.callbackScope;
};

Timeline.prototype.constructor = Timeline;

Timeline.prototype = {

    add: function (config)
    {
        TweenBuilder(this, config);

        return this;
    },

    queue: function (tween)
    {
        //  Add to this timeline

        this.tweens.push(tween);
    }

};

module.exports = Timeline;
