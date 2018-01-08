var Class = require('../../utils/Class');
var BaseSoundManager = require('../BaseSoundManager');
var HTML5AudioSoundManager = new Class({
    Extends: BaseSoundManager,
    initialize: function HTML5AudioSoundManager(game) {
        BaseSoundManager.call(this, game);
    }
});
module.exports = HTML5AudioSoundManager;
