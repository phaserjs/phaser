var Class = require('../utils/Class');
var NOOP = require('../utils/NOOP');
var EventDispatcher = require('../events/EventDispatcher');
//  Phaser.Sound.BaseSoundManager
var BaseSoundManager = new Class({
    initialize: function BaseSoundManager(game) {
        /**
         * Local reference to game.
         *
         * @property {Phaser.Game} game
         */
        this.game = game;
        /**
         * An array containing all added sounds.
         *
         * @property {Array} sounds
         */
        this.sounds = [];
        /**
         * Global mute setting.
         *
         * @property {boolean} mute
         */
        this.mute = false;
        /**
         * Global volume setting.
         *
         * @property {number} volume
         */
        this.volume = 1;
        /**
         * Global playback rate at which all the audio assets will be played.
         * Value of 1.0 plays the audio at full speed, 0.5 plays the audio at half speed
         * and 2.0 doubles the audio's playback speed.
         *
         * @property {number} rate
         */
        this.rate = 1;
        /**
         * Global detuning of all sounds in [cents](https://en.wikipedia.org/wiki/Cent_%28music%29).
         * The range of the value is -1200 to 1200, but we recommend setting it to [50](https://en.wikipedia.org/wiki/50_Cent).
         *
         * @property {number} detune
         */
        this.detune = 0;
        /**
         * Global amount of panning to apply.
         * The value can range between -1 (full left pan) and 1 (full right pan).
         * @property  {number} pan
         */
        this.pan = 0;
        // TODO add fields for global spatialization options
        /**
         * Flag indicating if sounds should be paused when game looses focus,
         * for instance when user switches tabs or to another program/app.
         *
         * @property {boolean} pauseOnBlur
         */
        this.pauseOnBlur = true;
        /**
         * [description]
         *
         * @property {Phaser.Events.EventDispatcher} events
         */
        this.events = new EventDispatcher();
    },
    add: NOOP,
    addAudioSprite: NOOP,
    addOscillator: NOOP,
    remove: NOOP,
    removeByKey: NOOP,
    pauseAll: NOOP,
    resumeAll: NOOP,
    stopAll: NOOP,
    update: NOOP,
    destroy: NOOP
});
module.exports = BaseSoundManager;
