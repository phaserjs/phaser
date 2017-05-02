
var Class = require('../utils/Class');
var Components = require('./animation/');

//  Game Object Animation Controller

var Animation = new Class({

    initialize:

    function Animation (parent)
    {
        //  Sprite / Game Object
        this.parent = parent;

        this.animationManager = parent.state.sys.anims;

        this.animationManager.events.once('REMOVE_ANIMATION_EVENT', this.remove.bind(this));

        this.isPlaying = false;

        //  Reference to the Phaser.Animation object
        this.currentAnim = null;

        //  Reference to the Phaser.AnimationFrame object
        this.currentFrame = null;

        //  Animation specific values
        //  -------------------------

        //  Scale the time (make it go faster / slower)
        //  Factor that's used to scale time where 1 = normal speed (the default), 0.5 = half speed, 2 = double speed, etc.
        this._timeScale = 1;

        //  The frame rate of playback in frames per second (default 24 if duration is null)
        this.frameRate = 0;

        //  How long the animation should play for. If framerate is set it overrides this value
        //  otherwise framerate is derived from duration
        this.duration = 0;

        //  ms per frame (without including frame specific modifiers)
        this.msPerFrame = 0;

        //  Skip frames if the time lags, or always advanced anyway?
        this.skipMissedFrames = true;

        //  Delay before starting playback (in seconds)
        this._delay = 0;

        //  Number of times to repeat the animation (-1 for infinity)
        this._repeat = 0;

        //  Delay before the repeat starts (in seconds)
        this._repeatDelay = 0;

        //  Should the animation yoyo? (reverse back down to the start) before repeating?
        this._yoyo = false;

        //  Playhead values
        //  ---------------

        //  Move the playhead forward (true) or in reverse (false)
        this.forward = true;

        this.accumulator = 0;
        this.nextTick = 0;

        this.repeatCounter = 0;

        this.pendingRepeat = false;

        this._paused = false;
        this._wasPlaying = false;

        this._callbackArgs = [ parent, null ];
        this._updateParams = [];
    },


    destroy: function ()
    {

    },

    delay: Components.Delay,
    delayedPlay: Components.DelayedPlay,
    load: Components.Load,
    pause: Components.Pause,
    paused: Components.Paused,
    play: Components.Play,
    progress: Components.Progress,
    remove: Components.Remove,
    repeat: Components.Repeat,
    repeatDelay: Components.RepeatDelay,
    restart: Components.Restart,
    resume: Components.Resume,
    stop: Components.Stop,
    timeScale: Components.TimeScale,
    totalFrames: Components.TotalFrames,
    totalProgress: Components.TotalProgress,
    update: Components.Update,
    updateFrame: Components.UpdateFrame,
    yoyo: Components.Yoyo

});

module.exports = Animation;
