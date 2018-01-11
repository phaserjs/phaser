var Class = require('../../utils/Class');
var BaseSound = require('../BaseSound');
var HTML5AudioSound = new Class({
    Extends: BaseSound,
    initialize: function HTML5AudioSound(manager, key, config) {
        if (config === void 0) { config = {}; }
        /**
         * An array containing all HTML5 Audio tags that could be used for individual
         * sound's playback. Number of instances depends on the config value passed
         * to the Loader#audio method call, default is 1.
         *
         * @private
         * @property {HTMLAudioElement[]} tags
         */
        this.tags = manager.game.cache.audio.get(key);
        /**
         * Reference to HTML5 Audio tag used for playing sound.
         *
         * @private
         * @property {HTMLAudioElement} audio
         * @default null
         */
        this.audio = null;
        BaseSound.call(this, manager, key, config);
    }
});
module.exports = HTML5AudioSound;
