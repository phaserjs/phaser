var Sprite = require('./Sprite');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var BuildGameObject = require('../BuildGameObject');

var BuildFromConfig = function (state, config)
{
    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);

    var sprite = new Sprite(state, 0, 0, key, frame);

    BuildGameObject(state, sprite, config);

    //  Sprite specific config options:

    //  { anims: 'key' }
    //  { anims: {
    //              key: string
    //              startFrame: [string|integer]
    //           }
    //  }

    // delay: Components.Delay,
    // delayedPlay: Components.DelayedPlay,
    // load: Components.Load,
    // pause: Components.Pause,
    // paused: Components.Paused,
    // play: Components.Play,
    // progress: Components.Progress,
    // repeat: Components.Repeat,
    // repeatDelay: Components.RepeatDelay,
    // restart: Components.Restart,
    // resume: Components.Resume,
    // stop: Components.Stop,
    // timeScale: Components.TimeScale,
    // totalFrames: Components.TotalFrames,
    // totalProgress: Components.TotalProgress,
    // update: Components.Update,
    // updateFrame: Components.UpdateFrame,
    // yoyo: Components.Yoyo

    // var anim = GetAdvancedValue(config, 'anims', null);

    return sprite;
};

module.exports = BuildFromConfig;
