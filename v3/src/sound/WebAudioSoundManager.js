var Class = require('../utils/Class');
var BaseSoundManager = require('./BaseSoundManager');
var WebAudioSound = require('./WebAudioSound');
//  Phaser.Loader.WebAudioSoundManager
var WebAudioSoundManager = new Class({
    Extends: BaseSoundManager,
    initialize: function WebAudioSoundManager(game) {
        BaseSoundManager.call(this, game);
        /**
         * The AudioContext being used for playback.
         *
         * @property {AudioContext} context
         */
        this.context = this.createAudioContext();
        /**
         * [description]
         *
         * @property {GainNode} masterVolumeNode
         */
        this.masterVolumeNode = this.context.createGain();
        /**
         * Destination node for connecting individual sounds to.
         *
         * @property {AudioNode} destination
         */
        this.destination = this.masterVolumeNode;
        this.masterVolumeNode.connect(this.context.destination);
    },
    createAudioContext: function () {
        var audioConfig = this.game.config.audio;
        if (audioConfig && audioConfig.context) {
            return audioConfig.context;
        }
        return new (window['AudioContext'] || window['webkitAudioContext'])();
    },
    add: function (key, config) {
        var sound = new WebAudioSound(this, key, config);
        this.sounds.push(sound);
        return sound;
    }
});
module.exports = WebAudioSoundManager;
