var GetValue = require('../../utils/object/GetValue');
var GetFrames = require('./GetFrames');

//  A Frame based Animation
//  This consists of a key, some default values (like the frame rate) and a bunch of Frame objects.
//  The Animation Manager creates these
//  Game Objects don't own an instance of these directly
//  Game Objects have the Animation Component, which are like playheads to global Animations (these objects)
//  So multiple Game Objects can have playheads all pointing to this one Animation instance

var Animation = function (manager, key, config)
{
    this.manager = manager;

    this.key = key;

    //  A frame based animation (as opposed to a bone based animation)
    this.type = 'frame';

    //  Extract all the frame data into the frames array
    this.frames = GetFrames(manager.textureManager, GetValue(config, 'frames', []));

    //  The frame rate of playback in frames per second (default 24 if duration is null)
    this.frameRate = GetValue(config, 'framerate', null);

    //  How long the animation should play for. If frameRate is set it overrides this value
    //  otherwise frameRate is derived from duration
    this.duration = GetValue(config, 'duration', null);

    if (this.duration === null && this.frameRate === null)
    {
        //  No duration or frameRate given, use default frameRate of 24fps
        this.frameRate = 24;
        this.duration = this.frameRate / this.frames.length;
    }
    else if (this.duration && this.frameRate === null)
    {
        //  Duration given but no frameRate, so set the frameRate based on duration
        //  I.e. 12 frames in the animation, duration = 4 (4000 ms)
        //  So frameRate is 12 / 4 = 3 fps
        this.frameRate = this.frames.length / this.duration;
    }
    else
    {
        //  frameRate given, derive duration from it (even if duration also specified)
        //  I.e. 15 frames in the animation, frameRate = 30 fps
        //  So duration is 15 / 30 = 0.5 (half a second)
        this.duration = this.frames.length / this.frameRate;
    }

    //  ms per frame (without including frame specific modifiers)
    this.msPerFrame = 1000 / this.frameRate;

    //  Skip frames if the time lags, or always advanced anyway?
    this.skipMissedFrames = GetValue(config, 'skipMissedFrames', true);

    //  Delay before starting playback (in seconds)
    this.delay = GetValue(config, 'delay', 0);

    //  Number of times to repeat the animation (-1 for infinity)
    this.repeat = GetValue(config, 'repeat', 0);

    //  Delay before the repeat starts (in seconds)
    this.repeatDelay = GetValue(config, 'repeatDelay', 0);

    //  Should the animation yoyo? (reverse back down to the start) before repeating?
    this.yoyo = GetValue(config, 'yoyo', false);

    //  Should sprite.visible = true when the animation starts to play?
    this.showOnStart = GetValue(config, 'showOnStart', false);

    //  Should sprite.visible = false when the animation finishes?
    this.hideOnComplete = GetValue(config, 'hideOnComplete', false);

    //  Callbacks
    this.callbackScope = GetValue(config, 'callbackScope', this);

    this.onStart = GetValue(config, 'onStart', false);
    this.onStartParams = GetValue(config, 'onStartParams', []);

    this.onRepeat = GetValue(config, 'onRepeat', false);
    this.onRepeatParams = GetValue(config, 'onRepeatParams', []);

    //  Called for EVERY frame of the animation.
    //  See AnimationFrame.onUpdate for a frame specific callback.
    this.onUpdate = GetValue(config, 'onUpdate', false);
    this.onUpdateParams = GetValue(config, 'onUpdateParams', []);

    this.onComplete = GetValue(config, 'onComplete', false);
    this.onCompleteParams = GetValue(config, 'onCompleteParams', []);

    //  Global pause, effects all Game Objects using this Animation instance
    this.paused = false;

    this.manager.events.on('PAUSE_ALL_ANIMATION_EVENT', this.pause.bind(this));
    this.manager.events.on('RESUME_ALL_ANIMATION_EVENT', this.resume.bind(this));
};

Animation.prototype.constructor = Animation;

Animation.prototype = {

    addFrame: require('./AddFrame'),
    addFrameAt: require('./AddFrameAt'),
    checkFrame: require('./CheckFrame'),
    completeAnimation: require('./CompleteAnimation'),
    getFirstTick: require('./GetFirstTick'),
    getFrameAt: require('./GetFrameAt'),
    getNextTick: require('./GetNextTick'),
    load: require('./Load'),
    nextFrame: require('./NextFrame'),
    previousFrame: require('./PreviousFrame'),
    removeFrame: require('./RemoveFrame'),
    removeFrameAt: require('./RemoveFrameAt'),
    repeatAnimation: require('./RepeatAnimation'),
    setFrame: require('./SetFrame'),
    toJSON: require('./ToJSON'),
    updateFrameSequence: require('./UpdateFrameSequence'),

    pause: function ()
    {
        this.paused = true;
    },

    resume: function ()
    {
        this.paused = false;
    },

    destroy: function ()
    {

    }
};

module.exports = Animation;
