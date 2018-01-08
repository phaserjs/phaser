var Class = require('../../utils/Class');
var BaseSound = require('../BaseSound');
var HTML5AudioSound = new Class({
    Extends: BaseSound,
    initialize: function HTML5AudioSound(manager, key, config) {
        if (config === void 0) { config = {}; }
        this.audio = null;
        BaseSound.call(this, manager, key, config);
    }
});
module.exports = HTML5AudioSound;
