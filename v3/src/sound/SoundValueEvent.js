var Class = require('../utils/Class');
var SoundEvent = require('./SoundEvent');

var SoundValueEvent = new Class({

    Extends: SoundEvent,

    initialize:

        function SoundValueEvent (sound, type, value)
        {
            SoundEvent.call(this, sound, type);

            this.value = value;
        }

});

module.exports = SoundValueEvent;
