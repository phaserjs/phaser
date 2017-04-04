var GetObjectValue = require('../../utils/object/GetObjectValue');
var GetFrames = require('./GetFrames');

var Animation = function (manager, config)
{
    this.manager = manager;

    //      frames: [
    //          { key: textureKey, frame: textureFrame },
    //          { key: textureKey, frame: textureFrame, duration: float },
    //          { key: textureKey, frame: textureFrame, onUpdate: function }
    //      ],
    //      framerate: integer,
    //      duration: float (seconds, optional, ignored if framerate is set),
    //      skipMissedFrames: boolean,
    //      delay: integer
    //      repeat: -1 = forever, otherwise integer
    //      repeatDelay: integer
    //      yoyo: boolean,
    //      onStart: function
    //      onRepeat: function
    //      onComplete: function,

    this.frames = GetFrames(this, GetObjectValue(config, 'frames', []));

    this.framerate = GetObjectValue(config, 'framerate', 24);

    this.duration = GetObjectValue(config, 'duration', null);

    if (this.duration === null)
    {
        this.duration = this.framerate * this.frames.length;
    }
    else
    {
        //  Duration controls framerate
    }

    this.skipMissedFrames = GetObjectValue(config, 'skipMissedFrames', true);

    //  Delay before starting playback (in seconds)
    this.delay = GetObjectValue(config, 'delay', 0);

    this.repeat = GetObjectValue(config, 'repeat', 0);

    this.repeatDelay = GetObjectValue(config, 'repeatDelay', 0);

    this.yoyo = GetObjectValue(config, 'yoyo', false);

    this.onStart = GetObjectValue(config, 'onStart', false);
    this.onRepeat = GetObjectValue(config, 'onRepeat', false);
    this.onComplete = GetObjectValue(config, 'onComplete', false);
    this.onStop = GetObjectValue(config, 'onStop', false);
};

Animation.prototype.constructor = Animation;

Animation.prototype = {

    start: function ()
    {

    },

    update: function (elapsed)
    {

    },

    stop: function ()
    {

    },

    destroy: function ()
    {

    }
};

module.exports = Animation;
