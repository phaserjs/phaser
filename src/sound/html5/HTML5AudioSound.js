var Class = require('../../utils/Class');
var BaseSound = require('../BaseSound');
var HTML5AudioSound = new Class({
    Extends: BaseSound,
    initialize: function HTML5AudioSound(manager, key, config) {
        if (config === void 0) { config = {}; }
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
