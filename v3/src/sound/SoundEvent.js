var Class = require('../utils/Class');
var Event = require('../events/Event');

var SoundEvent = new Class({

    Extends: Event,

    initialize:

        function SoundEvent (sound, type)
        {
            Event.call(this, type);

            this.sound = sound;
        }

});

module.exports = SoundEvent;
